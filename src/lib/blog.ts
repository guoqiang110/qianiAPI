import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

export type Author = {
  name: string;
  jobTitle: string;
};

export type Article = {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  date: string;
  author: Author;
  ogImage: string;
  related: string[];
  /** Raw markdown body (without frontmatter). */
  content: string;
};

export type FaqItem = {
  q: string;
  a: string;
};

/** Lightweight projection safe to pass from a Server Component to a Client Component. */
export type ArticleLite = Pick<
  Article,
  "slug" | "title" | "description" | "keywords" | "date" | "author"
>;

export function toLite(a: Article): ArticleLite {
  return {
    slug: a.slug,
    title: a.title,
    description: a.description,
    keywords: a.keywords,
    date: a.date,
    author: a.author,
  };
}

const BLOG_DIR = path.join(process.cwd(), "src", "content", "blog");

/** Listing order — pillar first, then spokes, then tutorials. */
const ORDER = [
  "what-is-geo",
  "geo-doubao-7-steps",
  "geo-platform-checklist",
  "deepseek-api-codex-claude-code",
  "qianxi-vs-siliconflow",
];

function readArticleFile(slug: string): Article | null {
  const file = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: String(data.title ?? slug),
    description: String(data.description ?? ""),
    keywords: Array.isArray(data.keywords) ? data.keywords.map(String) : [],
    date: String(data.date ?? ""),
    author: {
      name: String(data.author?.name ?? "郭强"),
      jobTitle: String(data.author?.jobTitle ?? "乾羲API 平台架构师"),
    },
    ogImage: String(data.ogImage ?? "/images/global/desc_zh.png"),
    related: Array.isArray(data.related) ? data.related.map(String) : [],
    content,
  };
}

/** All articles, sorted by the strategic ORDER (unknown slugs appended). */
export function getAllArticles(): Article[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  const slugs = fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));

  return slugs
    .map(readArticleFile)
    .filter((a): a is Article => a !== null)
    .sort((a, b) => {
      const ia = ORDER.indexOf(a.slug);
      const ib = ORDER.indexOf(b.slug);
      return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
    });
}

export function getArticleBySlug(slug: string): Article | null {
  return readArticleFile(slug);
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

/**
 * Render article markdown to an HTML string for SSR.
 *
 * We use a string-based renderer (marked) instead of a React-markdown component
 * so the full article body is present in the SERVER-RENDERED HTML (real <p>/<h2>
 * tags in the static DOM), not only in the RSC flight payload. This is required
 * for crawlers that do not execute JS (e.g. Baidu) to index the content.
 */
export function renderMarkdownToHtml(markdown: string): string {
  const html = marked.parse(markdown, {
    async: false,
    gfm: true,
    breaks: false,
  }) as string;

  // Add slug ids to headings for deep-link / scroll-margin anchor targets.
  const withIds = html.replace(
    /<h([1-6])>([\s\S]*?)<\/h\1>/g,
    (_m, level: string, inner: string) => {
      const text = inner.replace(/<[^>]+>/g, "");
      return `<h${level} id="${slugify(text)}">${inner}</h${level}>`;
    }
  );

  // External links open in a new tab (same-origin links stay in context).
  const withLinks = withIds.replace(
    /<a href="(https?:\/\/[^"]+)"/g,
    (m, url: string) =>
      url.includes("qianxi-api.com")
        ? m
        : `<a href="${url}" target="_blank" rel="noopener noreferrer"`
  );

  return withLinks;
}

function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\w一-龥]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Extract FAQ Q/A pairs from the visible markdown body.
 * Matches the draft convention: **Q：...** followed by A：...
 * Used to build the FAQPage JSON-LD (kept in sync with visible content).
 */
export function extractFaq(markdown: string): FaqItem[] {
  const faq: FaqItem[] = [];
  const re =
    /\*\*Q[：:]\s*([^*]+?)\*\*\s*\n\s*A[：:]\s*([\s\S]*?)(?=\n\s*\*\*Q[：:]|\n\s*##\s|\n\s*---|\Z)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(markdown)) !== null) {
    const q = m[1].trim();
    const a = m[2]
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // links -> text
      .replace(/\*\*/g, "") // bold markers
      .replace(/\s+/g, " ")
      .trim();
    if (q && a) faq.push({ q, a });
  }
  return faq;
}
