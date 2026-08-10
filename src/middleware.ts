import { type NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { GLOBAL } from "./constants";
import { routing } from "./i18n/routing";
import { normalizeLanguageCode } from "./utils/language";
import { BLOG_SLUGS } from "./lib/blog-slugs";

const handleI18nRouting = createMiddleware(routing);

/**
 * Guard the /<locale>/blog routes.
 *
 * Blog content is zh-only and only the slugs listed in BLOG_SLUGS exist. Any
 * other blog URL must return a real HTTP 404 — NOT a soft-404 (200 + empty
 * streamed shell), which would be penalized by Baidu. This runs at the edge
 * before the dynamic layout starts streaming, so the status code is correct.
 */
function guardBlogRoute(pathname: string): NextResponse | null {
  const match = pathname.match(/^\/([a-z]+)\/blog(?:\/([^/]+))?\/?$/);
  if (!match) return null;

  const locale = match[1];
  const slug = match[2];

  const localeOk = GLOBAL.LOCALE.SUPPORTED.includes(
    locale as (typeof GLOBAL.LOCALE.SUPPORTED)[number]
  );
  const isZh = locale === "zh";
  const slugOk = !slug || (BLOG_SLUGS as readonly string[]).includes(slug);

  if (!localeOk || !isZh || !slugOk) {
    return new NextResponse("404 Not Found", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
  return null;
}

// Handle URL lang parameter redirection
function handleLangParam(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const langParam = searchParams.get("lang");

  if (!langParam) {
    return null;
  }

  const normalizedLang = normalizeLanguageCode(langParam);
  if (!GLOBAL.LOCALE.SUPPORTED.includes(normalizedLang)) {
    return null;
  }

  const newUrl = new URL(request.url);
  searchParams.delete("lang");

  let newPathname = pathname;
  if (pathname === "/") {
    newPathname = `/${normalizedLang}`;
  } else if (!pathname.startsWith(`/${normalizedLang}`)) {
    const localeRegex = new RegExp(`^/(${GLOBAL.LOCALE.SUPPORTED.join("|")})`);
    if (localeRegex.test(pathname)) {
      newPathname = pathname.replace(localeRegex, `/${normalizedLang}`);
    } else {
      newPathname = `/${normalizedLang}${pathname}`;
    }
  }

  newUrl.pathname = newPathname;
  newUrl.search = searchParams.toString();
  return NextResponse.redirect(newUrl);
}

export default function middleware(request: NextRequest) {
  // First handle lang parameter if present
  const langRedirect = handleLangParam(request);
  if (langRedirect) return langRedirect;

  // Guard blog routes: return a real 404 for unknown/unsupported blog URLs
  // before the dynamic layout begins streaming (otherwise we'd emit a soft-404).
  const blogGuard = guardBlogRoute(request.nextUrl.pathname);
  if (blogGuard) return blogGuard;

  // Then handle regular i18n routing
  const shouldHandle =
    request.nextUrl.pathname === "/" ||
    new RegExp(`^/(${GLOBAL.LOCALE.SUPPORTED.join("|")})(/.*)?$`).test(
      request.nextUrl.pathname
    );

  if (!shouldHandle) return;

  return handleI18nRouting(request);
}
