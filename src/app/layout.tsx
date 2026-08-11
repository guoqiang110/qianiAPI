import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/styles/globals.css";
import { env } from "@/env";

export const metadata: Metadata = {
  metadataBase: new URL("https://qianxi-api.com"),
};

/**
 * Root layout (static). Provides <html>/<body> for the WHOLE app.
 *
 * The previous single root was `app/[locale]/layout.tsx`, which called
 * `cookies()` (theme) + `getMessages()` and forced the ENTIRE [locale] subtree
 * (including the blog) into dynamic, JS-streamed rendering — so crawlers like
 * Baidu saw only an empty Suspense shell. Now the blog lives under this static
 * root (via `app/blog/*`), so its article HTML + JSON-LD are emitted into the
 * initial static HTML. The [locale] subtree keeps its own dynamic behavior.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <meta
          name="baidu-site-verification"
          content="codeva-njEJG6OjKw"
        />
        {/* Site-wide structured data (migrated from the old [locale] root) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "乾羲API",
              alternateName: "Qianxi API",
              url: "https://qianxi-api.com",
              description: "一套 API Key 调用全部 AI 模型",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://qianxi-api.com/zh/studio?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "乾羲API",
              url: "https://qianxi-api.com",
              logo: "https://qianxi-api.com/logo.png",
              sameAs: ["https://github.com/guoqiang110/qianiAPI"],
            }),
          }}
        />
        {/* Performance Analysis Tool (dev only) */}
        {env.NODE_ENV === "development" && (
          <script
            src="https://unpkg.com/react-scan/dist/auto.global.js"
            async
          ></script>
        )}
      </head>
      <body className="flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
