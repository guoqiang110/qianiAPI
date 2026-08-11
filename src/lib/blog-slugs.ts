// Known blog article slugs.
//
// This list is consumed by `src/middleware.ts`, which runs on the Edge runtime
// (no filesystem access) and therefore cannot read `src/content/blog/*.md`.
// It MUST be kept in sync with the markdown files: add a slug here whenever a
// new article is published so that the middleware can return a real 404 for
// unknown blog detail URLs (instead of a soft-404 that hurts SEO).
//
// The page-level code (`src/lib/blog.ts`) still reads the filesystem at runtime
// for rendering; this constant is only for route validation at the edge.
export const BLOG_SLUGS = [
  "what-is-geo",
  "geo-doubao-7-steps",
  "geo-platform-checklist",
  "deepseek-api-codex-claude-code",
  "qianxi-vs-siliconflow",
] as const;

export type BlogSlug = (typeof BLOG_SLUGS)[number];
