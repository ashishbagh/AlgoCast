// ─────────────────────────────────────────────────────────────
// LOGIN / AUTH API DESIGN
// ─────────────────────────────────────────────────────────────
//
// Requirements:
//   /login  → validate credentials, create session in DB,
//             return session_id via HttpOnly cookie + user info
//   /logout → expire session in DB, clear cookie on client
//
// Core Entities:
//   User    { user_id, username, email, role, is_mfa_enabled }
//   Session { session_id, user_id, device_id, created_at, expires_at }
//
// Auth Strategy: Session-based (cookie) — server stores session in DB/Redis
//   Client never sees the raw session_id (HttpOnly cookie)
//   Every request auto-sends the cookie → server validates session
//
// ─────────────────────────────────────────────────────────────
// ENDPOINTS
// ─────────────────────────────────────────────────────────────

// POST /v1/auth/login          → authenticate & create session
// POST /v1/auth/logout         → expire session & clear cookie
// POST /v1/auth/logout-all     → expire ALL sessions for this user (all devices)
// POST /v1/auth/refresh        → silently renew session before expiry
// POST /v1/auth/mfa/verify     → submit MFA code (2nd factor)
// GET  /v1/auth/me             → get current user from active session (session check)

// ─────────────────────────────────────────────────────────────
// POST /v1/auth/login
// ─────────────────────────────────────────────────────────────

// Request headers:
// Content-Type: application/json
// X-Request-ID: uuid()           ← for tracing/idempotency
// ⚠️ Rate limited: max 5 failed attempts per IP per 15 minutes → 429

const loginRequest = {
  username: "john_doe",            // or email — support both
  password: "••••••••",            // plain text over HTTPS; server hashes & compares
  device_id: "dev_abc123xyz",      // ✅ string UUID — identifies the device/browser
  remember_me: true,               // true → 30-day session | false → session until browser close
};

// ── If credentials valid AND user has NO MFA ──────────────────
// HTTP 200 OK
// Set-Cookie: session_id=<token>; HttpOnly; Secure; SameSite=Strict; Max-Age=2592000
//              ↑ client never reads this cookie directly (HttpOnly = JS cannot access it)

const loginResponse = {
  status: "success",
  // ✅ 200 OK — not 201 (login is not "creating" a publicly addressable resource)
  data: {
    session_id: "sess_xyz789",       // echoed back (not in cookie for reference)
    expires_at: "2026-04-09T10:00:00Z", // when the session expires
    user: {
      user_id: "usr_abc123",
      username: "john_doe",
      email: "john@example.com",
      display_name: "John Doe",
      avatar_url: "https://cdn.example.com/avatar.jpg",
      role: "user",                  // "user" | "admin" | "moderator"
      is_mfa_enabled: false,
    },
    // ❌ No "redirects" field — redirect logic belongs to the client, not the API
  },
};

// ── If credentials valid AND user HAS MFA enabled ─────────────
// HTTP 202 Accepted (credentials OK but auth not yet complete)
const loginMfaRequiredResponse = {
  status: "mfa_required",
  data: {
    mfa_token: "mfa_temp_abc123",    // short-lived token (5 min) to complete MFA step
    mfa_type: "totp",                // "totp" (Google Auth) | "sms" | "email"
    masked_contact: "+1 *** *** 4567", // hint of where OTP was sent (if sms/email)
  },
};

// ─────────────────────────────────────────────────────────────
// POST /v1/auth/mfa/verify
// Submit the 6-digit OTP to complete login
// ─────────────────────────────────────────────────────────────

const mfaVerifyRequest = {
  mfa_token: "mfa_temp_abc123",     // from loginMfaRequiredResponse above
  otp_code: "482910",               // 6-digit code from authenticator app / SMS / email
  device_id: "dev_abc123xyz",
};

// HTTP 200 OK + Set-Cookie (same as successful login response above)

// ─────────────────────────────────────────────────────────────
// GET /v1/auth/me
// Validate active session & return current user info
// Cookie is automatically sent by browser
// ─────────────────────────────────────────────────────────────

// Request: no body needed — session_id read from HttpOnly cookie automatically

const meResponse = {
  status: "success",
  data: {
    user_id: "usr_abc123",
    username: "john_doe",
    email: "john@example.com",
    display_name: "John Doe",
    avatar_url: "https://cdn.example.com/avatar.jpg",
    role: "user",
    is_mfa_enabled: false,
    session: {
      session_id: "sess_xyz789",
      device_id: "dev_abc123xyz",
      created_at: "2026-03-09T10:00:00Z",
      expires_at: "2026-04-09T10:00:00Z",
      last_active_at: "2026-03-09T11:30:00Z",
    },
  },
};

// ─────────────────────────────────────────────────────────────
// POST /v1/auth/refresh
// Silently extend session before it expires (called automatically by client)
// ─────────────────────────────────────────────────────────────

// Request: no body needed — session_id read from HttpOnly cookie
// HTTP 200 OK
// Set-Cookie: session_id=<new_token>; HttpOnly; Secure; SameSite=Strict; Max-Age=2592000

const refreshResponse = {
  status: "success",
  data: {
    session_id: "sess_newtoken456",   // old session invalidated, new one issued
    expires_at: "2026-04-10T10:00:00Z",
  },
};

// ─────────────────────────────────────────────────────────────
// POST /v1/auth/logout
// Expire current session & clear cookie
// ─────────────────────────────────────────────────────────────

const logoutRequest = {
  device_id: "dev_abc123xyz",         // which device to log out
};

// HTTP 200 OK
// ✅ Correct way to clear a cookie — set Max-Age=0 (not session_id=null)
// Set-Cookie: session_id=; Max-Age=0; HttpOnly; Secure; SameSite=Strict; Path=/

const logoutResponse = {
  status: "success",
  message: "Logged out successfully",
};

// ─────────────────────────────────────────────────────────────
// POST /v1/auth/logout-all
// Expire ALL sessions for this user across all devices
// (useful after password change or suspicious activity detected)
// ─────────────────────────────────────────────────────────────

// Request: no body needed — session_id from cookie identifies the user
// Server: deletes ALL sessions for user_id in DB/Redis
// HTTP 200 OK + clears current cookie too

const logoutAllResponse = {
  status: "success",
  message: "Logged out from all devices successfully",
  data: {
    sessions_terminated: 4,           // how many devices were logged out
  },
};

// ─────────────────────────────────────────────────────────────
// ERROR RESPONSES
// ─────────────────────────────────────────────────────────────

// 400 — Missing or malformed fields
const badRequestError = {
  status: "error",
  error_code: "VALIDATION_ERROR",
  status_code: 400,
  title: "Invalid request",
  message: "username and password are required.",
  details: [
    { field: "password", issue: "password is required" },
  ],
};

// 401 — Wrong credentials
const unauthorizedError = {
  status: "error",
  error_code: "INVALID_CREDENTIALS",   // ⚠️ never say "wrong password" — gives attackers info
  status_code: 401,
  title: "Login failed",
  message: "Invalid username or password.",  // generic on purpose
  details: [],
};

// 401 — Session expired or invalid (for protected routes)
const sessionExpiredError = {
  status: "error",
  error_code: "SESSION_EXPIRED",
  status_code: 401,
  title: "Session expired",
  message: "Your session has expired. Please log in again.",
  details: [],
};

// 403 — Account locked / suspended
const forbiddenError = {
  status: "error",
  error_code: "ACCOUNT_LOCKED",
  status_code: 403,
  title: "Account locked",
  message: "Your account has been temporarily locked due to too many failed attempts. Try again after 15 minutes.",
  details: [],
};

// 429 — Rate limit hit (brute-force protection)
const rateLimitError = {
  status: "error",
  error_code: "TOO_MANY_REQUESTS",
  status_code: 429,
  title: "Too many login attempts",
  message: "Maximum login attempts exceeded. Please wait 15 minutes before trying again.",
  retry_after_seconds: 900,            // client uses this to show a countdown timer
  details: [],
};

// 500 — Server error
const serverError = {
  status: "error",
  error_code: "INTERNAL_SERVER_ERROR",
  status_code: 500,
  title: "Something went wrong",
  message: "An unexpected error occurred. Please try again later.",
  details: [],
};
