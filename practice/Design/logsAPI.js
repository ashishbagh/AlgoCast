// ─────────────────────────────────────────────────────────────
// NETSKOPE — API DESIGN (Cloud Security / SASE / ZTNA Platform)
// ─────────────────────────────────────────────────────────────

// ── WHAT IS NETSKOPE? ─────────────────────────────────────────
// Netskope is a cloud security platform (SASE / SSE).
// It acts as an inline security proxy between users and cloud apps.
// Every request a user makes to a cloud app (Google Drive, Salesforce, etc.)
// flows through Netskope's cloud — it inspects, enforces policy, and logs.

// ── FUNCTIONAL REQUIREMENTS (Core — Must Have) ───────────────

// 1. AUTHENTICATION & IDENTITY
//    - Users authenticate via SSO (SAML/OIDC) or local credentials
//    - Device posture is evaluated on every session (MDM, AV, OS version)
//    - Multi-factor authentication (MFA) enforced based on risk

// 2. ZERO TRUST NETWORK ACCESS (ZTNA)
//    - Every request evaluated: who is the user, what device, what app, what data?
//    - Access is never assumed — always verified per request
//    - Contextual access decisions: allow / block / limit / step-up auth

// 3. POLICY ENGINE
//    - Admins create policies: IF (user + device + app + data) THEN (action)
//    - Policies evaluated in real time for every cloud transaction
//    - Policy actions: allow, block, alert, encrypt, quarantine, step-up MFA

// 4. DATA LOSS PREVENTION (DLP)
//    - Inspect file uploads/downloads for sensitive data (PII, PCI, PHI)
//    - Pattern matching: regex, ML classifiers, fingerprinting
//    - Actions: block, encrypt, quarantine, alert

// 5. THREAT PROTECTION
//    - Scan for malware in uploads/downloads
//    - Detect anomalous user behaviour (UEBA)
//    - Block known malicious URLs / domains

// 6. AUDIT LOGGING
//    - Log every cloud transaction (who, what, when, where, result)
//    - Logs available for SIEM export, compliance reporting
//    - Searchable, filterable, exportable

// 7. TENANT & USER MANAGEMENT
//    - Multi-tenant SaaS — each org is a separate tenant
//    - Admins manage users, groups, devices within their tenant
//    - Role-based access: Super Admin / Admin / Read-only

// 8. REPORTING & ANALYTICS
//    - Dashboards: top risky users, top blocked apps, DLP violations
//    - Scheduled reports for compliance (SOC2, GDPR, HIPAA)

// ── NON-FUNCTIONAL REQUIREMENTS ──────────────────────────────

// 9.  LATENCY       → Policy evaluation < 10ms (inline, adds to user request)
// 10. AVAILABILITY  → 99.999% uptime (5-nines — security can't go down)
// 11. SCALABILITY   → millions of transactions/sec globally
// 12. MULTI-TENANT  → strict data isolation per org (tenant_id on every record)
// 13. SECURITY      → mTLS between services, JWT for API auth, audit all admin actions
// 14. COMPLIANCE    → GDPR, HIPAA, PCI-DSS — data residency options per region
// 15. CONSISTENCY   → policies eventually consistent across PoPs (< 30s propagation)

// ── OUT OF SCOPE ──────────────────────────────────────────────
// - Endpoint agent management (separate MDM concern)
// - Network firewall rules (handled by separate NGFW)
// - Email security (separate product)

// ─────────────────────────────────────────────────────────────
// API LAYERS OVERVIEW
// ─────────────────────────────────────────────────────────────
//
//  Layer 1 → AUTH & SESSION          POST /v1/auth/login
//                                     POST /v1/auth/token/refresh
//            SSO handoff, device posture, session creation
//
//  Layer 2 → POLICY EVALUATION       POST /v1/policy/evaluate
//            Core engine — real-time inline decision per transaction
//            Must be < 10ms — this is in the hot path
//
//  Layer 3 → DLP INSPECTION          POST /v1/dlp/inspect
//            File/content scanning — async, returns verdict + matches
//
//  Layer 4 → AUDIT LOGS              GET  /v1/logs/transactions
//            Searchable, paginated transaction log for admins
//
//  Layer 5 → TENANT MANAGEMENT       GET/POST/PATCH /v1/admin/users
//                                     GET/POST/PATCH /v1/admin/policies
//            Admin CRUD for users, groups, policies
//
// ─────────────────────────────────────────────────────────────


// ─────────────────────────────────────────────────────────────
// LAYER 1 — AUTH & SESSION
// POST /v1/auth/login
// ─────────────────────────────────────────────────────────────
//
// Design Note:
//   Netskope uses SSO (SAML/OIDC) for enterprise users.
//   On login we also collect device posture — this feeds into
//   policy evaluation for the lifetime of the session.
//   ❌ We do NOT return full policy data here — too expensive.
//   ✅ We return a session JWT + device posture score only.

const loginPayload = {
    // Identity — either SSO token or local credentials
    sso_token: "saml_assertion_xyz...",   // from IdP (Okta, Azure AD, etc.)
    // OR
    email: "ashish@company.com",
    password: "********",

    // Device context — collected by Netskope client agent
    device: {
        device_id: "dev_abc123",          // unique device fingerprint
        os: "macOS",                      // "macOS" | "Windows" | "iOS" | "Android" | "Linux"
        os_version: "14.5",
        is_managed: true,                 // enrolled in MDM (Jamf, Intune, etc.)
        is_compliant: true,               // MDM compliance check passed
        antivirus_enabled: true,
        disk_encrypted: true,
        last_patch_date: "2026-03-01",
    },

    // Network context
    network: {
        ip_address: "203.0.113.42",
        location: "IN",                   // ISO country code
        is_corporate_network: false,      // VPN / office IP range
    },
};

const loginResponse = {
    status: "success",
    data: {
        // Short-lived access token (15 min) + long-lived refresh token
        access_token: "eyJhbGciOiJSUzI1NiJ9...",
        refresh_token: "eyJhbGciOiJSUzI1NiJ9...",
        token_type: "Bearer",
        expires_in: 900,                  // seconds (15 min)

        // User identity resolved from SSO/local auth
        user: {
            user_id: "usr_xyz789",
            email: "ashish@company.com",
            display_name: "Ashish Baghel",
            tenant_id: "tnt_company123",  // which org this user belongs to
            groups: ["engineering", "india-office"], // LDAP/AD groups — used in policies
            role: "user",                 // "user" | "admin" | "super_admin"
        },

        // Device posture score — 0 to 100
        // Used in every policy evaluation during this session
        device_posture: {
            score: 88,                    // composite risk score
            level: "high",               // "low" | "medium" | "high" (trust level)
            issues: [],                   // e.g. ["antivirus_outdated", "os_patch_missing"]
        },

        // Risk score — initial session risk
        session_risk: {
            score: 12,                    // 0 = no risk, 100 = maximum risk
            level: "low",                 // "low" | "medium" | "high" | "critical"
            signals: [],                  // e.g. ["new_device", "unusual_location"]
        },
    },
};

// POST /v1/auth/token/refresh
// Refresh access token using refresh token (called silently by client)
const tokenRefreshPayload = {
    refresh_token: "eyJhbGciOiJSUzI1NiJ9...",
};

const tokenRefreshResponse = {
    status: "success",
    data: {
        access_token: "eyJhbGciOiJSUzI1NiJ9...", // new token
        expires_in: 900,
    },
};


// ─────────────────────────────────────────────────────────────
// LAYER 2 — POLICY EVALUATION ENGINE
// POST /v1/policy/evaluate
// ─────────────────────────────────────────────────────────────
//
// Design Notes (this is the most critical API):
//   • Called INLINE for every cloud transaction — must be < 10ms
//   • Input: (user + device + app + action + data context)
//   • Output: verdict (allow / block / alert / step_up_mfa / limit)
//   • Policies are evaluated in priority order — first match wins
//   • ❌ Do NOT do DLP scanning here — that's async (Layer 3)
//   • ✅ DLP result is passed IN here once scanning is done
//   • Cached policy set per tenant — refreshed every 30 seconds from policy store
//
//  Transaction flow:
//    User uploads file to Google Drive
//    → Netskope proxy intercepts
//    → calls POST /v1/policy/evaluate  ← THIS ENDPOINT
//    → gets verdict
//    → if verdict = "inspect_dlp" → calls POST /v1/dlp/inspect (async)
//    → once DLP done → calls POST /v1/policy/evaluate again with dlp_result
//    → final verdict enforced

const policyEvaluatePayload = {
    // Transaction context — what is happening
    transaction: {
        transaction_id: "txn_abc123",     // unique per request (for correlation / audit)
        timestamp: "2026-03-10T08:30:00Z",

        // Who
        user_id: "usr_xyz789",
        tenant_id: "tnt_company123",
        groups: ["engineering", "india-office"],

        // From what device
        device: {
            device_id: "dev_abc123",
            posture_score: 88,
            posture_level: "high",
            is_managed: true,
            is_compliant: true,
            os: "macOS",
        },

        // To what app (cloud app being accessed)
        app: {
            app_id: "app_googledrive",
            app_name: "Google Drive",
            app_category: "cloud_storage",  // "cloud_storage" | "collab" | "crm" | "hr" | etc.
            risk_score: 3,                  // Netskope's app risk index (1–10, 10 = most risky)
            is_sanctioned: true,            // IT-approved app vs shadow IT
        },

        // What action on the app
        action: {
            type: "upload",                 // "upload" | "download" | "share" | "login" | "delete" | "view"
            http_method: "POST",
            url: "https://www.googleapis.com/upload/drive/v3/files",
        },

        // Data being transferred (if file)
        data: {
            file_name: "Q1_Financials.xlsx",
            file_size_bytes: 2048000,       // 2 MB
            mime_type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            dlp_result: null,               // null on first call; populated on second call after DLP scan
        },

        // Network context
        network: {
            ip_address: "203.0.113.42",
            location: "IN",
            is_corporate_network: false,
        },
    },
};

const policyEvaluateResponse = {
    status: "success",
    data: {
        transaction_id: "txn_abc123",

        // ── VERDICT ──────────────────────────────────────────
        // "allow"        → let the request through
        // "block"        → block the request, show user a block page
        // "alert"        → allow but log + alert admin
        // "limit"        → allow but with restrictions (e.g. no download, read-only)
        // "step_up_mfa"  → challenge user with MFA before allowing
        // "encrypt"      → allow but encrypt the file in transit
        // "quarantine"   → allow upload but move file to quarantine folder
        // "inspect_dlp"  → hold request, trigger async DLP scan, then re-evaluate
        verdict: "inspect_dlp",

        // Which policy triggered this verdict (for audit trail)
        matched_policy: {
            policy_id: "pol_finance_data",
            policy_name: "Block PCI Data Upload to Non-Corporate",
            priority: 5,
        },

        // User-facing message (shown on block page or notification)
        user_message: "Your file upload is being scanned for sensitive content.",

        // Admin alert generated?
        alert_generated: true,

        // How long to cache this decision (for same user+app+context)
        // 0 = don't cache (re-evaluate every time — for high-risk verdicts)
        cache_ttl_seconds: 0,
    },
};


// ─────────────────────────────────────────────────────────────
// LAYER 3 — DLP INSPECTION
// POST /v1/dlp/inspect
// ─────────────────────────────────────────────────────────────
//
// Design Notes:
//   • Called ASYNC — the policy engine returns "inspect_dlp" verdict
//   • File is uploaded to a temporary inspection buffer (not persisted)
//   • Inspection runs: regex patterns + ML classifiers + fingerprinting
//   • Once done, result is POSTed back to policy engine for final verdict
//   • For large files (> 100MB) — partial scan (first + last 1MB + metadata)
//   • Timeout: max 5 seconds — if scan times out, verdict defaults to "allow + alert"

const dlpInspectPayload = {
    transaction_id: "txn_abc123",         // correlate back to policy evaluation
    tenant_id: "tnt_company123",

    // File content reference (not the raw bytes — we use a pre-signed temp URL)
    file: {
        temp_url: "https://inspect-buffer.netskope.com/tmp/txn_abc123",  // pre-signed, expires in 60s
        file_name: "Q1_Financials.xlsx",
        file_size_bytes: 2048000,
        mime_type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    },

    // Which DLP profiles to run (configured per tenant by admin)
    dlp_profiles: ["pci_dss", "pii_india", "financial_data"],
};

const dlpInspectResponse = {
    status: "success",
    data: {
        transaction_id: "txn_abc123",
        scan_id: "scan_def456",

        // Overall DLP verdict for this file
        // "clean"    → no sensitive data found
        // "violation" → sensitive data found — matches one or more rules
        // "timeout"   → scan took too long (policy engine should default to allow+alert)
        dlp_verdict: "violation",

        // Which rules triggered
        violations: [
            {
                rule_id: "rule_credit_card",
                rule_name: "Credit Card Numbers (PCI)",
                profile: "pci_dss",
                severity: "critical",         // "low" | "medium" | "high" | "critical"
                match_count: 3,               // how many times the pattern matched
                // ❌ Do NOT return the actual matched text in API response
                //    (would re-expose sensitive data in logs)
                matched_text_preview: "XXXX-XXXX-XXXX-4242", // redacted preview only
                confidence: 0.97,             // ML confidence score (0–1)
            },
            {
                rule_id: "rule_aadhaar",
                rule_name: "Aadhaar Number (India PII)",
                profile: "pii_india",
                severity: "high",
                match_count: 1,
                matched_text_preview: "XXXX XXXX 4321",
                confidence: 0.91,
            },
        ],

        // Scan metadata
        scan_duration_ms: 820,
        file_pages_scanned: 12,               // for PDFs/docs
        truncated: false,                     // true if file was too large and partially scanned
    },
};


// ─────────────────────────────────────────────────────────────
// LAYER 4 — AUDIT LOGS / TRANSACTION LOG
// GET /v1/logs/transactions
// ─────────────────────────────────────────────────────────────
//
// Design Notes:
//   • Every cloud transaction is logged — allow AND block
//   • Logs are immutable — append-only, no update/delete
//   • Cursor-based pagination (logs are high volume, offset pagination breaks)
//   • Logs stored 90 days hot (searchable), 1 year cold (exportable archive)
//   • Admins can filter by user, app, action, verdict, date range
//   • SIEM export: logs can be streamed to Splunk / QRadar / Datadog via webhook

// Request:
// GET /v1/logs/transactions
//   ?tenant_id=tnt_company123
//   &user_id=usr_xyz789          → filter by user (optional)
//   &app_id=app_googledrive      → filter by cloud app (optional)
//   &action=upload               → filter by action type (optional)
//   &verdict=block               → filter by policy verdict (optional)
//   &severity=critical           → filter by DLP severity (optional)
//   &from=2026-03-01T00:00:00Z   → date range start
//   &to=2026-03-10T23:59:59Z     → date range end
//   &size=50                     → page size (max 200)
//   &after_cursor=abc123         → cursor for next page

const transactionLogsResponse = {
    status: "success",
    data: {
        // Cursor-based pagination
        pagination: {
            size: 50,
            total_results: 12840,          // approximate total (exact count too expensive for large datasets)
            next_cursor: "cursor_xyz789",
            has_next_page: true,
        },

        // Aggregated summary for the filtered result set (useful for dashboard)
        summary: {
            total_transactions: 12840,
            blocked: 342,
            alerted: 128,
            dlp_violations: 56,
            top_blocked_app: "Dropbox",
            top_risky_user: "john.doe@company.com",
        },

        transactions: [
            {
                transaction_id: "txn_abc123",
                timestamp: "2026-03-10T08:30:00Z",

                // Who
                user: {
                    user_id: "usr_xyz789",
                    email: "ashish@company.com",
                    display_name: "Ashish Baghel",
                },

                // What device
                device: {
                    device_id: "dev_abc123",
                    os: "macOS",
                    is_managed: true,
                    posture_level: "high",
                },

                // What app + action
                app: {
                    app_id: "app_googledrive",
                    app_name: "Google Drive",
                    app_category: "cloud_storage",
                    is_sanctioned: true,
                },
                action: {
                    type: "upload",
                    url: "https://www.googleapis.com/upload/drive/v3/files",
                },

                // Data
                data: {
                    file_name: "Q1_Financials.xlsx",
                    file_size_bytes: 2048000,
                },

                // Policy result
                policy_result: {
                    verdict: "block",
                    matched_policy_id: "pol_finance_data",
                    matched_policy_name: "Block PCI Data Upload to Non-Corporate",
                },

                // DLP result (null if no DLP scan was run)
                dlp_result: {
                    scan_id: "scan_def456",
                    dlp_verdict: "violation",
                    top_violation: "Credit Card Numbers (PCI)",
                    severity: "critical",
                    violation_count: 2,
                },

                // Network
                network: {
                    ip_address: "203.0.113.42",
                    location: "IN",
                    is_corporate_network: false,
                },
            },
        ],
    },
};


// ─────────────────────────────────────────────────────────────
// LAYER 5A — ADMIN: POLICY MANAGEMENT
// GET/POST/PATCH/DELETE /v1/admin/policies
// ─────────────────────────────────────────────────────────────
//
// Design Notes:
//   • Policies are the core config of Netskope — admins spend most time here
//   • Policies are ordered by priority (lower number = evaluated first)
//   • Policy changes propagate to all PoPs in < 30 seconds (eventual consistency)
//   • All admin actions are audit logged
//   • ❌ Admins cannot delete policies — only disable (immutable audit trail)

// GET /v1/admin/policies
// List all policies for the tenant

const policiesListResponse = {
    status: "success",
    data: {
        policies: [
            {
                policy_id: "pol_finance_data",
                policy_name: "Block PCI Data Upload to Non-Corporate",
                priority: 5,               // lower = evaluated first
                is_enabled: true,
                created_at: "2025-01-15T10:00:00Z",
                updated_at: "2026-02-01T14:30:00Z",
                created_by: "admin@company.com",

                // IF conditions (all must match — AND logic)
                conditions: {
                    users: { type: "group", values: ["all"] },       // all users
                    devices: { type: "any" },                         // any device
                    apps: { type: "category", values: ["cloud_storage"] }, // any cloud storage app
                    actions: ["upload", "share"],                     // on upload or share
                    data: {
                        dlp_profiles: ["pci_dss", "financial_data"], // if DLP finds these
                    },
                    network: { is_corporate_network: false },         // when NOT on corporate network
                },

                // THEN action
                action: {
                    verdict: "block",
                    notify_user: true,
                    notify_admin: true,
                    alert_severity: "critical",
                },
            },
            {
                policy_id: "pol_unsanctioned_upload",
                policy_name: "Alert on Upload to Shadow IT Apps",
                priority: 10,
                is_enabled: true,
                created_at: "2025-03-01T09:00:00Z",
                updated_at: "2025-03-01T09:00:00Z",
                created_by: "admin@company.com",

                conditions: {
                    users: { type: "group", values: ["all"] },
                    devices: { type: "any" },
                    apps: { type: "property", key: "is_sanctioned", value: false }, // shadow IT only
                    actions: ["upload"],
                    data: { type: "any" },
                    network: { type: "any" },
                },

                action: {
                    verdict: "alert",
                    notify_user: false,
                    notify_admin: true,
                    alert_severity: "medium",
                },
            },
        ],
    },
};

// POST /v1/admin/policies  — Create a new policy
const createPolicyPayload = {
    policy_name: "Step-up MFA for Finance Apps from Unmanaged Device",
    priority: 3,
    is_enabled: true,

    conditions: {
        users: { type: "group", values: ["finance-team"] },
        devices: {
            type: "property",
            key: "is_managed",
            value: false,                  // unmanaged (BYOD) devices
        },
        apps: { type: "category", values: ["finance", "erp"] },
        actions: ["login", "download"],
        data: { type: "any" },
        network: { type: "any" },
    },

    action: {
        verdict: "step_up_mfa",
        mfa_method: "totp",                // "totp" | "push" | "sms"
        notify_user: true,
        notify_admin: false,
        alert_severity: "medium",
    },
};

const createPolicyResponse = {
    status: "success",
    data: {
        policy_id: "pol_finance_mfa",
        policy_name: "Step-up MFA for Finance Apps from Unmanaged Device",
        priority: 3,
        is_enabled: true,
        created_at: "2026-03-10T09:00:00Z",
        propagation_status: "propagating", // "propagating" | "active" — takes < 30s to reach all PoPs
    },
};


// ─────────────────────────────────────────────────────────────
// LAYER 5B — ADMIN: USER MANAGEMENT
// GET/POST/PATCH /v1/admin/users
// ─────────────────────────────────────────────────────────────
//
// Design Notes:
//   • Users are usually synced from IdP (Okta, Azure AD) via SCIM protocol
//   • Manual user management also supported
//   • Admins can view risk scores per user (UEBA — User Entity Behavior Analytics)
//   • ❌ Admins cannot delete users — only deactivate (audit trail integrity)

// GET /v1/admin/users
// ?tenant_id=tnt_company123&risk_level=high&sort=risk_score&size=20&after_cursor=abc

const usersListResponse = {
    status: "success",
    data: {
        pagination: {
            size: 20,
            next_cursor: "cursor_abc",
            has_next_page: true,
        },
        users: [
            {
                user_id: "usr_xyz789",
                email: "ashish@company.com",
                display_name: "Ashish Baghel",
                status: "active",          // "active" | "deactivated" | "suspended"
                role: "user",              // "user" | "admin" | "super_admin"
                department: "Engineering",
                groups: ["engineering", "india-office"],

                // Device summary
                devices: [
                    {
                        device_id: "dev_abc123",
                        os: "macOS",
                        is_managed: true,
                        last_seen: "2026-03-10T08:30:00Z",
                    },
                ],

                // UEBA risk profile
                risk: {
                    score: 28,             // 0 = no risk, 100 = maximum risk
                    level: "low",          // "low" | "medium" | "high" | "critical"
                    // Risk signals observed for this user
                    signals: [],           // e.g. ["impossible_travel", "bulk_download", "after_hours_access"]
                },

                // Activity summary (last 30 days)
                activity_summary: {
                    total_transactions: 4820,
                    blocked: 3,
                    dlp_violations: 0,
                    top_apps: ["Google Drive", "GitHub", "Slack"],
                },

                last_login: "2026-03-10T07:00:00Z",
                created_at: "2024-06-01T00:00:00Z",
            },
        ],
    },
};


// ─────────────────────────────────────────────────────────────
// ERROR HANDLING — Consistent error format across all endpoints
// ─────────────────────────────────────────────────────────────
//
//  HTTP 400 → Bad Request       (invalid input / missing required field)
//  HTTP 401 → Unauthorized      (missing or expired token)
//  HTTP 403 → Forbidden         (valid token but insufficient role/permission)
//  HTTP 404 → Not Found         (resource does not exist for this tenant)
//  HTTP 409 → Conflict          (e.g. policy name already exists)
//  HTTP 429 → Too Many Requests (rate limit hit)
//  HTTP 500 → Internal Error    (unexpected server error — do not expose internals)
//  HTTP 503 → Service Unavailable (DLP engine down, etc.)

const errorResponse = {
    status: "error",
    error: {
        code: "POLICY_NAME_CONFLICT",      // machine-readable code (for client handling)
        message: "A policy with this name already exists in your tenant.",
        details: {
            field: "policy_name",
            conflicting_policy_id: "pol_finance_data",
        },
        request_id: "req_abc123",          // for debugging / support ticket correlation
        timestamp: "2026-03-10T09:00:00Z",
    },
};


// ─────────────────────────────────────────────────────────────
// RATE LIMITING
// ─────────────────────────────────────────────────────────────
//
//  All API responses include rate limit headers:
//
//    X-RateLimit-Limit     → max requests allowed in the window
//    X-RateLimit-Remaining → requests left in current window
//    X-RateLimit-Reset     → Unix timestamp when window resets
//
//  Limits (per tenant):
//    POST /v1/policy/evaluate → 10,000 req/sec  (inline hot path — very high limit)
//    POST /v1/dlp/inspect     → 500 req/sec      (CPU intensive — lower limit)
//    GET  /v1/logs/*          → 100 req/min      (read-heavy, cached)
//    POST /v1/admin/*         → 60  req/min      (admin actions — low limit, audit logged)
//
//  On 429 response, client should:
//    1. Read Retry-After header
//    2. Exponential backoff with jitter


// ─────────────────────────────────────────────────────────────
// WEBHOOK / EVENT STREAMING — Real-time Alerts to SIEM
// POST to customer-configured webhook URL
// ─────────────────────────────────────────────────────────────
//
// Design Notes:
//   • Admins configure a webhook URL in their tenant settings
//   • Netskope POSTs events in real time (or near real time — < 5s delay)
//   • Events: policy violations, DLP matches, high-risk user activity, admin changes
//   • Payload is signed with HMAC-SHA256 → customer verifies signature
//   • Retry: if webhook returns non-2xx → retry up to 5 times with exponential backoff
//   • Dead letter: failed events go to admin dashboard for manual export

const webhookEventPayload = {
    // HMAC signature — customer verifies this to ensure payload is from Netskope
    // Signature = HMAC-SHA256(webhook_secret, JSON.stringify(event))
    signature: "sha256=abc123...",

    event: {
        event_id: "evt_abc789",
        event_type: "dlp_violation",      // "dlp_violation" | "policy_block" | "high_risk_user" | "admin_change"
        severity: "critical",
        timestamp: "2026-03-10T08:30:00Z",
        tenant_id: "tnt_company123",

        // Full transaction detail (same structure as audit log entry)
        transaction: {
            transaction_id: "txn_abc123",
            user: { user_id: "usr_xyz789", email: "ashish@company.com" },
            app: { app_name: "Google Drive" },
            action: { type: "upload" },
            data: { file_name: "Q1_Financials.xlsx" },
            policy_result: { verdict: "block", matched_policy_name: "Block PCI Data Upload to Non-Corporate" },
            dlp_result: { dlp_verdict: "violation", top_violation: "Credit Card Numbers (PCI)", severity: "critical" },
        },
    },
};
