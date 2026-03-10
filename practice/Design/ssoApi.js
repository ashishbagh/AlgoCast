// ─────────────────────────────────────────────────────────────
// SSO (Single Sign-On) INTEGRATION API DESIGN
// ─────────────────────────────────────────────────────────────

// ── WHAT IS SSO? ──────────────────────────────────────────────
// SSO lets a user log in ONCE (via their company's Identity Provider —
// Okta, Azure AD, Google Workspace, etc.) and access MULTIPLE apps
// without logging in again.
//
// Two main protocols:
//   SAML 2.0  → XML-based, enterprise IdPs (Okta, ADFS, Ping Identity)
//               Browser-based, no mobile-native support
//   OIDC      → JSON/JWT-based, modern (Google, Auth0, Azure AD)
//               Works for web + mobile + API clients
//
// Two actors:
//   IdP (Identity Provider) → owns the user identity (Okta, Azure AD)
//   SP  (Service Provider)  → the app the user wants to access (US — our system)
//
// Two flows:
//   SP-Initiated  → User lands on OUR app → we redirect to IdP → IdP sends back assertion → we log them in
//   IdP-Initiated → User logs into Okta portal → clicks our app tile → Okta POSTs assertion to us

// ── FUNCTIONAL REQUIREMENTS ───────────────────────────────────

// 1. SSO CONFIGURATION (Admin)
//    - Tenant admin can configure their IdP (Okta, Azure AD, Google, etc.)
//    - Support both SAML 2.0 and OIDC protocols
//    - Admin can test SSO connection before enabling it
//    - Admin can enforce SSO (disable password login once SSO is set up)
//    - Admin can download SP metadata (for SAML setup on IdP side)

// 2. SP-INITIATED SAML FLOW
//    - User visits our app → we build & send SAML AuthnRequest to IdP
//    - User authenticates on IdP → IdP POSTs SAML Response (assertion) to our ACS URL
//    - We validate the assertion → create internal session → redirect user to app

// 3. IdP-INITIATED SAML FLOW
//    - User clicks our app in Okta/Azure portal → IdP directly POSTs SAML Response
//    - We validate → session → redirect (no AuthnRequest to validate against)

// 4. OIDC AUTHORIZATION CODE FLOW
//    - User clicks "Login with SSO" → we redirect to IdP /authorize endpoint
//    - IdP redirects back with authorization code → we exchange for tokens
//    - We validate ID token → create internal session

// 5. JIT PROVISIONING (Just-In-Time)
//    - If user authenticates via SSO but doesn't exist in our system → auto-create
//    - Map IdP attributes (email, name, groups) → our user model
//    - Optionally sync group membership on every login

// 6. SESSION MANAGEMENT
//    - After SSO → issue our own internal session token (decouple from IdP)
//    - Single Logout (SLO): when user logs out of IdP → our session is terminated too

// 7. SCIM PROVISIONING (Optional — for auto user/group sync)
//    - IdP pushes user/group changes in real time via SCIM 2.0 API
//    - Create/Update/Deactivate users automatically

// ── NON-FUNCTIONAL REQUIREMENTS ──────────────────────────────

// 8.  SECURITY      → Validate SAML signatures, check assertion expiry, verify audience
//                     PKCE for OIDC (prevent auth code interception)
//                     Replay attack prevention (track used assertion IDs)
// 9.  MULTI-TENANT  → Each tenant has their own SSO config (different IdPs)
// 10. LATENCY       → SSO callback validation < 200ms (user is waiting)
// 11. RELIABILITY   → Fallback to password login if IdP is down (unless SSO enforced)
// 12. AUDIT         → Log every SSO login attempt (success, failure, reason)

// ── OUT OF SCOPE ──────────────────────────────────────────────
// - Social login (Google/GitHub OAuth) — different flow, separate API
// - Passwordless / magic link — separate feature
// - MFA enforcement on IdP side — IdP's responsibility

// ─────────────────────────────────────────────────────────────
// ENDPOINTS OVERVIEW
// ─────────────────────────────────────────────────────────────
//
//  CONFIGURATION (Admin)
//    GET    /v1/sso/config                   → get current SSO config for tenant
//    POST   /v1/sso/config                   → create / update SSO config
//    DELETE /v1/sso/config                   → remove SSO config (revert to password)
//    POST   /v1/sso/config/test              → test connection before enabling
//    GET    /v1/sso/metadata                 → download SP SAML metadata XML
//
//  SAML FLOW (Browser-based — called by browser, not API client)
//    GET    /v1/sso/saml/initiate            → SP-initiated: build & redirect to IdP
//    POST   /v1/sso/saml/callback (ACS URL) → IdP POSTs assertion here (both flows)
//    GET    /v1/sso/saml/logout              → initiate SAML Single Logout (SLO)
//    POST   /v1/sso/saml/slo                 → IdP-initiated logout callback
//
//  OIDC FLOW (Browser-based)
//    GET    /v1/sso/oidc/initiate            → redirect to IdP /authorize
//    GET    /v1/sso/oidc/callback            → IdP redirects back with auth code
//
//  SESSION (after SSO)
//    GET    /v1/auth/me                      → validate internal session (same as loginAPI.js)
//    POST   /v1/auth/logout                  → log out of our system (same as loginAPI.js)
//
//  SCIM (for IdP-push provisioning)
//    GET    /v1/scim/v2/Users                → list users (IdP reads)
//    POST   /v1/scim/v2/Users                → create user (IdP pushes)
//    PATCH  /v1/scim/v2/Users/:id           → update user
//    DELETE /v1/scim/v2/Users/:id           → deactivate user


// ─────────────────────────────────────────────────────────────
// STEP 0 — SSO CONFIGURATION (Admin Setup)
// POST /v1/sso/config
// ─────────────────────────────────────────────────────────────
//
// Design Notes:
//   • Every tenant has ONE SSO config (can only have one active IdP)
//   • Admin must test the config before enabling (POST /v1/sso/config/test)
//   • If sso_enforced = true → password login disabled for non-admin users
//   • ❌ Never store IdP client_secret in plaintext → encrypt at rest (AES-256)

// ── SAML Configuration ──
const ssoConfigSamlPayload = {
    protocol: "saml",                       // "saml" | "oidc"

    // IdP metadata — admin copies this from Okta/Azure AD console
    saml: {
        idp_entity_id: "https://company.okta.com",              // IdP's unique identifier
        idp_sso_url: "https://company.okta.com/app/abc/sso/saml", // where we redirect user to authenticate
        idp_slo_url: "https://company.okta.com/app/abc/slo/saml", // for Single Logout (optional)
        idp_certificate: "MIIDpDCCAoygAwIBAgIGAV...",           // IdP's X.509 cert (validates assertion signature)
                                                                  // ⚠️ rotate this when IdP rolls their cert

        // Attribute mapping — IdP sends user data as SAML attributes
        // We map IdP attribute names → our internal fields
        attribute_mapping: {
            email: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",
            first_name: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname",
            last_name: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname",
            groups: "http://schemas.microsoft.com/ws/2008/06/identity/claims/groups", // optional
            department: "department",       // custom attribute
        },
    },

    // Provisioning settings
    provisioning: {
        jit_enabled: true,                  // auto-create user on first SSO login
        jit_default_role: "user",           // role to assign to JIT-created users
        sync_groups: true,                  // update user's groups on every login from IdP groups claim
        deprovisioning: "deactivate",       // what to do when user removed from IdP: "deactivate" | "delete" | "none"
    },

    // Enforcement
    sso_enforced: false,                    // false = SSO + password both work | true = SSO only
    domains: ["company.com"],               // users with these email domains must use SSO
};

// ── OIDC Configuration ──
const ssoConfigOidcPayload = {
    protocol: "oidc",

    oidc: {
        // Copied from IdP's developer console
        client_id: "0oa2abc123xyz",
        client_secret: "secret_XXXXXXXXXXXXXXXX",   // ← encrypted at rest, never returned in GET
        issuer: "https://company.okta.com/oauth2/default",      // IdP's OIDC issuer URL
        // We auto-discover endpoints from: {issuer}/.well-known/openid-configuration
        // So we do NOT need to separately configure authorization_endpoint, token_endpoint, etc.

        scopes: ["openid", "profile", "email", "groups"],       // what we request from IdP

        // Claim mapping — IdP sends user data as JWT claims
        claim_mapping: {
            email: "email",
            first_name: "given_name",
            last_name: "family_name",
            groups: "groups",
        },

        // PKCE — Proof Key for Code Exchange
        // ✅ Always enabled for browser-based flows (prevents auth code interception)
        pkce_enabled: true,
    },

    provisioning: {
        jit_enabled: true,
        jit_default_role: "user",
        sync_groups: true,
        deprovisioning: "deactivate",
    },

    sso_enforced: false,
    domains: ["company.com"],
};

// HTTP 201 Created
const ssoConfigResponse = {
    status: "success",
    data: {
        config_id: "sso_cfg_abc123",
        tenant_id: "tnt_company123",
        protocol: "saml",
        status: "configured",               // "configured" | "tested" | "enabled" | "disabled"
        sso_enforced: false,
        domains: ["company.com"],

        // SP metadata — admin needs to enter these into their IdP
        sp_metadata: {
            sp_entity_id: "https://app.example.com/sso/saml/metadata",
            acs_url: "https://app.example.com/v1/sso/saml/callback",   // Assertion Consumer Service URL
            slo_url: "https://app.example.com/v1/sso/saml/slo",
            metadata_url: "https://app.example.com/v1/sso/metadata",   // full XML download
        },

        created_at: "2026-03-10T09:00:00Z",
        updated_at: "2026-03-10T09:00:00Z",
    },
};

// GET /v1/sso/config — Retrieve current SSO config
const ssoConfigGetResponse = {
    status: "success",
    data: {
        config_id: "sso_cfg_abc123",
        tenant_id: "tnt_company123",
        protocol: "saml",
        status: "enabled",

        saml: {
            idp_entity_id: "https://company.okta.com",
            idp_sso_url: "https://company.okta.com/app/abc/sso/saml",
            idp_slo_url: "https://company.okta.com/app/abc/slo/saml",
            idp_certificate: "MIIDpDCCAoygAwIBAgIGAV...",
            attribute_mapping: {
                email: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",
                first_name: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname",
                last_name: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname",
                groups: "http://schemas.microsoft.com/ws/2008/06/identity/claims/groups",
            },
        },

        // ❌ client_secret is NEVER returned — write-only field
        // oidc: { client_id: "...", client_secret: "REDACTED", ... }

        provisioning: {
            jit_enabled: true,
            jit_default_role: "user",
            sync_groups: true,
            deprovisioning: "deactivate",
        },

        sso_enforced: false,
        domains: ["company.com"],
        sp_metadata: {
            sp_entity_id: "https://app.example.com/sso/saml/metadata",
            acs_url: "https://app.example.com/v1/sso/saml/callback",
            metadata_url: "https://app.example.com/v1/sso/metadata",
        },
    },
};

// POST /v1/sso/config/test — Test SSO connection without enabling it
// Initiates a test SSO flow in a popup window — validates config end-to-end
const ssoTestResponse = {
    status: "success",
    data: {
        test_id: "test_xyz456",
        // Admin opens this URL in a popup to go through the real SSO flow
        test_url: "https://app.example.com/v1/sso/saml/initiate?test_id=test_xyz456&tenant_id=tnt_company123",
        expires_at: "2026-03-10T09:15:00Z",  // test link valid for 15 minutes
    },
};


// ─────────────────────────────────────────────────────────────
// SAML FLOW — STEP 1
// GET /v1/sso/saml/initiate?tenant_id=tnt_company123&relay_state=/dashboard
// SP-Initiated: called when user clicks "Login with SSO"
// ─────────────────────────────────────────────────────────────
//
// Design Notes:
//   • This endpoint does NOT return JSON — it returns an HTTP 302 REDIRECT
//   • We build a SAML AuthnRequest, sign it, base64-encode it, and
//     redirect the user's browser to the IdP SSO URL with it as a query param
//   • relay_state = where to send user AFTER successful login (e.g. /dashboard)
//                   we store this server-side against the request_id to prevent tampering
//   • We also store the request_id in server-side state to prevent replay attacks
//
// Query params:
//   tenant_id   → which tenant's IdP config to use
//                 (can also be derived from user's email domain if they typed it first)
//   relay_state → URL to redirect user to after login (optional, default: home)
//   test_id     → (optional) if this is a test flow

// No JSON response — browser is redirected to:
// https://company.okta.com/app/abc/sso/saml
//   ?SAMLRequest=<base64-encoded-deflated-AuthnRequest>
//   &RelayState=<opaque-server-generated-state-token>   ← NOT the raw relay_state URL
//   &SigAlg=http://www.w3.org/2001/04/xmldsig-more#rsa-sha256
//   &Signature=<our-SP-signature>

// What's inside the SAMLRequest (AuthnRequest) — for reference:
const samlAuthnRequestConcept = {
    ID: "req_abc123",                       // unique request ID — stored server-side to prevent replay
    Version: "2.0",
    IssueInstant: "2026-03-10T09:00:00Z",
    Destination: "https://company.okta.com/app/abc/sso/saml",  // IdP SSO URL
    AssertionConsumerServiceURL: "https://app.example.com/v1/sso/saml/callback",
    Issuer: "https://app.example.com/sso/saml/metadata",       // our SP entity ID
    NameIDPolicy: {
        Format: "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress",
        AllowCreate: true,
    },
};


// ─────────────────────────────────────────────────────────────
// SAML FLOW — STEP 2
// POST /v1/sso/saml/callback  (ACS URL — Assertion Consumer Service)
// Called by the IdP after user successfully authenticates
// ─────────────────────────────────────────────────────────────
//
// Design Notes:
//   • This is a BROWSER POST — IdP submits an HTML form to our ACS URL
//   • Content-Type: application/x-www-form-urlencoded (NOT JSON)
//   • SAMLResponse = base64-encoded XML assertion from IdP
//   • RelayState = the opaque token we sent in step 1 (we resolve it to the redirect URL)
//
// Validation steps we MUST perform (security critical):
//   ✅ 1. Decode base64 → parse XML
//   ✅ 2. Verify XML signature using IdP's stored X.509 certificate
//   ✅ 3. Check Issuer matches configured idp_entity_id
//   ✅ 4. Check Audience matches our sp_entity_id
//   ✅ 5. Check NotBefore / NotOnOrAfter (assertion must not be expired — allow 5 min clock skew)
//   ✅ 6. Check InResponseTo matches our stored request_id (SP-initiated only — prevents replay)
//   ✅ 7. Mark assertion_id as used in Redis (TTL = assertion expiry) — prevent replay attack
//   ✅ 8. Extract NameID (user's email) and attributes

// Form body (sent by IdP — NOT a JSON payload):
const samlCallbackFormBody = {
    SAMLResponse: "PHNhbWxwOlJlc3BvbnNlIHhtbG5zOnNhbWxwPS...", // base64-encoded XML
    RelayState: "state_opaque_token_xyz",                        // opaque token (we resolve this to redirect URL)
};

// What's inside the decoded SAMLResponse — for reference:
const samlAssertionConcept = {
    ID: "resp_def456",
    InResponseTo: "req_abc123",             // matches our request ID (SP-initiated only)
    IssueInstant: "2026-03-10T09:00:05Z",
    Issuer: "https://company.okta.com",

    Status: {
        StatusCode: "urn:oasis:names:tc:SAML:2.0:status:Success",
    },

    Assertion: {
        ID: "assertion_ghi789",             // store in Redis as used — prevent replay
        IssueInstant: "2026-03-10T09:00:05Z",
        Issuer: "https://company.okta.com",

        // Signature — we verify this using IdP's X.509 cert
        Signature: "<ds:Signature>...</ds:Signature>",

        Subject: {
            NameID: {
                Format: "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress",
                Value: "ashish@company.com",         // ← this is the user's identity
            },
            SubjectConfirmation: {
                Method: "urn:oasis:names:tc:SAML:2.0:cm:bearer",
                SubjectConfirmationData: {
                    InResponseTo: "req_abc123",
                    NotOnOrAfter: "2026-03-10T09:05:05Z",   // ← expiry (5 min window)
                    Recipient: "https://app.example.com/v1/sso/saml/callback",
                },
            },
        },

        Conditions: {
            NotBefore: "2026-03-10T08:55:05Z",
            NotOnOrAfter: "2026-03-10T09:05:05Z",
            AudienceRestriction: {
                Audience: "https://app.example.com/sso/saml/metadata", // ← must match our SP entity ID
            },
        },

        // User attributes from IdP
        AttributeStatement: {
            Attributes: [
                { Name: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress", Value: "ashish@company.com" },
                { Name: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname", Value: "Ashish" },
                { Name: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname", Value: "Baghel" },
                { Name: "http://schemas.microsoft.com/ws/2008/06/identity/claims/groups", Value: ["engineering", "india-office"] },
            ],
        },
    },
};

// What happens AFTER validation (internal processing):
const ssoCallbackInternalFlow = {
    // Step 1: Extract user identity from assertion
    email: "ashish@company.com",
    idp_user_id: "ashish@company.com",      // NameID value

    // Step 2: Look up user in our DB by email + tenant_id
    // Step 3a: User found → update attributes if sync_groups is enabled → continue
    // Step 3b: User NOT found + jit_enabled = true → CREATE user (JIT provisioning)
    jit_provisioning: {
        action: "created",                  // "found" | "created" | "updated"
        user_id: "usr_new_xyz",
        email: "ashish@company.com",
        first_name: "Ashish",
        last_name: "Baghel",
        role: "user",                       // jit_default_role from config
        groups: ["engineering", "india-office"],
        tenant_id: "tnt_company123",
    },

    // Step 4: Issue our own internal session (decouple from IdP session)
    // Step 5: Resolve RelayState → get redirect URL → HTTP 302 to app
};

// HTTP response: 302 REDIRECT (not JSON)
// Location: /dashboard  (resolved from relay_state)
// Set-Cookie: session_id=sess_newxyz; HttpOnly; Secure; SameSite=Lax; Max-Age=28800
//
// ⚠️ SameSite=Lax here (NOT Strict) because:
//   The IdP POST comes from a CROSS-ORIGIN form submit.
//   SameSite=Strict would block the cookie from being set in this case.
//   Lax allows it for top-level navigations (form POSTs from IdP → our ACS).


// ─────────────────────────────────────────────────────────────
// OIDC FLOW — STEP 1
// GET /v1/sso/oidc/initiate?tenant_id=tnt_company123&relay_state=/dashboard
// ─────────────────────────────────────────────────────────────
//
// Design Notes:
//   • We use Authorization Code Flow + PKCE (mandatory for browser clients)
//   • PKCE: generate code_verifier (random) → hash it → send code_challenge to IdP
//           IdP holds the challenge. On token exchange, we send code_verifier.
//           IdP verifies hash(code_verifier) == code_challenge → prevents code theft
//   • state parameter prevents CSRF (we generate random state, store in session, verify on callback)

// We store server-side (in Redis, keyed by state):
const oidcInitiateServerState = {
    state: "random_csrf_token_abc123",     // anti-CSRF
    code_verifier: "random_verifier_xyz",  // PKCE — stored server-side (never sent to browser)
    relay_state: "/dashboard",             // where to send user after login
    tenant_id: "tnt_company123",
    created_at: "2026-03-10T09:00:00Z",
    expires_at: "2026-03-10T09:10:00Z",   // 10 min expiry
};

// HTTP 302 REDIRECT to IdP's authorization endpoint:
// https://company.okta.com/oauth2/default/v1/authorize
//   ?response_type=code
//   &client_id=0oa2abc123xyz
//   &redirect_uri=https://app.example.com/v1/sso/oidc/callback
//   &scope=openid%20profile%20email%20groups
//   &state=random_csrf_token_abc123          ← anti-CSRF
//   &code_challenge=S256HashOfVerifier       ← PKCE challenge
//   &code_challenge_method=S256              ← SHA-256


// ─────────────────────────────────────────────────────────────
// OIDC FLOW — STEP 2
// GET /v1/sso/oidc/callback?code=auth_code&state=random_csrf_token_abc123
// ─────────────────────────────────────────────────────────────
//
// Validation steps:
//   ✅ 1. Verify state matches what we stored in Redis → prevent CSRF
//   ✅ 2. Check code is present (if error param present → auth failed)
//   ✅ 3. Exchange auth code for tokens using code + code_verifier

// Token exchange — we call IdP's token endpoint (server-to-server, not browser):
const oidcTokenExchangeRequest = {
    // POST to: https://company.okta.com/oauth2/default/v1/token
    // Content-Type: application/x-www-form-urlencoded
    grant_type: "authorization_code",
    code: "auth_code_from_idp",
    redirect_uri: "https://app.example.com/v1/sso/oidc/callback",
    client_id: "0oa2abc123xyz",
    client_secret: "secret_XXXXXXXXXXXXXXXX",   // server-to-server — secret is safe here
    code_verifier: "random_verifier_xyz",        // PKCE verifier — IdP hashes & verifies
};

// IdP returns:
const oidcTokenResponse = {
    access_token: "eyJhbGciOiJSUzI1NiJ9...",    // IdP access token (short-lived, 1hr)
    id_token: "eyJhbGciOiJSUzI1NiJ9...",        // ← THIS is what we use — contains user identity
    refresh_token: "eyJhbGciOiJSUzI1NiJ9...",   // optional, for long sessions
    token_type: "Bearer",
    expires_in: 3600,
    scope: "openid profile email groups",
};

// ID Token decoded (JWT claims):
const oidcIdTokenClaims = {
    // Standard OIDC claims
    iss: "https://company.okta.com/oauth2/default",   // issuer — must match our config
    sub: "00u1abc123xyz",                              // IdP user ID (stable, unique)
    aud: "0oa2abc123xyz",                              // audience — must match our client_id
    iat: 1741596000,                                   // issued at
    exp: 1741599600,                                   // expiry — must not be in past
    nonce: "random_nonce_abc",                         // if we sent nonce → verify it matches

    // Profile claims
    email: "ashish@company.com",
    email_verified: true,
    given_name: "Ashish",
    family_name: "Baghel",
    name: "Ashish Baghel",

    // Custom claims
    groups: ["engineering", "india-office"],
};

// ID Token validation:
//   ✅ Verify JWT signature using IdP's JWKS (public keys from {issuer}/.well-known/jwks.json)
//   ✅ Check iss matches our configured issuer
//   ✅ Check aud matches our client_id
//   ✅ Check exp (not expired — allow 5 min clock skew)
//   ✅ Check nonce if we sent one
//   → Extract user identity → JIT provision if needed → issue our session → redirect


// ─────────────────────────────────────────────────────────────
// SINGLE LOGOUT (SLO) — SAML
// Initiated by: User logging out of IdP (e.g. Okta portal)
// POST /v1/sso/saml/slo
// ─────────────────────────────────────────────────────────────
//
// Design Notes:
//   • When user logs out of Okta, Okta notifies all SP apps via SLO
//   • We receive a LogoutRequest → invalidate the user's session → send LogoutResponse
//   • This ensures if user logs out of IdP, they're logged out of ALL apps (true SSO logout)
//   • SLO is optional — not all IdPs support it. If not configured, sessions expire naturally.

const samlSloFormBody = {
    SAMLRequest: "PHNhbWxwOkxvZ291dFJlcXVlc3Q...", // base64-encoded LogoutRequest XML
    RelayState: "state_token_slo",
};

// What's inside the LogoutRequest — for reference:
const samlLogoutRequestConcept = {
    ID: "logout_req_abc",
    IssueInstant: "2026-03-10T10:00:00Z",
    Issuer: "https://company.okta.com",
    NameID: {
        Format: "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress",
        Value: "ashish@company.com",       // which user to log out
    },
    SessionIndex: "sess_idp_xyz",          // IdP session ID (we map this to our session)
};

// What we do:
//   1. Validate LogoutRequest signature
//   2. Find our sessions for this user (by email + tenant)
//   3. Invalidate all our sessions for this user
//   4. Respond with a LogoutResponse to IdP
//   5. HTTP 302 redirect to IdP's SLO response URL

// HTTP 302 → IdP SLO URL with SAMLResponse (LogoutResponse)
// Location: https://company.okta.com/app/abc/slo/saml?SAMLResponse=...&RelayState=...


// ─────────────────────────────────────────────────────────────
// JIT PROVISIONING — Internal flow (not a public endpoint)
// Triggered inside /saml/callback or /oidc/callback
// ─────────────────────────────────────────────────────────────
//
// Design Notes:
//   • JIT = create user on first login, no pre-provisioning needed
//   • Simpler than SCIM but less real-time (user exists in our system only after first login)
//   • If user is deactivated in IdP → they simply can't authenticate → no active session
//   • Groups are synced on EVERY login (not just first) if sync_groups = true

const jitProvisioningFlow = {
    // Input: extracted from SAML assertion or OIDC ID token
    idp_user_id: "ashish@company.com",     // NameID (SAML) or sub claim (OIDC)
    email: "ashish@company.com",
    first_name: "Ashish",
    last_name: "Baghel",
    idp_groups: ["engineering", "india-office"],
    tenant_id: "tnt_company123",

    // Lookup: SELECT * FROM users WHERE email = ? AND tenant_id = ?
    user_found: false,

    // Action: CREATE new user
    created_user: {
        user_id: "usr_new_abc",
        email: "ashish@company.com",
        first_name: "Ashish",
        last_name: "Baghel",
        display_name: "Ashish Baghel",
        role: "user",                      // from jit_default_role
        groups: ["engineering", "india-office"],
        tenant_id: "tnt_company123",
        auth_provider: "sso",              // "local" | "sso"
        idp_user_id: "ashish@company.com", // store for future lookups
        created_at: "2026-03-10T09:00:10Z",
        last_login_at: "2026-03-10T09:00:10Z",
    },
};


// ─────────────────────────────────────────────────────────────
// SCIM 2.0 — User Provisioning (IdP pushes users to us)
// ─────────────────────────────────────────────────────────────
//
// Design Notes:
//   • SCIM = System for Cross-domain Identity Management (RFC 7643, 7644)
//   • IdP (Okta/Azure AD) calls OUR SCIM API whenever a user/group changes
//   • More real-time than JIT — deactivation happens immediately (not just on next login)
//   • Auth: SCIM bearer token (long-lived, admin generates in our settings)
//   • All SCIM endpoints follow a standardized schema
//
// When to use SCIM vs JIT:
//   JIT   → simple, no setup, user created on first login, deactivation is lazy
//   SCIM  → real-time, immediate deactivation, pre-provisioning (user exists before first login)

// POST /v1/scim/v2/Users — IdP creates a new user in our system
const scimCreateUserPayload = {
    // Standard SCIM schema
    schemas: ["urn:ietf:params:scim:schemas:core:2.0:User"],
    userName: "ashish@company.com",         // unique identifier (usually email)
    name: {
        givenName: "Ashish",
        familyName: "Baghel",
        formatted: "Ashish Baghel",
    },
    emails: [
        { value: "ashish@company.com", primary: true, type: "work" },
    ],
    active: true,                           // false = deactivate the user
    externalId: "00u1abc123xyz",            // IdP's internal user ID (for future updates)

    // Custom extension attributes (tenant-specific)
    "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User": {
        department: "Engineering",
        manager: { value: "usr_manager_xyz", displayName: "John Manager" },
    },
};

// HTTP 201 Created — SCIM response format
const scimCreateUserResponse = {
    schemas: ["urn:ietf:params:scim:schemas:core:2.0:User"],
    id: "usr_new_abc",                      // OUR internal user ID
    externalId: "00u1abc123xyz",            // IdP's user ID (echoed back)
    userName: "ashish@company.com",
    name: { givenName: "Ashish", familyName: "Baghel", formatted: "Ashish Baghel" },
    emails: [{ value: "ashish@company.com", primary: true, type: "work" }],
    active: true,
    meta: {
        resourceType: "User",
        created: "2026-03-10T09:00:00Z",
        lastModified: "2026-03-10T09:00:00Z",
        location: "https://app.example.com/v1/scim/v2/Users/usr_new_abc",
        version: "W/\"a330bc54f2e9903a\"",
    },
};

// PATCH /v1/scim/v2/Users/:id — IdP updates user (e.g. deactivate when employee leaves)
const scimPatchUserPayload = {
    schemas: ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
    Operations: [
        {
            op: "replace",
            path: "active",
            value: false,                   // ← deactivate the user immediately
        },
    ],
};

// GET /v1/scim/v2/Users — IdP lists users to check sync state
// GET /v1/scim/v2/Users?filter=userName+eq+"ashish@company.com"
const scimListUsersResponse = {
    schemas: ["urn:ietf:params:scim:api:messages:2.0:ListResponse"],
    totalResults: 1,
    startIndex: 1,
    itemsPerPage: 1,
    Resources: [
        {
            id: "usr_new_abc",
            externalId: "00u1abc123xyz",
            userName: "ashish@company.com",
            name: { givenName: "Ashish", familyName: "Baghel" },
            active: true,
        },
    ],
};


// ─────────────────────────────────────────────────────────────
// SESSION ISSUED AFTER SSO (internal — same as loginAPI.js)
// ─────────────────────────────────────────────────────────────
//
// Design Notes:
//   • After SAML/OIDC validation, we issue OUR OWN session — decouple from IdP
//   • This means: if IdP is down → existing sessions still work (resilience)
//   • Session has a linked sso_session field so we know it came from SSO
//   • If SLO is triggered → we invalidate by sso_session_id across all devices

// Set-Cookie: session_id=sess_xyz789; HttpOnly; Secure; SameSite=Lax; Max-Age=28800
// HTTP 302 → /dashboard  (resolved from relay_state)

const internalSessionCreated = {
    session_id: "sess_xyz789",
    user_id: "usr_new_abc",
    tenant_id: "tnt_company123",
    auth_method: "saml_sso",               // "local" | "saml_sso" | "oidc_sso"
    idp_session_id: "sess_idp_abc",        // IdP session — used for SLO matching
    device_id: "browser_fingerprint_xyz",
    created_at: "2026-03-10T09:00:10Z",
    expires_at: "2026-03-10T17:00:10Z",    // 8 hour SSO session (configurable per tenant)
    last_active_at: "2026-03-10T09:00:10Z",
};


// ─────────────────────────────────────────────────────────────
// SP METADATA — GET /v1/sso/metadata?tenant_id=tnt_company123
// Returns SP SAML metadata XML (admin downloads this to configure their IdP)
// ─────────────────────────────────────────────────────────────
//
// Response: Content-Type: application/xml (NOT JSON)
// This XML tells the IdP everything it needs to know about our SP.

// Conceptual structure of the metadata XML:
const spMetadataConcept = {
    entityID: "https://app.example.com/sso/saml/metadata",
    SPSSODescriptor: {
        AuthnRequestsSigned: true,
        WantAssertionsSigned: true,
        AssertionConsumerService: {
            Binding: "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST",
            Location: "https://app.example.com/v1/sso/saml/callback",
            index: 0,
        },
        SingleLogoutService: {
            Binding: "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect",
            Location: "https://app.example.com/v1/sso/saml/slo",
        },
        // Our SP signing certificate (IdP uses this to verify our AuthnRequest signature)
        KeyDescriptor: {
            use: "signing",
            X509Certificate: "MIIDpDCCAoygAwIBAgIGAV...",
        },
    },
};


// ─────────────────────────────────────────────────────────────
// ERROR HANDLING
// ─────────────────────────────────────────────────────────────

// 400 — SAML assertion validation failed (IdP sent bad assertion)
const samlValidationError = {
    status: "error",
    error: {
        code: "SAML_ASSERTION_INVALID",
        message: "The SAML assertion could not be validated.",
        details: {
            reason: "SIGNATURE_VERIFICATION_FAILED",
            // "SIGNATURE_VERIFICATION_FAILED" → IdP cert mismatch
            // "ASSERTION_EXPIRED"             → assertion NotOnOrAfter passed
            // "AUDIENCE_MISMATCH"             → Audience doesn't match our SP entity ID
            // "ISSUER_MISMATCH"               → Issuer doesn't match configured idp_entity_id
            // "REPLAY_DETECTED"               → assertion_id already used
        },
        request_id: "req_abc123",
    },
};

// 403 — User authenticated via IdP but is deactivated in our system
const userDeactivatedError = {
    status: "error",
    error: {
        code: "USER_DEACTIVATED",
        message: "Your account has been deactivated. Please contact your administrator.",
        request_id: "req_abc123",
    },
};

// 403 — SSO enforced but user tried password login
const ssoEnforcedError = {
    status: "error",
    error: {
        code: "SSO_REQUIRED",
        message: "Your organization requires SSO login.",
        details: {
            sso_login_url: "https://app.example.com/v1/sso/saml/initiate?tenant_id=tnt_company123",
        },
        request_id: "req_abc123",
    },
};

// 404 — Tenant has no SSO configured but user tried to use SSO
const ssoNotConfiguredError = {
    status: "error",
    error: {
        code: "SSO_NOT_CONFIGURED",
        message: "SSO is not configured for your organization.",
        request_id: "req_abc123",
    },
};

// 500 — IdP is unreachable during OIDC token exchange
const idpUnreachableError = {
    status: "error",
    error: {
        code: "IDP_UNREACHABLE",
        message: "Could not complete login. Your identity provider is temporarily unavailable. Please try again or use password login.",
        details: {
            fallback_login_url: "https://app.example.com/login",
        },
        request_id: "req_abc123",
    },
};


// ─────────────────────────────────────────────────────────────
// SSO AUDIT LOG — every SSO event is logged
// (stored in the same audit log system as regular login events)
// ─────────────────────────────────────────────────────────────

const ssoAuditLogEntry = {
    event_id: "evt_sso_abc123",
    event_type: "sso_login",               // "sso_login" | "sso_login_failed" | "sso_logout" | "jit_user_created" | "sso_config_updated"
    timestamp: "2026-03-10T09:00:10Z",
    tenant_id: "tnt_company123",

    // Who
    user: {
        email: "ashish@company.com",
        user_id: "usr_new_abc",
    },

    // SSO details
    sso: {
        protocol: "saml",
        idp: "https://company.okta.com",
        flow: "sp_initiated",              // "sp_initiated" | "idp_initiated"
        assertion_id: "assertion_ghi789",
        jit_action: "created",             // "none" | "created" | "updated"
    },

    // Outcome
    result: "success",                     // "success" | "failed"
    failure_reason: null,                  // null on success | "SIGNATURE_VERIFICATION_FAILED" | etc.

    // Network
    ip_address: "203.0.113.42",
    user_agent: "Mozilla/5.0 (Macintosh; ...)",
};
