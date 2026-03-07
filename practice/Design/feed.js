const GET_FEATURE = `query{
  users($filter){
    
  }
}`;

const mutation = `mutation {
    createReview(episode: JEDI,review:{
    star:5,
    comment:"this is a great movie"
    }){
        star
        comment
    }
}`;

const variable = `{
  "ep": "JEDI",
  "review": {
    "stars": 5,
    "commentary": "This is a great movie!"
  }
}`;

repsonse = {
  data: {
    rateFilm: {
      episode: "EMPIRE",
      viewerRating: "THUMBS_UP",
    },
  },
};

// ─────────────────────────────────────────────
// FEED ENDPOINTS
// ─────────────────────────────────────────────

// Feed CRUD
GET`/v1/feeds`;                                  // Get paginated feed list
GET`/v1/feeds/:id`;                              // Get single feed post
POST`/v1/feeds`;                                 // Create a new feed post
PATCH`/v1/feeds/:id`;                            // Update a feed post (author only)
DELETE`/v1/feeds/:id`;                           // Delete a feed post (author only)

// Feed interactions
POST`/v1/feeds/:id/reactions`;                   // Like / react to a post
DELETE`/v1/feeds/:id/reactions`;                 // Remove reaction
POST`/v1/feeds/:id/reposts`;                     // Repost / quote-post
POST`/v1/feeds/:id/bookmarks`;                   // Bookmark a post
DELETE`/v1/feeds/:id/bookmarks`;                 // Remove bookmark

// Comments (separate resource, not embedded in feed list)
GET`/v1/feeds/:id/comments`;                     // Paginated comments for a post
POST`/v1/feeds/:id/comments`;                    // Add a comment
PATCH`/v1/feeds/:id/comments/:commentId`;        // Edit a comment
DELETE`/v1/feeds/:id/comments/:commentId`;       // Delete a comment
POST`/v1/feeds/:id/comments/:commentId/reactions`; // React to a comment

// Filtering & sorting
GET`/v1/feeds?feed_type=chronological&size=10&after_cursor=abc123`;  // cursor-based (preferred for feeds)
GET`/v1/feeds?feed_type=ranked&size=10&page=2`;                      // offset-based (fallback)
GET`/v1/feeds?filter_by=hashtag&value=%23nature&sort_by=recent`;     // filter by hashtag / mention

// ─────────────────────────────────────────────
// RESPONSE SHAPE
// ─────────────────────────────────────────────

// GET /v1/feeds  →  Feed list response
const feedsResponse = {
  status: "success",            // "success" | "error"
  message: "Feeds fetched successfully",
  data: {
    // ── Cursor-based pagination (preferred for infinite scroll feeds) ──
    pagination: {
      size: 10,                 // items per page
      total_records: 1000,      // total available records
      next_cursor: "abc123xyz", // pass as ?after_cursor= in next request (null if end)
      prev_cursor: "xyz321abc", // for backward navigation (null if start)
      has_next_page: true,
      has_prev_page: false,
      // ── Offset-based (alternative, use one OR the other per endpoint) ──
      // current_page: 2,
      // total_pages: 100,
      // offset: 10,
    },
    feeds: [
      {
        id: uuid(),
        post_type: "original",        // "original" | "repost" | "quote_post" | "reply"
        visibility: "public",         // "public" | "friends" | "private"
        content: "what a beautiful day !!",
        hashtags: ["#nature", "#mood"],
        mentions: [{ profile_id: uuid(), profile_name: "john_doe" }],
        media_content: [
          {
            type: "image",            // "image" | "video" | "gif" | "audio" | "document"
            url: "https://cdn.example.com/photo.jpg",
            thumbnail_url: "https://cdn.example.com/photo_thumb.jpg",
            alt_text: "Sunrise over mountains",
            width: 1280,
            height: 720,
            duration_ms: null,        // for video/audio (ms), null for images
          },
        ],

        // Author embedded (denormalized for display — avoids a separate fetch)
        author: {
          profile_id: uuid(),
          profile_name: "jane_doe",
          display_name: "Jane Doe",
          image_url: "https://cdn.example.com/avatar.jpg",
          is_verified: true,
        },

        // Engagement counts (cheap integers, always returned)
        engagement: {
          reactions_count: 240,
          comments_count: 18,
          reposts_count: 5,
          quote_posts_count: 2,
          bookmarks_count: 30,
          views_count: 4500,
        },

        // Reactions breakdown (top reactions shown)
        reactions: {
          total: 240,
          breakdown: [
            { type: "like", emoji: "👍", count: 180 },
            { type: "love", emoji: "❤️", count: 40 },
            { type: "haha", emoji: "😂", count: 12 },
            { type: "wow", emoji: "😮", count: 5 },
            { type: "sad", emoji: "😢", count: 2 },
            { type: "angry", emoji: "😠", count: 1 },
          ],
        },

        // Viewer-specific state (changes per authenticated user)
        viewer_context: {
          is_reacted: true,
          viewer_reaction: "like",    // the specific reaction the viewer chose
          is_bookmarked: false,
          is_reposted: false,
          is_following_author: true,
          is_own_post: false,
        },

        // Top 2 comments preview (full list via GET /v1/feeds/:id/comments)
        top_comments: [
          {
            id: uuid(),
            author: {
              profile_id: uuid(),
              profile_name: "john_doe",
              image_url: "https://cdn.example.com/john.jpg",
              is_verified: false,
            },
            content: "Not so soon! 😄",
            reactions: { total: 5, breakdown: [] },
            comments_count: 1,          // nested replies count
            created_at: "2026-03-06T08:00:00Z",
          },
        ],

        // Repost context (populated only when post_type === "repost" or "quote_post")
        repost_of: null,               // { id, author, content, created_at } or null

        created_at: "2026-03-06T07:45:00Z",
        updated_at: "2026-03-06T07:50:00Z",
      },
    ],
  },
};

// ─────────────────────────────────────────────
// ERROR RESPONSE SHAPE
// ─────────────────────────────────────────────
const errorResponse = {
  status: "error",
  message: "Feed not found",
  error_code: "FEED_NOT_FOUND",      // machine-readable code for client handling
  details: [],                        // optional field-level validation errors
};
