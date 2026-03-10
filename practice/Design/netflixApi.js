// ─────────────────────────────────────────────────────────────
// NETFLIX — REQUIREMENTS
// ─────────────────────────────────────────────────────────────

// ── FUNCTIONAL REQUIREMENTS (Core — Must Have) ───────────────

// 1. AUTH & ACCOUNT
//    - User can sign up with email + password
//    - User can log in / log out
//    - User can manage subscription plan (Basic / Standard / Premium)
//    - User can add/remove payment method

// 2. PROFILES
//    - Account can have multiple profiles (e.g. up to 5 — kids, adults)
//    - User can create, update, delete a profile
//    - Each profile has its own watch history, preferences, and recommendations
//    - Kids profile has content restrictions (age-gated content blocked)

// 3. CONTENT BROWSING
//    - User can see a personalised home feed (rows: Trending, Top 10, Continue Watching, etc.)
//    - User can browse by category / genre (Action, Comedy, Documentaries, etc.)
//    - User can view content detail page (title, description, cast, rating, trailer)
//    - User can see similar / recommended content

// 4. SEARCH
//    - User can search content by title, actor, director, or genre
//    - Search returns ranked results (relevance + popularity)

// 5. STREAMING
//    - User can play any available content (movie or TV series episode)
//    - User can pause, resume, seek to any position
//    - Video quality adapts automatically to available bandwidth (adaptive bitrate)
//    - User can manually select video quality (Auto / 480p / 720p / 1080p / 4K)
//    - User can enable/disable subtitles and change audio track / language

// 6. CONTINUE WATCHING
//    - Playback position is saved automatically per profile
//    - User can resume from where they left off on any device

// 7. MY LIST (Watchlist)
//    - User can add / remove content to a personal watchlist
//    - Watchlist is synced across all devices

// 8. RATINGS
//    - User can rate content (thumbs up / thumbs down)
//    - Ratings influence personalised recommendations

// 9. DOWNLOADS (Offline Viewing)
//    - User can download content for offline playback (mobile only)
//    - Downloads expire after a set period (e.g. 30 days, or 48h after first play)
//    - Download quality selectable (Standard / High)

// ── NON-FUNCTIONAL REQUIREMENTS ──────────────────────────────

// 10. AVAILABILITY    → 99.99% uptime (< 1 hour downtime/year)
// 11. SCALABILITY     → support millions of concurrent streams globally
// 12. LOW LATENCY     → stream start time < 2 seconds
// 13. CDN             → content served from edge nodes closest to the user
// 14. DRM             → content encrypted to prevent piracy (Widevine / FairPlay)
// 15. MULTI-DEVICE    → works on Web, iOS, Android, Smart TV, Chromecast, Game Consoles
// 16. SECURITY        → session auth, HTTPS only, device limit enforced per plan
// 17. CONSISTENCY     → watch progress & watchlist eventually consistent across devices

// ── OUT OF SCOPE (Nice to Have / Future) ─────────────────────
// - Live streaming (sports, events)
// - Social features (share, comments)
// - Content creator / upload portal
// - Parental PIN lock per profile

// /api/v1/login/sign_up

const signUpform = {
    email: "",
    phone_number: 91020011,
    password: "*******",
    default_profile: false,
    device_id: uuid(),
};

const signUpResponse = {
    status: "success",
    message: "profile has been created successfully",
    isSubscribed: false,
    profiles: {
        ashish_id: {
            profile_id: uuid(),
            profile_name: "Ashish",
        },
    },
};

// /api/v1/login

const loginPayload = {
    email: "",
    password: "",
    remember_me: false,
    device_id: uuid(),
};

const response = {
    status: "success",
    isSubscribed: false,
    profiles: {
        ashish_id: {
            profile_id: uuid(),
            profile_name: "Ashish",
        },
    },
};

// ─────────────────────────────────────────────────────────────
// CONTENT API — 3 LAYERS (each for a different screen/purpose)
// ─────────────────────────────────────────────────────────────
//
//  Layer 1 → CATALOG (Browse/Home)   GET /v1/catalog/:profileId
//            Lightweight cards for rendering rows on home screen
//            ❌ NO streaming URLs here — too expensive & sensitive
//
//  Layer 2 → DETAIL PAGE             GET /v1/content/:contentId?profile_id=
//            Full info: cast, trailer, episodes, related content
//            ❌ NO streaming URLs here either
//
//  Layer 3 → STREAM SESSION          GET /v1/content/:contentId/stream?profile_id=
//            Only called when user hits PLAY
//            ✅ Returns CDN manifest URL + DRM token + subtitles
//
// ─────────────────────────────────────────────────────────────
// LAYER 1 — GET /v1/catalog/:profileId
// ?genre=action&type=movie&region=IN&language=en&sort=top10&size=20&after_cursor=abc
// ─────────────────────────────────────────────────────────────

const catalogResponse = {
    status: "success",
    data: {
        // Cursor-based pagination (feed never shifts on live updates)
        pagination: {
            size: 20,
            next_cursor: "abc123",
            has_next_page: true,
        },
        // Grouped rows like Netflix home screen
        rows: [
            {
                row_id: "trending_today",
                row_title: "Trending Now",
                content: [
                    {
                        // ── Shared fields (movie & series) ──
                        content_id: "cnt_abc123", // ✅ unique ID
                        type: "movie", // "movie" | "series"
                        title: "Kantara",
                        thumbnail_url: "https://cdn.example.com/kantara_thumb.jpg", // horizontal card
                        poster_url: "https://cdn.example.com/kantara_poster.jpg", // vertical poster
                        year: 2022,
                        age_rating: "UA", // "U" | "UA" | "A" | "PG" | "R" | "TV-MA"
                        genres: ["action", "mythology", "thriller"], // ✅ array, not string
                        languages: ["kn", "hi", "ta", "te", "en"], // ✅ ISO language codes
                        match_percent: 97, // personalized score for this profile
                        is_new: true, // badge: "New"
                        is_trending: true, // badge: "Trending"

                        // ── Movie specific ──
                        duration_minutes: 148,

                        // ── Series specific (null for movie) ──
                        seasons_count: null,
                        episodes_count: null,

                        // ── Viewer context (per profile, changes per user) ──
                        viewer_context: {
                            is_in_my_list: false,
                            user_rating: null, // null | "thumbs_up" | "thumbs_down"
                            watch_progress: null, // null if not started
                        },
                    },
                    {
                        content_id: "cnt_def456",
                        type: "series",
                        title: "Game of Thrones",
                        thumbnail_url: "https://cdn.example.com/got_thumb.jpg",
                        poster_url: "https://cdn.example.com/got_poster.jpg",
                        year: 2011,
                        age_rating: "TV-MA",
                        genres: ["fantasy", "drama", "action"],
                        languages: ["en", "hi", "de", "fr"],
                        match_percent: 89,
                        is_new: false,
                        is_trending: false,

                        // ── Movie specific (null for series) ──
                        duration_minutes: null,

                        // ── Series specific ──
                        seasons_count: 8,
                        episodes_count: 73,

                        // ── Viewer context ──
                        viewer_context: {
                            is_in_my_list: true,
                            user_rating: "thumbs_up",
                            watch_progress: {
                                // resume point for this profile
                                season: 3,
                                episode: 9,
                                position_seconds: 1840,
                                total_duration_seconds: 3480,
                            },
                        },
                    },
                ],
            },
        ],
    },
};

// ─────────────────────────────────────────────────────────────
// LAYER 2 — GET /v1/content/:contentId?profile_id=
// Full detail page — fetched when user clicks on a content card
// ─────────────────────────────────────────────────────────────

const contentDetailResponse = {
    status: "success",
    data: {
        content_id: "cnt_abc123",
        type: "movie",
        title: "Kantara",
        tagline: "A man becomes myth",
        description:
            "A fierce conflict brews between a demon worshipper and a tribal man.",
        thumbnail_url: "https://cdn.example.com/kantara_thumb.jpg",
        poster_url: "https://cdn.example.com/kantara_poster.jpg",
        trailer_url: "https://cdn.example.com/kantara_trailer.mp4", // trailer only, not full stream
        year: 2022,
        age_rating: "UA",
        genres: ["action", "mythology", "thriller"],
        languages: ["kn", "hi", "ta", "te", "en"],
        duration_minutes: 148,

        // Cast & crew
        cast: [
            {
                name: "Rishab Shetty",
                role: "Shiva",
                profile_image: "https://cdn.example.com/rishab.jpg",
            },
            {
                name: "Sapthami Gowda",
                role: "Leela",
                profile_image: "https://cdn.example.com/sapthami.jpg",
            },
        ],
        directors: ["Rishab Shetty"],

        // ── For SERIES only (null for movie) ──
        seasons: null,
        // seasons: [
        //   {
        //     season_number: 1,
        //     year: 2011,
        //     episodes: [
        //       {
        //         episode_number: 1,
        //         title: "Winter Is Coming",
        //         description: "...",
        //         duration_minutes: 62,
        //         thumbnail_url: "https://cdn.example.com/got_s1e1.jpg",
        //         viewer_context: { watch_progress: { position_seconds: 0, ... } }
        //       }
        //     ]
        //   }
        // ],

        // Engagement counts (flat object, not array)
        engagement: {
            likes: 980000,
            trending_rank: 3, // e.g. "#3 in India today"
            trending_score: 94, // internal score 0–100
        },

        // Related content (lightweight references, not full objects)
        related_content: [
            {
                content_id: "cnt_xyz",
                title: "KGF Chapter 2",
                thumbnail_url: "https://cdn.example.com/kgf.jpg",
                type: "movie",
            },
            {
                content_id: "cnt_uvw",
                title: "RRR",
                thumbnail_url: "https://cdn.example.com/rrr.jpg",
                type: "movie",
            },
        ],

        available_regions: ["IN", "US", "CA", "GB", "AU"],

        // Viewer context
        viewer_context: {
            is_in_my_list: false,
            user_rating: null,
            watch_progress: null,
        },
    },
};

// ─────────────────────────────────────────────────────────────
// LAYER 3 — GET /v1/content/:contentId/stream
// ?profile_id=&season=1&episode=1&quality=auto&language=kn
// Called ONLY when user hits PLAY — never during browsing
// ─────────────────────────────────────────────────────────────

const streamSessionResponse = {
    status: "success",
    data: {
        stream_id: "str_xyz789",
        content_id: "cnt_abc123",

        // MPEG-DASH / HLS manifest — adaptive bitrate (client picks quality)
        manifest_url: "https://cdn.example.com/kantara/manifest.mpd",

        // DRM (Digital Rights Management — prevents piracy)
        drm: {
            type: "widevine", // "widevine" (Android/Web) | "fairplay" (iOS/Safari)
            license_url: "https://drm.example.com/license",
            token: "eyJhbGciOiJSUzI1NiJ9...", // short-lived JWT token
        },

        // Available subtitle tracks
        subtitles: [
            {
                language: "en",
                label: "English",
                url: "https://cdn.example.com/kantara/en.vtt",
            },
            {
                language: "hi",
                label: "Hindi",
                url: "https://cdn.example.com/kantara/hi.vtt",
            },
        ],

        // Available audio tracks
        audio_tracks: [
            { language: "kn", label: "Kannada (Original)", is_default: true },
            { language: "hi", label: "Hindi Dubbed", is_default: false },
            { language: "en", label: "English Dubbed", is_default: false },
        ],

        // Where to resume (from viewer's saved progress)
        resume_position_seconds: 0,

        // Pre-signed stream URL expires — client must re-fetch if expired
        expires_at: "2026-03-09T14:00:00Z",
    },
};

// ─────────────────────────────────────────────────────────────
// SEARCH API
// ─────────────────────────────────────────────────────────────
//
// Two endpoints, two different purposes:
//
//  1. AUTOCOMPLETE  →  GET /v1/search/suggestions?q=kant
//                      Fires on EVERY keystroke (debounced ~300ms on client)
//                      Ultra fast (<100ms), returns lightweight hints only
//
//  2. FULL SEARCH   →  GET /v1/search?q=kantara&...filters
//                      Fires on ENTER / search button press
//                      Returns ranked, paginated, full result set
//
// ─────────────────────────────────────────────────────────────
// ENDPOINT 1 — GET /v1/search/suggestions?q=kant&profile_id=
// Autocomplete — called on every keystroke
// ─────────────────────────────────────────────────────────────

// Request:
// GET /v1/search/suggestions?q=kant&profile_id=pro_abc123
//   q            → partial search term (min 2 chars)
//   profile_id   → to personalise suggestions (e.g. boost genres the user watches)

const suggestionsResponse = {
    status: "success",
    data: {
        query: "kant",
        suggestions: [
            // Content title matches
            { type: "title", label: "Kantara", content_id: "cnt_abc123", thumbnail_url: "https://cdn.example.com/kantara_thumb.jpg", content_type: "movie" },
            { type: "title", label: "Kantara Chapter 2", content_id: "cnt_abc456", thumbnail_url: "https://cdn.example.com/kantara2_thumb.jpg", content_type: "movie" },

            // Person matches (actor / director)
            { type: "person", label: "Rishab Shetty", person_id: "prs_xyz", profile_image: "https://cdn.example.com/rishab.jpg", role: "director" },

            // Genre / category match
            { type: "genre", label: "Kannada Movies", genre_id: "genre_kn" },
        ],
    },
};

// ─────────────────────────────────────────────────────────────
// ENDPOINT 2 — GET /v1/search?q=kantara&...
// Full search — called on ENTER / search submit
// ─────────────────────────────────────────────────────────────

// Request query params:
// GET /v1/search
//   ?q=kantara           → search term (required)
//   &profile_id=pro_abc  → personalise results (required)
//   &type=movie          → filter: "movie" | "series" | "all" (default: "all")
//   &genre=action        → filter by genre
//   &language=kn         → filter by audio/subtitle language
//   &region=IN           → filter by availability region
//   &sort=relevance      → "relevance" (default) | "release_year" | "trending"
//   &size=20             → page size
//   &after_cursor=abc123 → cursor for next page

const searchResponse = {
    status: "success",
    data: {
        query: "kantara",                   // echoed back — useful for UI display

        // Cursor-based pagination
        pagination: {
            size: 20,
            total_results: 42,               // approximate total matches
            next_cursor: "xyz456",
            has_next_page: true,
        },

        // Facets — available filter options within THIS result set
        // (lets UI render filter chips dynamically based on what's actually found)
        facets: {
            types: [{ value: "movie", count: 38 }, { value: "series", count: 4 }],
            genres: [{ value: "action", count: 20 }, { value: "mythology", count: 15 }, { value: "drama", count: 7 }],
            languages: [{ value: "kn", count: 42 }, { value: "hi", count: 40 }, { value: "en", count: 20 }],
        },

        // Results grouped by match type (like Netflix's search layout)
        results: {

            // ── Top result (best single match, shown prominently at top) ──
            top_result: {
                content_id: "cnt_abc123",
                type: "movie",
                title: "Kantara",
                poster_url: "https://cdn.example.com/kantara_poster.jpg",
                year: 2022,
                age_rating: "UA",
                genres: ["action", "mythology"],
                duration_minutes: 148,
                match_percent: 97,
                relevance_score: 0.99,         // internal ranking score (0–1), not shown to user
                viewer_context: {
                    is_in_my_list: false,
                    user_rating: null,
                    watch_progress: null,
                },
            },

            // ── Content matches (movies + series mixed) ──
            content: [
                {
                    content_id: "cnt_abc123",
                    type: "movie",
                    title: "Kantara",
                    thumbnail_url: "https://cdn.example.com/kantara_thumb.jpg",
                    poster_url: "https://cdn.example.com/kantara_poster.jpg",
                    year: 2022,
                    age_rating: "UA",
                    genres: ["action", "mythology", "thriller"],
                    languages: ["kn", "hi", "ta", "en"],
                    duration_minutes: 148,       // movie
                    seasons_count: null,         // series (null for movie)
                    episodes_count: null,
                    match_percent: 97,
                    is_new: false,
                    is_trending: true,
                    // Which part of the content matched (highlight for UI)
                    matched_on: ["title"],       // "title" | "cast" | "description" | "genre"
                    viewer_context: {
                        is_in_my_list: false,
                        user_rating: null,
                        watch_progress: null,
                    },
                },
            ],

            // ── People matches (actors/directors whose name matched) ──
            people: [
                {
                    person_id: "prs_xyz789",
                    name: "Rishab Shetty",
                    role: "director",             // "actor" | "director" | "producer"
                    profile_image: "https://cdn.example.com/rishab.jpg",
                    known_for: ["Kantara", "Kirik Party"], // top titles for context
                },
            ],

            // ── Genre / Collection matches ──
            genres: [
                {
                    genre_id: "genre_kn",
                    label: "Kannada Movies",
                    thumbnail_url: "https://cdn.example.com/genre_kn.jpg",
                    content_count: 120,
                },
            ],
        },
    },
};
