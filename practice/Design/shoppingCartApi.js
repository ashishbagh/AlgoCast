// ─────────────────────────────────────────────────────────────
// SHOPPING CART — API DESIGN
// (Think: Amazon / Flipkart / Swiggy checkout flow)
// ─────────────────────────────────────────────────────────────

// ── FUNCTIONAL REQUIREMENTS (Core — Must Have) ───────────────

// 1. CART MANAGEMENT
//    - Guest users can have a cart (no login required)
//    - Logged-in users have a persistent cart (synced across devices)
//    - Guest cart is merged into user cart on login
//    - User can add, update quantity, remove items from cart
//    - User can clear the entire cart

// 2. PRODUCT VALIDATION
//    - Each item added must be a real, available product
//    - Quantity must not exceed available stock
//    - Price shown in cart = live price at time of checkout (not add-to-cart time)
//    - Out-of-stock items are flagged in the cart — not auto-removed

// 3. PRICING & PROMOTIONS
//    - Cart shows itemized price: unit price × qty + taxes + delivery
//    - User can apply a coupon/promo code
//    - Coupon validates: exists, not expired, applicable to items in cart, usage limit
//    - Discounts shown line-by-line (item discount vs cart-level discount)

// 4. DELIVERY
//    - User selects delivery address from saved addresses or enters a new one
//    - Delivery fee calculated based on address + cart weight / value
//    - Delivery slots shown (standard / express / scheduled)
//    - Free delivery threshold checked (e.g. free above ₹499)

// 5. CHECKOUT & ORDER PLACEMENT
//    - Cart is "locked" during checkout to prevent concurrent modifications
//    - Stock re-validated at checkout (between add-to-cart and checkout, stock may deplete)
//    - Payment intent created (Stripe / Razorpay) before order is placed
//    - Order placed only after payment confirmation (avoid overselling)

// 6. SAVED FOR LATER / WISHLIST
//    - User can move items from cart to "Saved for Later"
//    - Saved items don't affect stock reservation

// ── NON-FUNCTIONAL REQUIREMENTS ──────────────────────────────

// 7.  PERFORMANCE    → Cart load < 200ms (real-time price + stock lookup)
// 8.  CONSISTENCY    → Stock check must be strong consistent at checkout (not eventual)
// 9.  IDEMPOTENCY    → Add-to-cart & checkout endpoints must be idempotent
//                      (duplicate requests from retry must not double-add items)
// 10. SCALABILITY    → Cart stored in Redis (fast R/W) + synced to DB on checkout
// 11. CONCURRENCY    → Optimistic locking on stock — two users can't buy the last unit
// 12. GUEST SUPPORT  → Guest carts via anonymous session token (no login required)
// 13. SECURITY       → Prices always computed server-side — never trust client price

// ── OUT OF SCOPE ──────────────────────────────────────────────
// - Payment processing internals (handled by Stripe / Razorpay)
// - Order tracking post-placement (separate Orders API)
// - Returns / refunds (separate Returns API)
// - Product catalog / search (separate Catalog API)

// ─────────────────────────────────────────────────────────────
// ENDPOINTS OVERVIEW
// ─────────────────────────────────────────────────────────────
//
//  CART
//    GET    /v1/cart                     → get current cart (guest or user)
//    POST   /v1/cart/items               → add item to cart
//    PATCH  /v1/cart/items/:item_id      → update quantity of an item
//    DELETE /v1/cart/items/:item_id      → remove item from cart
//    DELETE /v1/cart                     → clear entire cart
//    POST   /v1/cart/merge               → merge guest cart into user cart (on login)
//
//  PROMOTIONS
//    POST   /v1/cart/coupon              → apply coupon code
//    DELETE /v1/cart/coupon              → remove applied coupon
//
//  DELIVERY
//    GET    /v1/cart/delivery/options    → get available delivery slots + fees
//    PATCH  /v1/cart/delivery            → select delivery address + slot
//
//  SAVED FOR LATER
//    POST   /v1/cart/items/:item_id/save → move item from cart → saved for later
//    POST   /v1/cart/saved/:item_id/move → move item from saved → cart
//    GET    /v1/cart/saved               → list saved-for-later items
//    DELETE /v1/cart/saved/:item_id      → remove item from saved for later
//
//  CHECKOUT
//    POST   /v1/cart/checkout/validate   → pre-checkout validation (stock + price check)
//    POST   /v1/cart/checkout            → lock cart + create payment intent + place order


// ─────────────────────────────────────────────────────────────
// CART DATA MODEL (stored in Redis per session/user)
// ─────────────────────────────────────────────────────────────
//
// Design Notes:
//   • Guest cart  → keyed by anonymous session token (cookie: guest_cart_id)
//   • User cart   → keyed by user_id (persisted, synced across devices)
//   • Cart lives in Redis (fast) — TTL: 30 days for user, 7 days for guest
//   • Prices are NOT stored in cart — fetched live from product catalog on every GET
//   • ❌ Never trust prices from client — always compute server-side

const cartModel = {
    cart_id: "cart_abc123",
    owner_type: "user",                     // "user" | "guest"
    user_id: "usr_xyz789",                  // null for guest
    guest_token: null,                      // set for guest, null for user
    tenant_id: "store_india",              // which store/region this cart belongs to
    currency: "INR",

    items: [
        {
            item_id: "ci_001",              // cart item ID (unique within cart)
            product_id: "prod_abc",         // reference to product catalog
            variant_id: "var_red_xl",       // specific SKU (size, color, etc.)
            quantity: 2,
            added_at: "2026-03-10T09:00:00Z",
            // ❌ price NOT stored here — fetched live from catalog on every cart GET
        },
    ],

    coupon_code: "SAVE20",                  // null if no coupon applied
    delivery: {
        address_id: "addr_home",           // null until user selects address
        slot_id: "slot_express_tom",       // null until user selects slot
    },

    created_at: "2026-03-10T09:00:00Z",
    updated_at: "2026-03-10T09:05:00Z",
};


// ─────────────────────────────────────────────────────────────
// LAYER 1 — GET /v1/cart
// Get the full cart with live prices, stock status, and totals
// ─────────────────────────────────────────────────────────────
//
// Design Notes:
//   • For guests → read guest_cart_id from cookie (no auth header needed)
//   • For users  → read user_id from JWT → fetch their cart
//   • Every GET fetches LIVE prices from product catalog (prices change!)
//   • Every GET checks LIVE stock (item may have gone OOS since adding)
//   • Totals (subtotal, discount, tax, delivery) computed server-side every time
//
// Request headers:
//   Authorization: Bearer <jwt>       → for logged-in user
//   Cookie: guest_cart_id=token_xyz   → for guest (if no auth header)

const getCartResponse = {
    status: "success",
    data: {
        cart_id: "cart_abc123",
        owner_type: "user",
        currency: "INR",

        items: [
            {
                item_id: "ci_001",
                product_id: "prod_abc",
                variant_id: "var_red_xl",
                quantity: 2,

                // Product snapshot — fetched live from catalog
                product: {
                    name: "Nike Air Max 270",
                    brand: "Nike",
                    thumbnail_url: "https://cdn.example.com/airmax270_red.jpg",
                    variant_label: "Red / XL",
                    slug: "nike-air-max-270-red-xl",
                },

                // Live pricing (computed server-side — never from client)
                pricing: {
                    unit_price: 8999,           // ₹ current MRP
                    discount_percent: 10,        // item-level discount (sale, etc.)
                    discounted_price: 8099,      // unit_price after discount
                    line_total: 16198,           // discounted_price × quantity
                },

                // Live stock status
                stock: {
                    status: "in_stock",          // "in_stock" | "low_stock" | "out_of_stock"
                    available_qty: 5,            // how many units available
                    // ⚠️ If available_qty < quantity → "low_stock" or flag it
                    qty_exceeds_stock: false,    // true if user wants more than available
                },

                added_at: "2026-03-10T09:00:00Z",
            },
            {
                item_id: "ci_002",
                product_id: "prod_def",
                variant_id: "var_black_m",
                quantity: 1,

                product: {
                    name: "Levi's 511 Slim Jeans",
                    brand: "Levi's",
                    thumbnail_url: "https://cdn.example.com/levis511_black.jpg",
                    variant_label: "Black / M",
                    slug: "levis-511-slim-black-m",
                },

                pricing: {
                    unit_price: 3499,
                    discount_percent: 0,
                    discounted_price: 3499,
                    line_total: 3499,
                },

                stock: {
                    status: "low_stock",         // only 2 left
                    available_qty: 2,
                    qty_exceeds_stock: false,
                },

                added_at: "2026-03-10T09:02:00Z",
            },
        ],

        // Applied coupon (null if none)
        coupon: {
            code: "SAVE20",
            description: "20% off on orders above ₹500",
            discount_type: "percent",           // "percent" | "flat"
            discount_value: 20,                 // 20%
            discount_amount: 3939,              // actual ₹ discount on this cart
            is_valid: true,
            expiry: "2026-03-31T23:59:59Z",
        },

        // Delivery details
        delivery: {
            address: {
                address_id: "addr_home",
                label: "Home",
                line1: "12, MG Road",
                city: "Bengaluru",
                state: "Karnataka",
                pincode: "560001",
                country: "IN",
            },
            slot: {
                slot_id: "slot_express_tom",
                label: "Express Delivery",
                estimated_delivery: "Tomorrow by 10 PM",
                fee: 49,
            },
            // null if no address selected yet
            // address: null,
            // slot: null,
        },

        // ── CART TOTALS (all server-computed) ────────────────
        totals: {
            items_total: 19697,             // sum of all line_totals
            item_discount: 1900,            // total item-level discounts (sale prices)
            coupon_discount: 3939,          // coupon discount applied
            subtotal: 13858,                // items_total - item_discount - coupon_discount
            delivery_fee: 49,               // 0 if above free delivery threshold
            tax: 2494,                      // GST / VAT (18% on subtotal)
            grand_total: 16401,             // subtotal + delivery_fee + tax
            savings: 5839,                  // total saved = item_discount + coupon_discount
            free_delivery_threshold: 499,
            free_delivery_remaining: 0,     // 0 = already qualifies for free delivery
        },

        // Summary counts
        total_items: 3,                     // total quantity across all cart items (2+1)
        total_unique_items: 2,             // number of distinct products

        // Alerts to show user
        alerts: [
            {
                type: "low_stock",
                item_id: "ci_002",
                message: "Only 2 left in stock — order soon!",
            },
        ],

        updated_at: "2026-03-10T09:05:00Z",
    },
};


// ─────────────────────────────────────────────────────────────
// LAYER 2 — POST /v1/cart/items
// Add an item to the cart
// ─────────────────────────────────────────────────────────────
//
// Design Notes:
//   • IDEMPOTENT with idempotency key → duplicate requests don't double-add
//   • If product + variant already in cart → INCREMENT quantity (don't create new item)
//   • Stock check on add — soft check (warn, don't block; hard block at checkout)
//   • ❌ Never accept price from client — fetch from catalog
//
// Request headers:
//   Authorization: Bearer <jwt>       → for logged-in user
//   Cookie: guest_cart_id=token_xyz   → for guest
//   Idempotency-Key: uuid()           → prevent duplicate adds on retry

const addToCartPayload = {
    product_id: "prod_abc",
    variant_id: "var_red_xl",              // required if product has variants
    quantity: 1,
};

// HTTP 200 if item already in cart (qty incremented)
// HTTP 201 if new item added to cart
const addToCartResponse = {
    status: "success",
    data: {
        // The updated cart item (not the whole cart — use GET /v1/cart for full view)
        item: {
            item_id: "ci_001",
            product_id: "prod_abc",
            variant_id: "var_red_xl",
            quantity: 3,                    // was 2, now 3 (incremented)

            product: {
                name: "Nike Air Max 270",
                variant_label: "Red / XL",
                thumbnail_url: "https://cdn.example.com/airmax270_red.jpg",
            },

            pricing: {
                unit_price: 8999,
                discounted_price: 8099,
                line_total: 24297,          // updated: 8099 × 3
            },

            stock: {
                status: "in_stock",
                available_qty: 5,
                qty_exceeds_stock: false,
            },
        },

        // Updated cart summary
        cart_summary: {
            total_items: 4,
            grand_total: 24346,
        },

        // Alerts (if any)
        alerts: [],
    },
};

// HTTP 200 if quantity was capped at stock limit
const addToCartStockWarningResponse = {
    status: "success",
    data: {
        item: {
            item_id: "ci_001",
            product_id: "prod_abc",
            variant_id: "var_red_xl",
            quantity: 5,                    // capped at stock limit (user requested 10)
            stock: {
                status: "low_stock",
                available_qty: 5,
                qty_exceeds_stock: false,
            },
        },
        cart_summary: { total_items: 6, grand_total: 44642 },
        alerts: [
            {
                type: "qty_capped",
                message: "Only 5 units available. Quantity adjusted to 5.",
            },
        ],
    },
};


// ─────────────────────────────────────────────────────────────
// LAYER 3 — PATCH /v1/cart/items/:item_id
// Update quantity of a cart item
// ─────────────────────────────────────────────────────────────
//
// Design Notes:
//   • quantity: 0 → same as DELETE (remove the item)
//   • quantity: negative → 400 Bad Request
//   • quantity > stock → cap at stock + return alert (don't error)

const updateCartItemPayload = {
    quantity: 3,                            // new desired quantity (not a delta)
};

const updateCartItemResponse = {
    status: "success",
    data: {
        item: {
            item_id: "ci_001",
            product_id: "prod_abc",
            variant_id: "var_red_xl",
            quantity: 3,
            pricing: {
                unit_price: 8999,
                discounted_price: 8099,
                line_total: 24297,
            },
            stock: { status: "in_stock", available_qty: 5, qty_exceeds_stock: false },
        },
        cart_summary: { total_items: 4, grand_total: 27796 },
        alerts: [],
    },
};


// ─────────────────────────────────────────────────────────────
// LAYER 4 — DELETE /v1/cart/items/:item_id
// Remove a single item from the cart
// ─────────────────────────────────────────────────────────────

// HTTP 200 OK
const removeCartItemResponse = {
    status: "success",
    data: {
        removed_item_id: "ci_001",
        cart_summary: {
            total_items: 1,
            grand_total: 3548,
        },
    },
};

// DELETE /v1/cart — Clear entire cart
const clearCartResponse = {
    status: "success",
    data: {
        cart_id: "cart_abc123",
        items_removed: 2,
        message: "Your cart has been cleared.",
    },
};


// ─────────────────────────────────────────────────────────────
// LAYER 5 — POST /v1/cart/merge
// Merge guest cart into user cart on login
// ─────────────────────────────────────────────────────────────
//
// Design Notes:
//   • Called automatically by client right after login succeeds
//   • Strategy: for each guest cart item, if product exists in user cart → ADD quantities
//               if product not in user cart → MOVE item to user cart
//   • After merge → guest cart deleted from Redis
//   • If user cart is empty → guest cart items simply become user cart
//   • ❌ Don't silently fail — return merge result so client can show "cart merged" toast

const mergeCartPayload = {
    guest_token: "guest_token_xyz123",     // from guest_cart_id cookie
};

const mergeCartResponse = {
    status: "success",
    data: {
        merged_items: 2,                    // items moved from guest → user cart
        combined_items: 1,                  // items that were in both (quantities added)
        skipped_items: 0,                   // items skipped (OOS, product deleted, etc.)
        cart_summary: {
            total_items: 5,
            grand_total: 41994,
        },
        message: "2 items from your guest cart were added to your cart.",
    },
};


// ─────────────────────────────────────────────────────────────
// LAYER 6 — COUPON / PROMO CODE
// POST /v1/cart/coupon   → apply
// DELETE /v1/cart/coupon → remove
// ─────────────────────────────────────────────────────────────
//
// Design Notes:
//   • Only ONE coupon per cart at a time
//   • Validation: exists, not expired, min order value met, applicable to items in cart
//   • Coupon discount computed server-side — never trusted from client
//   • Usage limit check: e.g. "WELCOME50" can only be used once per user

const applyCouponPayload = {
    coupon_code: "SAVE20",
};

// HTTP 200 — coupon applied
const applyCouponResponse = {
    status: "success",
    data: {
        coupon: {
            code: "SAVE20",
            description: "20% off on orders above ₹500",
            discount_type: "percent",
            discount_value: 20,
            discount_amount: 3939,          // actual ₹ off this cart
            is_valid: true,
            expiry: "2026-03-31T23:59:59Z",
        },
        // Updated totals after coupon
        totals: {
            items_total: 19697,
            coupon_discount: 3939,
            subtotal: 15758,
            delivery_fee: 49,
            tax: 2836,
            grand_total: 18643,
            savings: 5839,
        },
    },
};

// HTTP 422 — coupon invalid
const applyCouponErrorResponse = {
    status: "error",
    error: {
        code: "COUPON_INVALID",
        message: "This coupon is not applicable to your cart.",
        details: {
            reason: "MIN_ORDER_NOT_MET",
            // "COUPON_NOT_FOUND"       → code doesn't exist
            // "COUPON_EXPIRED"         → past expiry date
            // "MIN_ORDER_NOT_MET"      → cart total below min threshold
            // "MAX_USAGE_REACHED"      → coupon used max times globally
            // "ALREADY_USED"          → this user already used this coupon
            // "NOT_APPLICABLE"        → coupon not valid for items in cart
            min_order_required: 2000,
            current_cart_total: 1500,
        },
        request_id: "req_abc123",
    },
};


// ─────────────────────────────────────────────────────────────
// LAYER 7 — DELIVERY OPTIONS
// GET /v1/cart/delivery/options?address_id=addr_home
// ─────────────────────────────────────────────────────────────
//
// Design Notes:
//   • Delivery fee and slots depend on: address pincode + cart weight + cart value
//   • Free delivery threshold applied here
//   • Slots are real-time (from delivery partner API — Dunzo, Delhivery, etc.)
//   • If no slots available → show "Delivery not available to this pincode"

const deliveryOptionsResponse = {
    status: "success",
    data: {
        address: {
            address_id: "addr_home",
            line1: "12, MG Road",
            city: "Bengaluru",
            pincode: "560001",
        },

        // Is delivery available to this pincode at all?
        is_serviceable: true,

        // Free delivery info
        free_delivery_threshold: 499,
        cart_qualifies_for_free_delivery: true,

        // Available delivery options
        options: [
            {
                slot_id: "slot_standard",
                type: "standard",
                label: "Standard Delivery",
                estimated_delivery: "3–5 business days",
                estimated_date: "2026-03-13",
                fee: 0,                     // free (cart is above threshold)
                is_default: false,
            },
            {
                slot_id: "slot_express_tom",
                type: "express",
                label: "Express Delivery",
                estimated_delivery: "Tomorrow by 10 PM",
                estimated_date: "2026-03-11",
                fee: 49,                    // express has a fee even above threshold
                is_default: true,
            },
            {
                slot_id: "slot_scheduled_am",
                type: "scheduled",
                label: "Scheduled — Tomorrow 9 AM–12 PM",
                estimated_delivery: "Tomorrow, 9 AM–12 PM",
                estimated_date: "2026-03-11",
                fee: 0,
                is_default: false,
            },
        ],
    },
};

// PATCH /v1/cart/delivery — Select address + slot
const selectDeliveryPayload = {
    address_id: "addr_home",               // must be one of user's saved addresses
    slot_id: "slot_express_tom",
};

const selectDeliveryResponse = {
    status: "success",
    data: {
        delivery: {
            address: {
                address_id: "addr_home",
                label: "Home",
                line1: "12, MG Road",
                city: "Bengaluru",
                pincode: "560001",
            },
            slot: {
                slot_id: "slot_express_tom",
                label: "Express Delivery",
                estimated_delivery: "Tomorrow by 10 PM",
                fee: 49,
            },
        },
        // Updated totals with delivery fee
        totals: {
            subtotal: 15758,
            delivery_fee: 49,
            tax: 2836,
            grand_total: 18643,
        },
    },
};


// ─────────────────────────────────────────────────────────────
// LAYER 8 — SAVED FOR LATER
// POST   /v1/cart/items/:item_id/save    → move cart item → saved
// GET    /v1/cart/saved                  → list saved items
// POST   /v1/cart/saved/:item_id/move    → move saved item → cart
// DELETE /v1/cart/saved/:item_id         → remove from saved
// ─────────────────────────────────────────────────────────────
//
// Design Notes:
//   • Saved items do NOT affect inventory reservation
//   • Saved items persist indefinitely (not TTL'd like cart)
//   • Live price + stock fetched on GET (item may be OOS or price may have changed)

// POST /v1/cart/items/:item_id/save
const saveForLaterResponse = {
    status: "success",
    data: {
        saved_item_id: "si_001",
        product_id: "prod_abc",
        variant_id: "var_red_xl",
        saved_at: "2026-03-10T10:00:00Z",
        cart_summary: { total_items: 1, grand_total: 3548 },
    },
};

// GET /v1/cart/saved
const getSavedItemsResponse = {
    status: "success",
    data: {
        saved_items: [
            {
                saved_item_id: "si_001",
                product_id: "prod_abc",
                variant_id: "var_red_xl",
                saved_at: "2026-03-10T10:00:00Z",

                product: {
                    name: "Nike Air Max 270",
                    variant_label: "Red / XL",
                    thumbnail_url: "https://cdn.example.com/airmax270_red.jpg",
                },

                // Live price — may differ from when user saved it
                pricing: {
                    unit_price: 8999,
                    discounted_price: 7999,   // price dropped since saved! Show "Price dropped" badge
                    price_dropped: true,      // ✅ highlight to re-engage user
                },

                stock: {
                    status: "in_stock",
                    available_qty: 3,
                },
            },
        ],
        total: 1,
    },
};


// ─────────────────────────────────────────────────────────────
// LAYER 9 — CHECKOUT
// POST /v1/cart/checkout/validate   → pre-checkout validation
// POST /v1/cart/checkout            → place the order
// ─────────────────────────────────────────────────────────────

// ── STEP 1: Pre-Checkout Validation ──────────────────────────
// POST /v1/cart/checkout/validate
//
// Design Notes:
//   • Call this BEFORE showing the payment screen
//   • Re-validates everything: stock, prices, coupon, address, slot
//   • Returns a validation_token (short-lived) — required for POST /checkout
//   • If anything changed (price, stock) → return diff so UI can show "prices updated" banner
//   • ❌ Does NOT lock stock — just validates. Stock locked only in POST /checkout

const checkoutValidateResponse = {
    status: "success",
    data: {
        is_valid: true,

        // validation_token — proves validation was done. Required in POST /checkout
        // Expires in 10 minutes — user must checkout before it expires
        validation_token: "val_token_abc123",
        expires_at: "2026-03-10T09:20:00Z",

        // Changes detected since user last viewed cart
        changes: [
            // Empty if nothing changed
            // If prices changed:
            // { type: "price_change", item_id: "ci_001", old_price: 8999, new_price: 8499, message: "Price dropped!" }
            // If stock depleted:
            // { type: "out_of_stock", item_id: "ci_002", message: "Levi's 511 is now out of stock" }
            // If coupon no longer valid:
            // { type: "coupon_invalid", code: "SAVE20", message: "Coupon expired" }
        ],

        // Final validated totals
        totals: {
            items_total: 19697,
            item_discount: 1900,
            coupon_discount: 3939,
            subtotal: 13858,
            delivery_fee: 49,
            tax: 2494,
            grand_total: 16401,
        },

        // Delivery confirmed
        delivery: {
            address_id: "addr_home",
            slot_id: "slot_express_tom",
            estimated_delivery: "Tomorrow by 10 PM",
        },
    },
};

// is_valid: false — something changed that blocks checkout
const checkoutValidateFailResponse = {
    status: "success",                      // HTTP 200 (this is expected business logic, not a server error)
    data: {
        is_valid: false,
        validation_token: null,             // no token — must resolve issues before checkout

        changes: [
            {
                type: "out_of_stock",
                item_id: "ci_002",
                product_name: "Levi's 511 Slim Jeans",
                message: "This item is no longer available.",
                action_required: "remove_item", // client should remove or save for later
            },
            {
                type: "price_change",
                item_id: "ci_001",
                old_price: 8999,
                new_price: 9499,
                message: "Price has increased since you added this item.",
                action_required: "acknowledge",  // user must accept new price
            },
        ],
    },
};


// ── STEP 2: Place Order (Checkout) ────────────────────────────
// POST /v1/cart/checkout
//
// Design Notes:
//   • Requires validation_token from Step 1 (proves cart was validated recently)
//   • LOCKS stock (decrement inventory) — done with optimistic locking (DB transaction)
//     If two users checkout last unit simultaneously → first wins, second gets 409 Conflict
//   • Creates payment intent with payment provider (Stripe / Razorpay)
//   • Does NOT charge the user — payment is confirmed separately by client (via SDK)
//   • Order is created with status "pending_payment"
//   • Order moves to "confirmed" only after payment webhook fires
//   • Cart is cleared only after "confirmed"

const checkoutPayload = {
    validation_token: "val_token_abc123",   // from Step 1 — proves cart was validated

    // Payment
    payment: {
        method: "card",                     // "card" | "upi" | "netbanking" | "cod" | "wallet"
        // For "card" — client handles card details via Stripe/Razorpay SDK
        // We never see raw card numbers — PCI compliance
    },

    // Billing address (may differ from delivery)
    billing_address_id: "addr_home",        // use same as delivery, or different
};

// HTTP 201 Created — Order initiated, payment pending
const checkoutResponse = {
    status: "success",
    data: {
        order_id: "ord_xyz789",
        order_status: "pending_payment",

        // Payment intent — client uses this to complete payment via SDK
        payment_intent: {
            provider: "razorpay",
            intent_id: "pay_abc123",
            client_secret: "rzp_key_xyz...", // client uses this with Razorpay SDK to show payment UI
            amount: 16401,
            currency: "INR",
        },

        // Final order summary
        summary: {
            items_total: 19697,
            coupon_discount: 3939,
            delivery_fee: 49,
            tax: 2494,
            grand_total: 16401,
            estimated_delivery: "Tomorrow by 10 PM",
        },

        // ✅ Cart is NOT cleared yet — only cleared after payment confirmed via webhook
        // If payment fails → cart still intact, user can retry
    },
};

// POST /v1/cart/checkout — 409 Conflict (stock ran out between validate + checkout)
const checkoutStockConflictResponse = {
    status: "error",
    error: {
        code: "STOCK_CONFLICT",
        message: "Some items are no longer available. Please review your cart.",
        details: {
            conflicting_items: [
                {
                    item_id: "ci_002",
                    product_name: "Levi's 511 Slim Jeans",
                    requested_qty: 1,
                    available_qty: 0,
                },
            ],
        },
        request_id: "req_abc123",
    },
};


// ─────────────────────────────────────────────────────────────
// ERROR HANDLING — Consistent format across all endpoints
// ─────────────────────────────────────────────────────────────

// 400 — Missing required fields
const badRequestError = {
    status: "error",
    error: {
        code: "VALIDATION_ERROR",
        message: "Invalid request payload.",
        details: [
            { field: "product_id", issue: "product_id is required" },
            { field: "quantity", issue: "quantity must be a positive integer" },
        ],
        request_id: "req_abc123",
    },
};

// 404 — Product not found (trying to add a deleted product)
const productNotFoundError = {
    status: "error",
    error: {
        code: "PRODUCT_NOT_FOUND",
        message: "The product you are trying to add no longer exists.",
        details: { product_id: "prod_abc" },
        request_id: "req_abc123",
    },
};

// 404 — Cart item not found (trying to update/delete a non-existent item_id)
const cartItemNotFoundError = {
    status: "error",
    error: {
        code: "CART_ITEM_NOT_FOUND",
        message: "This item is not in your cart.",
        details: { item_id: "ci_999" },
        request_id: "req_abc123",
    },
};

// 410 — Validation token expired (user took too long on payment screen)
const validationTokenExpiredError = {
    status: "error",
    error: {
        code: "VALIDATION_TOKEN_EXPIRED",
        message: "Your session timed out. Please review your cart and try again.",
        request_id: "req_abc123",
    },
};

// 429 — Rate limit (bot protection on add-to-cart for flash sales)
const rateLimitError = {
    status: "error",
    error: {
        code: "TOO_MANY_REQUESTS",
        message: "Too many requests. Please slow down.",
        retry_after_seconds: 5,
        request_id: "req_abc123",
    },
};


// ─────────────────────────────────────────────────────────────
// RATE LIMITING
// ─────────────────────────────────────────────────────────────
//
//  GET  /v1/cart                   → 60  req/min  per user/guest (polling-friendly)
//  POST /v1/cart/items             → 30  req/min  per user/guest (bot protection)
//  POST /v1/cart/coupon            → 10  req/min  per user (brute-force protection)
//  POST /v1/cart/checkout          → 5   req/min  per user (extra strict)
//  POST /v1/cart/checkout/validate → 10  req/min  per user


// ─────────────────────────────────────────────────────────────
// IDEMPOTENCY
// ─────────────────────────────────────────────────────────────
//
//  POST /v1/cart/items    → requires Idempotency-Key header
//                           Same key + same payload = returns same result, no duplicate add
//                           Key stored in Redis with 24h TTL
//
//  POST /v1/cart/checkout → idempotency via validation_token (single-use, 10 min TTL)
//                           Re-submitting same checkout → returns existing order (no new charge)
//
//  PATCH + DELETE         → naturally idempotent (setting qty to 3 twice = same result)
