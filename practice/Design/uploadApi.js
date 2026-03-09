// ─────────────────────────────────────────────────────────────
// FILE UPLOAD API DESIGN
// ─────────────────────────────────────────────────────────────
//
// Real-world upload flow (e.g. S3 pre-signed URL pattern):
//
//   Client          API Server           Storage (S3/GCS)
//     │                  │                      │
//     │─── Step 1 ──────►│                      │
//     │  POST /uploads    │                      │
//     │  (file metadata)  │                      │
//     │                  │── generate pre-signed URL ──►│
//     │◄─────────────────│                      │
//     │  { upload_url,    │                      │
//     │    upload_id }    │                      │
//     │                  │                      │
//     │─── Step 2 ──────────────────────────────►│
//     │  PUT {upload_url} (raw binary file)      │
//     │◄────────────────────────────────────────│
//     │  200 OK (direct from storage)            │
//     │                  │                      │
//     │─── Step 3 ──────►│                      │
//     │  POST /uploads/{upload_id}/confirm       │
//     │◄─────────────────│                      │
//     │  { file_id, download_url }               │
//
// ─────────────────────────────────────────────────────────────
// ENDPOINTS
// ─────────────────────────────────────────────────────────────

// Step 1 — Initiate upload (get pre-signed URL)
// POST /v1/uploads

// Step 2 — Upload file directly to storage using the pre-signed URL
// PUT {upload_url}  ← done by client directly to S3/GCS, NOT your API

// Step 3 — Confirm upload complete
// POST /v1/uploads/:upload_id/confirm

// Other
// GET    /v1/uploads/:upload_id          → get file metadata & status
// DELETE /v1/uploads/:upload_id          → delete file
// GET    /v1/uploads/:upload_id/status   → poll upload/processing status (for large files)

// ─── Chunked / Multipart Upload (for large files e.g. videos) ───
// POST   /v1/uploads/multipart/initiate                → start multipart upload
// POST   /v1/uploads/multipart/:upload_id/parts        → upload individual chunk
// POST   /v1/uploads/multipart/:upload_id/complete     → merge all chunks
// DELETE /v1/uploads/multipart/:upload_id/abort        → cancel multipart upload

// ─────────────────────────────────────────────────────────────
// STEP 1 — POST /v1/uploads
// Initiate upload: server validates metadata, returns pre-signed URL
// ─────────────────────────────────────────────────────────────

const initiateUploadRequest = {
  file_name: "youTubeShorts.mp4",      // original file name
  file_size_bytes: 5242880,            // ✅ number (bytes), not string — used for pre-validation
  content_type: "video/mp4",           // MIME type — server validates against allowed types
  context: "post_media",               // what this file is for: "post_media" | "avatar" | "document"
  metadata: {                          // optional custom key-value pairs
    caption: "Sunset at the beach",
    tags: ["nature", "sunset"],
  },
};

// ── Server validates: file size ≤ limit, content_type allowed, user quota ──

const initiateUploadResponse = {
  status: "success",
  data: {
    upload_id: "upl_abc123xyz",        // track this upload
    upload_url: "https://s3.amazonaws.com/bucket/..?X-Amz-Signature=...", // pre-signed PUT URL
    upload_method: "PUT",              // method to use when hitting upload_url
    expires_at: "2026-03-09T10:30:00Z", // ⚠️ pre-signed URL expires — client must upload before this
    // For multipart (large files), multiple URLs provided:
    // part_urls: [ { part_number: 1, url: "..." }, { part_number: 2, url: "..." } ]
  },
};

// ─────────────────────────────────────────────────────────────
// STEP 2 — Client PUTs file directly to storage (not your API)
// PUT {upload_url}
// Headers: Content-Type: video/mp4
// Body: raw binary file
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// STEP 3 — POST /v1/uploads/:upload_id/confirm
// Tell your server the upload to storage is done
// ─────────────────────────────────────────────────────────────

const confirmUploadResponse = {
  status: "success",
  data: {
    file_id: "file_xyz789",
    upload_status: "processing",        // "processing" | "ready" | "failed"
    // Once processing is done, poll GET /v1/uploads/:upload_id/status
  },
};

// ─────────────────────────────────────────────────────────────
// GET /v1/uploads/:upload_id — File metadata & status
// ─────────────────────────────────────────────────────────────

const getFileResponse = {
  status: "success",
  data: {
    file_id: "file_xyz789",
    upload_id: "upl_abc123xyz",
    file_name: "youTubeShorts.mp4",
    content_type: "video/mp4",
    file_size_bytes: 5242880,
    upload_status: "ready",             // "pending" | "processing" | "ready" | "failed"
    download_url: "https://cdn.example.com/file_xyz789.mp4",
    thumbnail_url: "https://cdn.example.com/file_xyz789_thumb.jpg", // for video/image
    context: "post_media",
    metadata: {
      caption: "Sunset at the beach",
      tags: ["nature", "sunset"],
    },
    uploaded_by: "user_abc",
    created_at: "2026-03-09T10:00:00Z",
    updated_at: "2026-03-09T10:05:00Z",
    expires_at: null,                   // null = permanent; set date if temporary file
  },
};

// ─────────────────────────────────────────────────────────────
// GET /v1/uploads/:upload_id/status — Poll processing status
// Useful for large files being transcoded/virus-scanned etc.
// ─────────────────────────────────────────────────────────────

const uploadStatusResponse = {
  status: "success",
  data: {
    upload_id: "upl_abc123xyz",
    upload_status: "processing",        // "pending" | "processing" | "ready" | "failed"
    progress_percent: 65,               // 0–100 (for processing/transcoding progress)
    estimated_completion: "2026-03-09T10:07:00Z",
  },
};

// ─────────────────────────────────────────────────────────────
// ERROR RESPONSES — Standard across all endpoints
// ─────────────────────────────────────────────────────────────

// 400 — Bad Request (validation failed)
const validationError = {
  status: "error",
  error_code: "VALIDATION_ERROR",       // ✅ type matches the HTTP status
  status_code: 400,
  title: "Invalid file type",
  message: "Only image/png, image/jpeg, and video/mp4 are allowed.",
  details: [                            // field-level errors
    { field: "content_type", issue: "Unsupported MIME type: image/gif" },
    { field: "file_size_bytes", issue: "File exceeds 100MB limit" },
  ],
};

// 401 — Unauthenticated
const authError = {
  status: "error",
  error_code: "UNAUTHORIZED",
  status_code: 401,
  title: "Authentication required",
  message: "Please log in to upload files.",
  details: [],
};

// 404 — Not Found
const notFoundError = {
  status: "error",
  error_code: "NOT_FOUND",              // ✅ was wrongly "VALIDATION_ERROR" before
  status_code: 404,
  title: "File not found",
  message: "The requested file could not be found. It may have been deleted or never existed.",
  details: [],
};

// 413 — Payload Too Large
const fileTooLargeError = {
  status: "error",
  error_code: "FILE_TOO_LARGE",
  status_code: 413,
  title: "File too large",
  message: "Maximum allowed file size is 100MB. Please compress or split the file.",
  details: [],
};

// 500 — Internal Server Error
const serverError = {
  status: "error",
  error_code: "INTERNAL_SERVER_ERROR",
  status_code: 500,
  title: "Something went wrong",
  message: "An unexpected error occurred. Please try again later.",
  details: [],
};
