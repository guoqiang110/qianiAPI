"use client";

import type { ArticleLite } from "@/lib/blog";

export type BlogDetailProps = {
  article: ArticleLite & { html: string; ogImage: string };
  related: ArticleLite[];
};

/**
 * Client Component that renders the blog article body.
 *
 * Why a Client Component: under this project's dynamic (cookies) layout + the
 * [locale]/loading.tsx Suspense boundary, Server Component output is streamed
 * as RSC flight data (invisible to non-JS crawlers). A Client Component is
 * server-rendered to REAL DOM on initial SSR — so Baidu/Google see the full
 * article text in the static HTML. The pre-rendered `html` string is prepared
 * server-side (marked) and passed in as a prop.
 */
export default function BlogDetail({ article, related }: BlogDetailProps) {
  return (
    <>
      <a
        href="/zh/blog"
        className="text-sm text-slate-400 transition hover:text-sky-700"
      >
        ← 返回博客
      </a>

      <article className="mt-4">
        <div className="mb-8 border-b border-slate-200 pb-8">
          <div className="flex flex-wrap gap-2">
            {article.keywords.slice(0, 4).map((k) => (
              <span
                key={k}
                className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700"
              >
                {k}
              </span>
            ))}
          </div>
          <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl">
            {article.title}
          </h1>
          <p className="mt-3 text-sm text-slate-500">
            {article.author.name} · {article.author.jobTitle} · {article.date}
          </p>
        </div>

        <div
          className="prose prose-slate max-w-none prose-headings:scroll-mt-24 prose-pre:bg-slate-950 prose-pre:text-emerald-300 prose-a:text-sky-700 prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: article.html }}
        />

        <div className="mt-10 flex items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sky-600 text-lg font-bold text-white">
            {article.author.name.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-slate-900">{article.author.name}</p>
            <p className="text-sm text-slate-600">
              {article.author.jobTitle}，乾羲API
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              本文基于公开资料与实测整理，具体模型、价格与平台机制会随版本变动，以各官方最新说明为准。
            </p>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold text-slate-900">相关阅读</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {related.map((r) => (
                <a
                  key={r.slug}
                  href={`/zh/blog/${r.slug}`}
                  className="group rounded-xl border border-slate-200 bg-white p-5 transition hover:border-sky-300 hover:shadow-[0_14px_32px_rgba(37,99,235,0.10)]"
                >
                  <h3 className="font-semibold leading-7 text-slate-900 group-hover:text-sky-700">
                    {r.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-600">
                    {r.description}
                  </p>
                </a>
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}
