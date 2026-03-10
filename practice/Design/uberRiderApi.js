// ─────────────────────────────────────────────────────────────
// UBER — RIDER API DESIGN
// (The API powering the passenger side of the Uber app)
// ─────────────────────────────────────────────────────────────

// ── WHAT ARE WE BUILDING? ─────────────────────────────────────
// The Rider API is everything the passenger interacts with:
// open app → pick destination → see fare estimates → book ride →
// track driver in real time → complete trip → pay → rate driver.
//
// There are TWO separate apps:
//   Rider App  → this file (passenger side)
//   Driver App → separate API (driver accepts trips, updates location)
//
// The two apps talk to each other via a shared matching + dispatch system.
// This file only designs the RIDER-facing API.

// ── FUNCTIONAL REQUIREMENTS (Core — Must Have) ───────────────

// 1. LOCATION & ADDRESS
//    - Rider shares current location (GPS) on app open
//    - Rider can search for pickup and drop-off addresses
//    - Rider can save favourite addresses (Home, Work, etc.)

// 2. FARE ESTIMATION
//    - Before booking, rider sees available ride types (UberGo, UberX, Auto, Moto)
//    - Each ride type shows: estimated fare, ETA, surge multiplier
//    - Estimate is NOT a guaranteed price — final price set at trip end

// 3. RIDE BOOKING
//    - Rider selects ride type and confirms booking
//    - System finds nearest available driver (matching engine — out of scope here)
//    - Rider can schedule a ride up to 7 days in advance
//    - Rider can add a note for driver (e.g. "Gate 2", "Call on arrival")

// 4. REAL-TIME RIDE TRACKING
//    - After booking, rider sees driver's live location on map
//    - Rider sees: driver name, photo, vehicle details, rating, live ETA
//    - Ride state machine drives the UI:
//      searching → accepted → driver_arriving → driver_arrived → in_progress → completed
//    - Rider can contact driver (masked call / chat)

// 5. CANCELLATION
//    - Rider can cancel before driver arrives (free within grace period)
//    - Cancellation fee applied if driver is already on the way (past grace period)
//    - If driver cancels → rider is automatically re-matched

// 6. PAYMENT
//    - Payment auto-charged to saved method after trip completes
//    - Rider can split fare with other riders
//    - Receipt breakdown: base fare + distance + time + surge + taxes + tip

// 7. RATINGS & FEEDBACK
//    - Rider rates driver (1–5 stars) after each trip
//    - Rider can add optional feedback tags + comment
//    - Rider cannot book next trip without rating previous one (optional enforcement)

// 8. RIDE HISTORY
//    - Rider can view all past trips with full details + receipt
//    - Rider can re-book a past trip (same pickup + drop)

// 9. SAFETY
//    - Rider can share trip status with emergency contact
//    - SOS button sends alert with live location to emergency services
//    - Ride recording (audio) can be enabled on device

// ── NON-FUNCTIONAL REQUIREMENTS ──────────────────────────────

// 10. REAL-TIME    → driver location updates every 3–5 seconds (WebSocket / SSE)
// 11. LATENCY      → ride booking response < 500ms (time-sensitive UX)
// 12. AVAILABILITY → 99.99% uptime — ride failure = revenue loss + user trust loss
// 13. CONSISTENCY  → ride state must be strongly consistent (no duplicate bookings)
// 14. SCALABILITY  → millions of concurrent active rides globally
// 15. SECURITY     → phone numbers masked between rider and driver (Twilio proxy)
// 16. IDEMPOTENCY  → booking endpoint must be idempotent (network retries are common)

// ── OUT OF SCOPE ──────────────────────────────────────────────
// - Driver-side API (driver app, location updates, trip acceptance)
// - Matching / dispatch engine (separate internal service)
// - Payment processing internals (Stripe / Braintree)
// - Uber Eats (separate product)
// - Surge pricing algorithm (internal pricing service)

// ─────────────────────────────────────────────────────────────
// RIDE STATE MACHINE
// ─────────────────────────────────────────────────────────────
//
//              ┌──────────────┐
//              │  searching   │  ← Ride booked, finding driver
//              └──────┬───────┘
//                     │ Driver found
//              ┌──────▼───────┐
//              │   accepted   │  ← Driver accepted, heading to pickup
//              └──────┬───────┘
//                     │ Driver near pickup
//              ┌──────▼────────────┐
//              │  driver_arriving  │  ← Driver < X minutes away
//              └──────┬────────────┘
//                     │ Driver at pickup location
//              ┌──────▼───────────┐
//              │  driver_arrived  │  ← Driver waiting for rider
//              └──────┬───────────┘
//                     │ Trip started (driver hits "Start Trip")
//              ┌──────▼───────┐
//              │ in_progress  │  ← Trip underway
//              └──────┬───────┘
//                     │ Driver hits "End Trip" at destination
//              ┌──────▼───────┐
//              │  completed   │  ← Payment processed, rating screen shown
//              └──────────────┘
//
//  Can transition to "cancelled" from: searching, accepted, driver_arriving, driver_arrived
//  Can transition to "no_drivers_found" from: searching (timeout after ~2 min)

// ─────────────────────────────────────────────────────────────
// ENDPOINTS OVERVIEW
// ─────────────────────────────────────────────────────────────
//
//  LOCATION & ADDRESS
//    GET    /v1/places/search              → search addresses (autocomplete)
//    GET    /v1/places/:place_id           → get place details (lat/lng)
//    GET    /v1/rider/addresses            → get saved addresses (Home, Work, etc.)
//    POST   /v1/rider/addresses            → save a new address
//    DELETE /v1/rider/addresses/:id        → remove saved address
//
//  FARE ESTIMATION
//    POST   /v1/rides/estimate             → get fare + ETA for all ride types
//
//  RIDE BOOKING
//    POST   /v1/rides                      → book a ride (idempotent via Idempotency-Key)
//    GET    /v1/rides/:ride_id             → get current ride status + driver location
//    DELETE /v1/rides/:ride_id             → cancel a ride
//    PATCH  /v1/rides/:ride_id/destination → change destination mid-trip
//
//  REAL-TIME (WebSocket or SSE)
//    WS     /v1/rides/:ride_id/live        → live driver location + ride state stream
//
//  COMMUNICATION
//    POST   /v1/rides/:ride_id/contact     → initiate masked call/chat to driver
//
//  PAYMENT
//    GET    /v1/rider/payment-methods      → list saved payment methods
//    POST   /v1/rider/payment-methods      → add payment method
//    DELETE /v1/rider/payment-methods/:id  → remove payment method
//    PATCH  /v1/rider/payment-methods/:id/default → set default method
//    POST   /v1/rides/:ride_id/tip         → add tip after trip
//    POST   /v1/rides/:ride_id/split-fare  → invite others to split fare
//
//  RATINGS
//    POST   /v1/rides/:ride_id/rating      → rate driver after trip
//
//  HISTORY
//    GET    /v1/rides                      → paginated ride history
//    GET    /v1/rides/:ride_id/receipt     → full receipt for a completed trip


// ─────────────────────────────────────────────────────────────
// LAYER 1 — PLACE SEARCH & SAVED ADDRESSES
// GET /v1/places/search?q=mg+road&lat=12.97&lng=77.59&session_token=tok_abc
// ─────────────────────────────────────────────────────────────
//
// Design Notes:
//   • Backed by Google Places API (or Mapbox) — proxied through our server
//     ❌ Don't call Google Places directly from client (exposes API key)
//     ✅ Client → our server → Google Places → our server → client
//   • session_token: groups autocomplete + place detail calls for billing
//   • Bias results toward rider's current location (lat/lng)
//   • For Indian cities: also search local landmarks ("Indiranagar metro", "Forum Mall")

const placeSearchResponse = {
    status: "success",
    data: {
        query: "mg road",
        suggestions: [
            {
                place_id: "ChIJplace_abc123",          // Google Places / internal place ID
                primary_text: "MG Road",
                secondary_text: "Bengaluru, Karnataka, India",
                full_address: "MG Road, Bengaluru, Karnataka 560001, India",
                types: ["route"],                      // "route" | "establishment" | "airport" | etc.
                distance_meters: 1200,                 // distance from rider's current location
            },
            {
                place_id: "ChIJplace_def456",
                primary_text: "MG Road Metro Station",
                secondary_text: "MG Road, Bengaluru",
                full_address: "MG Road Metro Station, MG Road, Bengaluru",
                types: ["transit_station", "establishment"],
                distance_meters: 1350,
            },
        ],
    },
};

// GET /v1/places/:place_id — Resolve a place_id to lat/lng (for map pin + booking)
const placeDetailResponse = {
    status: "success",
    data: {
        place_id: "ChIJplace_abc123",
        name: "MG Road",
        full_address: "MG Road, Bengaluru, Karnataka 560001, India",
        location: {
            lat: 12.9752,
            lng: 77.6060,
        },
        types: ["route"],
    },
};

// GET /v1/rider/addresses — Saved addresses (Home, Work, custom)
const savedAddressesResponse = {
    status: "success",
    data: {
        addresses: [
            {
                address_id: "addr_home",
                label: "Home",
                icon: "home",
                full_address: "12, 4th Cross, Indiranagar, Bengaluru 560038",
                location: { lat: 12.9784, lng: 77.6408 },
            },
            {
                address_id: "addr_work",
                label: "Work",
                icon: "work",
                full_address: "Prestige Tech Park, Outer Ring Road, Bengaluru 560103",
                location: { lat: 12.9352, lng: 77.6947 },
            },
        ],
    },
};


// ─────────────────────────────────────────────────────────────
// LAYER 2 — FARE ESTIMATION
// POST /v1/rides/estimate
// ─────────────────────────────────────────────────────────────
//
// Design Notes:
//   • Called as soon as rider selects pickup + drop — before tapping "Book"
//   • Returns ALL available ride categories so rider can compare
//   • Estimate is a RANGE (not a fixed price) — surge can change before booking
//   • ETA = time for driver to arrive at pickup (not trip duration)
//   • estimate_id is short-lived (5 min) — passed in POST /rides to anchor the estimate
//   • ❌ Don't call this too frequently — debounce 500ms on address changes

const fareEstimatePayload = {
    pickup: {
        location: { lat: 12.9784, lng: 77.6408 },
        address: "12, 4th Cross, Indiranagar, Bengaluru",
        place_id: "ChIJplace_pickup",
    },
    dropoff: {
        location: { lat: 12.9352, lng: 77.6947 },
        address: "Prestige Tech Park, Outer Ring Road, Bengaluru",
        place_id: "ChIJplace_dropoff",
    },
    scheduled_at: null,                    // null = ride now | ISO timestamp = scheduled ride
};

const fareEstimateResponse = {
    status: "success",
    data: {
        estimate_id: "est_abc123",          // short-lived token — use within 5 min or re-estimate
        expires_at: "2026-03-10T09:15:00Z",

        // Route info (same for all ride types)
        route: {
            distance_km: 8.4,
            duration_min: 22,               // estimated trip time (not driver ETA)
            polyline: "encoded_polyline_string", // Google encoded polyline for drawing route on map
        },

        // One entry per available ride category
        options: [
            {
                category_id: "uber_moto",
                category_name: "Moto",
                description: "Affordable motorcycle rides",
                icon_url: "https://cdn.uber.com/icons/moto.png",
                capacity: 1,                // max passengers

                // Fare
                fare: {
                    currency: "INR",
                    min: 65,                // fare range min
                    max: 80,               // fare range max (surge can push toward max)
                    display: "₹65–₹80",
                },

                // Surge
                surge: {
                    is_active: false,
                    multiplier: 1.0,        // 1.0 = no surge | 1.5 = 1.5x = 50% more
                    label: null,            // null | "1.5x surge" — shown as badge
                },

                // Driver availability in area
                drivers_nearby: 6,
                pickup_eta_min: 4,          // minutes until driver arrives at pickup

                // For scheduled rides
                scheduled_available: true,
            },
            {
                category_id: "uber_auto",
                category_name: "Auto",
                description: "Affordable auto-rickshaw rides",
                icon_url: "https://cdn.uber.com/icons/auto.png",
                capacity: 3,
                fare: { currency: "INR", min: 95, max: 110, display: "₹95–₹110" },
                surge: { is_active: false, multiplier: 1.0, label: null },
                drivers_nearby: 12,
                pickup_eta_min: 3,
                scheduled_available: true,
            },
            {
                category_id: "uber_go",
                category_name: "UberGo",
                description: "Affordable compact cars",
                icon_url: "https://cdn.uber.com/icons/ubergo.png",
                capacity: 4,
                fare: { currency: "INR", min: 140, max: 175, display: "₹140–₹175" },
                surge: { is_active: true, multiplier: 1.3, label: "1.3x" },
                drivers_nearby: 8,
                pickup_eta_min: 5,
                scheduled_available: true,
            },
            {
                category_id: "uber_x",
                category_name: "UberX",
                description: "Comfortable sedans",
                icon_url: "https://cdn.uber.com/icons/uberx.png",
                capacity: 4,
                fare: { currency: "INR", min: 210, max: 260, display: "₹210–₹260" },
                surge: { is_active: true, multiplier: 1.3, label: "1.3x" },
                drivers_nearby: 4,
                pickup_eta_min: 7,
                scheduled_available: true,
            },
            {
                category_id: "uber_xl",
                category_name: "UberXL",
                description: "Larger vehicles for groups",
                icon_url: "https://cdn.uber.com/icons/uberxl.png",
                capacity: 6,
                fare: { currency: "INR", min: 320, max: 390, display: "₹320–₹390" },
                surge: { is_active: false, multiplier: 1.0, label: null },
                drivers_nearby: 2,
                pickup_eta_min: 12,
                scheduled_available: true,
            },
        ],
    },
};


// ─────────────────────────────────────────────────────────────
// LAYER 3 — BOOK A RIDE
// POST /v1/rides
// ─────────────────────────────────────────────────────────────
//
// Design Notes:
//   • IDEMPOTENT — include Idempotency-Key header (UUID per booking attempt)
//     Network timeout → client retries → same key → same ride, no duplicate booking
//   • estimate_id passed in to anchor the fare estimate (validated server-side)
//   • If estimate expired → 422 (rider must re-estimate before booking)
//   • Payment method validated before creating ride
//   • After booking → system sends ride_id to matching engine (out of scope here)
//   • Response is IMMEDIATE (< 500ms) — don't wait for driver match
//     Driver matching happens async — rider polls or listens via WebSocket

// Request headers:
//   Authorization: Bearer <jwt>
//   Idempotency-Key: uuid()           → REQUIRED — prevents duplicate rides on retry

const bookRidePayload = {
    estimate_id: "est_abc123",             // from POST /rides/estimate — validates fare is fresh

    // What to book
    category_id: "uber_go",

    // Pickup + drop (echoed from estimate, but re-sent for server-side validation)
    pickup: {
        location: { lat: 12.9784, lng: 77.6408 },
        address: "12, 4th Cross, Indiranagar, Bengaluru",
        place_id: "ChIJplace_pickup",
    },
    dropoff: {
        location: { lat: 12.9352, lng: 77.6947 },
        address: "Prestige Tech Park, Outer Ring Road, Bengaluru",
        place_id: "ChIJplace_dropoff",
    },

    // Note for driver (optional)
    driver_note: "Please call on arrival. Gate 2.",

    // Payment
    payment_method_id: "pm_card_xyz",     // from /v1/rider/payment-methods

    // Scheduled ride (null = book immediately)
    scheduled_at: null,

    // Split fare (optional — invite added later via POST /rides/:id/split-fare)
    split_fare: false,
};

// HTTP 201 Created — ride created, now searching for driver
const bookRideResponse = {
    status: "success",
    data: {
        ride_id: "ride_xyz789",
        state: "searching",                // initial state — driver not yet found

        // Confirmed details
        category: {
            category_id: "uber_go",
            category_name: "UberGo",
            icon_url: "https://cdn.uber.com/icons/ubergo.png",
        },

        pickup: {
            location: { lat: 12.9784, lng: 77.6408 },
            address: "12, 4th Cross, Indiranagar, Bengaluru",
        },
        dropoff: {
            location: { lat: 12.9352, lng: 77.6947 },
            address: "Prestige Tech Park, Outer Ring Road, Bengaluru",
        },

        // Fare (locked in from estimate — subject to final calculation at trip end)
        fare_estimate: {
            currency: "INR",
            min: 140,
            max: 175,
            display: "₹140–₹175",
            surge_multiplier: 1.3,
        },

        driver: null,                      // null until driver accepts (state = "accepted")

        // Cancellation policy
        cancellation_policy: {
            free_until: "2026-03-10T09:07:00Z",   // 5 min grace window from booking
            fee_after_grace: 30,                   // ₹30 cancellation fee after grace period
            currency: "INR",
        },

        scheduled_at: null,
        created_at: "2026-03-10T09:02:00Z",

        // How to receive live updates (connect immediately after booking)
        realtime: {
            websocket_url: "wss://realtime.uber.com/v1/rides/ride_xyz789/live",
            // fallback if WebSocket not available:
            poll_url: "https://api.uber.com/v1/rides/ride_xyz789",
            poll_interval_seconds: 5,
        },
    },
};


// ─────────────────────────────────────────────────────────────
// LAYER 4 — GET RIDE STATUS
// GET /v1/rides/:ride_id
// ─────────────────────────────────────────────────────────────
//
// Design Notes:
//   • Fallback for when WebSocket is unavailable (poor connectivity)
//   • Client polls every 5 seconds while ride is active
//   • Returns full ride state including driver's current location
//   • When state = "completed" → stop polling, show receipt + rating screen

const getRideResponse_accepted = {
    status: "success",
    data: {
        ride_id: "ride_xyz789",
        state: "accepted",                 // driver found and accepted the trip

        // Driver info — shown to rider after driver accepts
        driver: {
            driver_id: "drv_abc123",
            name: "Ravi Kumar",
            photo_url: "https://cdn.uber.com/drivers/ravi_kumar.jpg",
            rating: 4.87,
            total_trips: 3420,

            vehicle: {
                make: "Maruti",
                model: "Swift Dzire",
                color: "White",
                license_plate: "KA 01 AB 1234",
                year: 2022,
            },

            // Live driver location (updated every 3–5 seconds via WebSocket)
            current_location: { lat: 12.9810, lng: 77.6380 },

            // ETA to pickup
            pickup_eta_min: 4,             // updated dynamically
            pickup_distance_km: 0.8,
        },

        // Pickup + dropoff unchanged
        pickup: {
            location: { lat: 12.9784, lng: 77.6408 },
            address: "12, 4th Cross, Indiranagar, Bengaluru",
        },
        dropoff: {
            location: { lat: 12.9352, lng: 77.6947 },
            address: "Prestige Tech Park, Outer Ring Road, Bengaluru",
        },

        fare_estimate: {
            currency: "INR",
            min: 140,
            max: 175,
            display: "₹140–₹175",
            surge_multiplier: 1.3,
        },

        cancellation_policy: {
            free_until: "2026-03-10T09:07:00Z",
            fee_after_grace: 30,
            currency: "INR",
            // After grace period: is_free_cancellation = false
            is_free_cancellation: true,
        },

        created_at: "2026-03-10T09:02:00Z",
    },
};

// State: "in_progress" — trip underway
const getRideResponse_inProgress = {
    status: "success",
    data: {
        ride_id: "ride_xyz789",
        state: "in_progress",

        driver: {
            driver_id: "drv_abc123",
            name: "Ravi Kumar",
            vehicle: { make: "Maruti", model: "Swift Dzire", color: "White", license_plate: "KA 01 AB 1234" },
            current_location: { lat: 12.9600, lng: 77.6700 }, // driver moving toward dropoff
        },

        pickup: { location: { lat: 12.9784, lng: 77.6408 }, address: "12, 4th Cross, Indiranagar" },
        dropoff: { location: { lat: 12.9352, lng: 77.6947 }, address: "Prestige Tech Park" },

        // Live trip progress
        trip: {
            started_at: "2026-03-10T09:10:00Z",
            distance_covered_km: 3.2,
            dropoff_eta_min: 11,           // ETA to destination (updated dynamically)
        },

        fare_estimate: { currency: "INR", min: 140, max: 175, display: "₹140–₹175", surge_multiplier: 1.3 },
        created_at: "2026-03-10T09:02:00Z",
    },
};

// State: "completed" — trip done, show receipt + rating screen
const getRideResponse_completed = {
    status: "success",
    data: {
        ride_id: "ride_xyz789",
        state: "completed",

        driver: {
            driver_id: "drv_abc123",
            name: "Ravi Kumar",
            photo_url: "https://cdn.uber.com/drivers/ravi_kumar.jpg",
            rating: 4.87,
            vehicle: { make: "Maruti", model: "Swift Dzire", color: "White", license_plate: "KA 01 AB 1234" },
        },

        pickup: { location: { lat: 12.9784, lng: 77.6408 }, address: "12, 4th Cross, Indiranagar" },
        dropoff: { location: { lat: 12.9352, lng: 77.6947 }, address: "Prestige Tech Park" },

        trip: {
            started_at: "2026-03-10T09:10:00Z",
            ended_at: "2026-03-10T09:31:00Z",
            duration_min: 21,
            distance_km: 8.2,
        },

        // Final fare — only available when state = "completed"
        fare: {
            currency: "INR",
            base_fare: 40,
            distance_charge: 74,           // ₹9/km × 8.2 km
            time_charge: 21,               // ₹1/min × 21 min
            surge_charge: 41,              // 1.3x surge extra
            subtotal: 176,
            tax: 32,
            tip: 0,
            total: 208,
            payment_method: "Visa ••••4242",
            receipt_url: "https://receipts.uber.com/ride_xyz789",
        },

        // Rating not yet submitted
        rating_submitted: false,

        created_at: "2026-03-10T09:02:00Z",
        completed_at: "2026-03-10T09:31:00Z",
    },
};


// ─────────────────────────────────────────────────────────────
// LAYER 5 — REAL-TIME DRIVER TRACKING (WebSocket)
// WS /v1/rides/:ride_id/live
// ─────────────────────────────────────────────────────────────
//
// Design Notes:
//   • WebSocket is the primary channel — client connects immediately after booking
//   • Server pushes events whenever ride state OR driver location changes
//   • Client doesn't need to send anything — it's a server → client stream
//   • Events are typed — client switches UI based on event.type
//   • If WebSocket drops → client falls back to polling GET /v1/rides/:ride_id every 5s
//   • Connection auth: Bearer token in query param (WS doesn't support headers)
//     wss://realtime.uber.com/v1/rides/ride_xyz789/live?token=<jwt>

// Driver location update (fires every 3–5 seconds while driver is moving)
const wsEventDriverLocation = {
    type: "driver_location_updated",
    data: {
        ride_id: "ride_xyz789",
        driver_location: { lat: 12.9800, lng: 77.6395 },
        pickup_eta_min: 3,                 // recalculated every update
        dropoff_eta_min: null,             // null until in_progress
    },
    timestamp: "2026-03-10T09:05:30Z",
};

// Ride state changed (fires on every state transition)
const wsEventStateChanged = {
    type: "ride_state_changed",
    data: {
        ride_id: "ride_xyz789",
        previous_state: "searching",
        new_state: "accepted",             // UI transitions: show driver card, stop spinner

        // Included when state = "accepted" (driver info now available)
        driver: {
            driver_id: "drv_abc123",
            name: "Ravi Kumar",
            photo_url: "https://cdn.uber.com/drivers/ravi_kumar.jpg",
            rating: 4.87,
            vehicle: { make: "Maruti", model: "Swift Dzire", color: "White", license_plate: "KA 01 AB 1234" },
            current_location: { lat: 12.9810, lng: 77.6380 },
            pickup_eta_min: 4,
        },
    },
    timestamp: "2026-03-10T09:03:15Z",
};

// Trip completed event (fires when driver ends trip)
const wsEventTripCompleted = {
    type: "ride_state_changed",
    data: {
        ride_id: "ride_xyz789",
        previous_state: "in_progress",
        new_state: "completed",
        fare: {
            currency: "INR",
            total: 208,
            receipt_url: "https://receipts.uber.com/ride_xyz789",
        },
    },
    timestamp: "2026-03-10T09:31:00Z",
};

// No drivers found (searching timed out after ~2 min)
const wsEventNoDrivers = {
    type: "ride_state_changed",
    data: {
        ride_id: "ride_xyz789",
        previous_state: "searching",
        new_state: "no_drivers_found",
        message: "No drivers available nearby. Please try again in a few minutes.",
    },
    timestamp: "2026-03-10T09:04:00Z",
};


// ─────────────────────────────────────────────────────────────
// LAYER 6 — CANCEL A RIDE
// DELETE /v1/rides/:ride_id
// ─────────────────────────────────────────────────────────────
//
// Design Notes:
//   • Can cancel from: searching, accepted, driver_arriving, driver_arrived
//   • Cannot cancel once state = "in_progress"
//   • Grace period (5 min from booking) → free cancellation
//   • After grace period → cancellation fee charged (₹30–₹50 depending on city)
//   • If driver cancels → system auto re-matches (rider doesn't need to re-book)

const cancelRidePayload = {
    reason: "wait_too_long",              // "wait_too_long" | "wrong_address" | "plans_changed" | "other"
};

// HTTP 200 — cancelled within grace period (no fee)
const cancelRideResponseFree = {
    status: "success",
    data: {
        ride_id: "ride_xyz789",
        state: "cancelled",
        cancellation_fee: 0,
        message: "Ride cancelled. No cancellation fee applied.",
    },
};

// HTTP 200 — cancelled after grace period (fee charged)
const cancelRideResponseWithFee = {
    status: "success",
    data: {
        ride_id: "ride_xyz789",
        state: "cancelled",
        cancellation_fee: 30,
        currency: "INR",
        payment_method: "Visa ••••4242",
        message: "Ride cancelled. A cancellation fee of ₹30 has been charged.",
    },
};


// ─────────────────────────────────────────────────────────────
// LAYER 7 — CHANGE DESTINATION MID-TRIP
// PATCH /v1/rides/:ride_id/destination
// ─────────────────────────────────────────────────────────────
//
// Design Notes:
//   • Only allowed when state = "in_progress"
//   • Fare is recalculated based on new route — shown to rider before confirming
//   • One destination change allowed per trip (configurable per market)

const changeDestinationPayload = {
    new_dropoff: {
        location: { lat: 12.9250, lng: 77.6750 },
        address: "Koramangala, Bengaluru",
        place_id: "ChIJplace_koramangala",
    },
};

const changeDestinationResponse = {
    status: "success",
    data: {
        ride_id: "ride_xyz789",
        new_dropoff: {
            location: { lat: 12.9250, lng: 77.6750 },
            address: "Koramangala, Bengaluru",
        },
        // Updated fare estimate with new destination
        updated_fare_estimate: {
            currency: "INR",
            min: 220,
            max: 260,
            display: "₹220–₹260",
        },
        dropoff_eta_min: 18,
    },
};


// ─────────────────────────────────────────────────────────────
// LAYER 8 — PAYMENT METHODS
// GET    /v1/rider/payment-methods
// POST   /v1/rider/payment-methods
// DELETE /v1/rider/payment-methods/:id
// PATCH  /v1/rider/payment-methods/:id/default
// ─────────────────────────────────────────────────────────────
//
// Design Notes:
//   • Card details are stored with Stripe/Braintree — we store only a token + last4
//   • ❌ Never store raw card numbers (PCI-DSS compliance)
//   • "Cash" is always available as an option (no setup needed)
//   • UPI / wallet balance fetched from payment provider

const paymentMethodsResponse = {
    status: "success",
    data: {
        methods: [
            {
                payment_method_id: "pm_card_xyz",
                type: "card",              // "card" | "upi" | "wallet" | "cash"
                is_default: true,
                display_name: "Visa ••••4242",
                details: {
                    brand: "visa",         // "visa" | "mastercard" | "amex" | "rupay"
                    last4: "4242",
                    expiry: "09/28",
                    is_expired: false,
                },
            },
            {
                payment_method_id: "pm_upi_abc",
                type: "upi",
                is_default: false,
                display_name: "ashish@okicici",
                details: {
                    upi_id: "ashish@okicici",
                },
            },
            {
                payment_method_id: "pm_cash",
                type: "cash",
                is_default: false,
                display_name: "Cash",
                details: {},
            },
        ],
    },
};

// POST /v1/rides/:ride_id/tip — Add tip after trip completes
const addTipPayload = {
    amount: 20,                            // ₹20 tip
    currency: "INR",
};

const addTipResponse = {
    status: "success",
    data: {
        ride_id: "ride_xyz789",
        tip_amount: 20,
        new_total: 228,
        message: "₹20 tip sent to Ravi Kumar. Thank you!",
    },
};

// POST /v1/rides/:ride_id/split-fare — Invite others to split the fare
const splitFarePayload = {
    invitees: [
        { phone: "+91 98765 43210" },      // invitees receive a deep link to accept split
        { phone: "+91 91234 56789" },
    ],
};

const splitFareResponse = {
    status: "success",
    data: {
        split_id: "split_abc",
        total_fare: 208,
        per_person: 70,                    // ₹208 / 3 people (rounded up, host pays remainder)
        invitees: [
            { phone: "+91 98765 43210", status: "invited" },
            { phone: "+91 91234 56789", status: "invited" },
        ],
        message: "Split fare invite sent. You'll be charged ₹70 after they accept.",
    },
};


// ─────────────────────────────────────────────────────────────
// LAYER 9 — RATE DRIVER
// POST /v1/rides/:ride_id/rating
// ─────────────────────────────────────────────────────────────
//
// Design Notes:
//   • Only allowed when state = "completed" AND rating_submitted = false
//   • Rating is 1–5 stars (integer only — no half stars)
//   • Feedback tags are predefined options (not free text) — easier to aggregate
//   • Comment is optional free text (max 500 chars)
//   • Rating affects driver's public rating (rolling average)
//   • Rider's identity is NOT shared with driver (anonymous rating)

const rateDriverPayload = {
    ride_id: "ride_xyz789",
    rating: 5,                             // 1–5 (integer)

    // Predefined tags (multi-select, optional)
    // Negative tags (shown on 1–3 stars): "rude_driver" | "unsafe_driving" | "wrong_route" | "dirty_vehicle" | "late_arrival"
    // Positive tags (shown on 4–5 stars): "great_conversation" | "smooth_ride" | "clean_vehicle" | "professional" | "on_time"
    tags: ["clean_vehicle", "professional", "on_time"],

    // Optional free-text comment
    comment: "Very smooth ride. Ravi was punctual and professional.",

    // Optional: Did driver ask you to cancel and re-book? (fraud detection)
    driver_asked_to_cancel: false,
};

// HTTP 201 Created
const rateDriverResponse = {
    status: "success",
    data: {
        ride_id: "ride_xyz789",
        rating_submitted: true,
        // ✅ Driver's updated rating NOT returned — we don't expose internal computation
        message: "Thanks for your feedback!",
    },
};


// ─────────────────────────────────────────────────────────────
// LAYER 10 — RIDE HISTORY & RECEIPT
// GET /v1/rides              → list all past rides (paginated)
// GET /v1/rides/:id/receipt  → full receipt for a single ride
// ─────────────────────────────────────────────────────────────

// GET /v1/rides?size=10&after_cursor=abc&state=completed
// Cursor-based pagination (rides list is append-only — no offset drift)
const rideHistoryResponse = {
    status: "success",
    data: {
        pagination: {
            size: 10,
            next_cursor: "cursor_xyz",
            has_next_page: true,
        },
        rides: [
            {
                ride_id: "ride_xyz789",
                state: "completed",
                category_name: "UberGo",
                pickup_address: "12, 4th Cross, Indiranagar",
                dropoff_address: "Prestige Tech Park, ORR",
                fare_total: 208,
                currency: "INR",
                driver_name: "Ravi Kumar",
                rating_submitted: true,
                started_at: "2026-03-10T09:10:00Z",
                completed_at: "2026-03-10T09:31:00Z",
                duration_min: 21,
                distance_km: 8.2,
            },
        ],
    },
};

// GET /v1/rides/:ride_id/receipt — Full receipt breakdown
const receiptResponse = {
    status: "success",
    data: {
        ride_id: "ride_xyz789",
        receipt_url: "https://receipts.uber.com/ride_xyz789",  // shareable/printable PDF link

        trip: {
            started_at: "2026-03-10T09:10:00Z",
            ended_at: "2026-03-10T09:31:00Z",
            duration_min: 21,
            distance_km: 8.2,
        },

        driver: { name: "Ravi Kumar", vehicle: "Maruti Swift Dzire — KA 01 AB 1234" },

        // Itemized fare breakdown
        fare_breakdown: {
            currency: "INR",
            base_fare: 40,
            distance_charge: 74,           // ₹9/km × 8.2 km
            time_charge: 21,               // ₹1/min × 21 min
            subtotal: 135,
            surge_charge: 41,              // 30% surge (1.3x) on subtotal
            platform_fee: 5,
            tax: 27,
            tip: 20,
            total: 228,
        },

        payment: {
            method: "Visa ••••4242",
            charged_at: "2026-03-10T09:31:45Z",
            status: "paid",
        },
    },
};


// ─────────────────────────────────────────────────────────────
// LAYER 11 — SAFETY FEATURES
// POST /v1/rides/:ride_id/share         → share live trip with contact
// POST /v1/rides/:ride_id/sos           → trigger SOS alert
// POST /v1/rides/:ride_id/contact       → call/message driver (masked)
// ─────────────────────────────────────────────────────────────

// POST /v1/rides/:ride_id/share — Share live trip with an emergency contact
const shareTripPayload = {
    contact_phone: "+91 98765 43210",
    // Sends SMS with a link: "Ashish is in a ride — track here: https://share.uber.com/ride_xyz789"
};

const shareTripResponse = {
    status: "success",
    data: {
        share_url: "https://share.uber.com/ride_xyz789",
        share_url_expires_at: "2026-03-10T10:31:00Z",  // 1 hour after trip ends
        message: "Trip shared with +91 98765 43210.",
    },
};

// POST /v1/rides/:ride_id/sos — Emergency SOS
// ⚠️ Highest priority endpoint — must never fail
const sosResponse = {
    status: "success",
    data: {
        ride_id: "ride_xyz789",
        sos_triggered_at: "2026-03-10T09:20:00Z",
        // Location shared with emergency contacts + Uber safety team
        rider_location: { lat: 12.9600, lng: 77.6700 },
        message: "Emergency services alerted. Your location is being shared.",
        emergency_number: "112",           // local emergency number shown on screen
    },
};

// POST /v1/rides/:ride_id/contact — Call or message driver (masked number)
const contactDriverPayload = {
    method: "call",                        // "call" | "message"
};

const contactDriverResponse = {
    status: "success",
    data: {
        method: "call",
        // Masked proxy number — rider calls this, it connects to driver
        // Neither party sees the other's real number (Twilio proxy)
        masked_number: "+91 80000 12345",
        expires_at: "2026-03-10T09:45:00Z", // proxy number valid for 30 min post-trip
    },
};


// ─────────────────────────────────────────────────────────────
// ERROR HANDLING — Consistent format across all endpoints
// ─────────────────────────────────────────────────────────────

// 422 — Estimate expired (rider took too long to book)
const estimateExpiredError = {
    status: "error",
    error: {
        code: "ESTIMATE_EXPIRED",
        message: "Your fare estimate has expired. Please get a new estimate.",
        request_id: "req_abc123",
    },
};

// 409 — Rider already has an active ride (can't book two rides simultaneously)
const activeRideExistsError = {
    status: "error",
    error: {
        code: "ACTIVE_RIDE_EXISTS",
        message: "You already have an active ride.",
        details: { active_ride_id: "ride_xyz789" },
        request_id: "req_abc123",
    },
};

// 409 — Stock race: no drivers available at booking time (searching timed out)
const noDriversError = {
    status: "error",
    error: {
        code: "NO_DRIVERS_AVAILABLE",
        message: "No drivers are available in your area right now. Please try again.",
        request_id: "req_abc123",
    },
};

// 422 — Cannot cancel in_progress ride
const cannotCancelError = {
    status: "error",
    error: {
        code: "CANCELLATION_NOT_ALLOWED",
        message: "You cannot cancel a ride that is already in progress.",
        request_id: "req_abc123",
    },
};

// 400 — Invalid rating value
const invalidRatingError = {
    status: "error",
    error: {
        code: "VALIDATION_ERROR",
        message: "Rating must be an integer between 1 and 5.",
        details: [{ field: "rating", issue: "must be 1, 2, 3, 4, or 5" }],
        request_id: "req_abc123",
    },
};


// ─────────────────────────────────────────────────────────────
// RATE LIMITING
// ─────────────────────────────────────────────────────────────
//
//  POST /v1/rides/estimate   → 30 req/min  (debounce 500ms on client too)
//  POST /v1/rides            → 5  req/min  (strict — prevent booking spam)
//  GET  /v1/rides/:id        → 60 req/min  (polling fallback — allow frequent)
//  WS   /v1/rides/:id/live   → 1  conn/ride (only one WebSocket per ride per device)
//  POST /v1/rides/:id/sos    → no limit    (safety — never throttle emergency)
//  POST /v1/rides/:id/rating → 3  req/min  (prevent rating spam)
//  GET  /v1/rides            → 30 req/min  (history — moderate)
