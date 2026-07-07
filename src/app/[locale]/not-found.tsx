"use client";

import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.10),_transparent_30%),linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(239,246,255,0.90))]">
      <div className="max-w-lg mx-auto px-6 py-20 text-center">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-sky-50 ring-1 ring-sky-200 mb-8">
          <Search className="h-8 w-8 text-sky-500" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 lg:text-5xl">404</h1>
        <p className="mt-3 text-lg leading-8 text-slate-600">页面未找到</p>
        <p className="mt-1 text-sm leading-7 text-slate-500">你访问的页面可能已被移动、删除或从未存在。</p>
        <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
          <Link href="/zh" className="inline-flex h-11 items-center gap-2 rounded-full bg-sky-600 px-6 text-sm font-bold text-white no-underline hover:bg-sky-700 transition">
            <Home className="h-4 w-4" />返回首页
          </Link>
          <Link href="/zh/models" className="inline-flex h-11 items-center gap-2 rounded-full border border-sky-200 bg-white px-6 text-sm font-bold text-sky-700 no-underline hover:border-sky-300 transition">
            模型广场
          </Link>
        </div>
      </div>
    </div>
  );
}
