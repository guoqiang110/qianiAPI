"use client";

import type { ArticleLite } from "@/lib/blog";

/**
 * Client Component rendering the blog index grid.
 *
 * Under the static root layout (`app/blog` is NOT under the dynamic [locale]
 * tree), this component is pre-rendered to REAL DOM at build time — the
 * article titles, descriptions and links are present in the initial static
 * HTML, visible to crawlers that don't execute JS.
 */
export default function BlogIndex({ articles }: { articles: ArticleLite[] }) {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:py-16">
      <header className="mb-10">
        <p className="text-sm font-semibold text-sky-700">乾羲API 博客</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          AI 模型网关教程 · GEO 实战 · 开发者指南
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
          围绕统一 AI 模型网关的接入实战、生成式引擎优化（GEO）与平台选型，沉淀可落地的技术与增长方法论。
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2">
        {articles.map((a) => (
          <a
            key={a.slug}
            href={`/blog/${a.slug}`}
            className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-sky-300 hover:shadow-[0_18px_40px_rgba(37,99,235,0.10)]"
          >
            <span className="text-xs font-semibold text-sky-700">
              {a.keywords[0] ?? "乾羲API"}
            </span>
            <h2 className="mt-2 text-lg font-bold leading-7 text-slate-900 group-hover:text-sky-700">
              {a.title}
            </h2>
            <p className="mt-2 line-clamp-3 flex-1 text-sm leading-7 text-slate-600">
              {a.description}
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
              <span>{a.date}</span>
              <span aria-hidden>·</span>
              <span>{a.author.name}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
