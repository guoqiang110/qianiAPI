"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import AppLogo from "@/components/global/app-logo";
import { ArrowLeft } from "lucide-react";

export default function ConsolePage() {
  const params = useParams();
  const locale = typeof params?.locale === "string" ? params.locale : "zh";

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <header className="flex items-center justify-between h-14 px-5 shrink-0 border-b border-slate-200/80 bg-[linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(248,250,252,0.96))] backdrop-blur">
        <div className="flex items-center gap-4">
          <AppLogo className="h-auto w-auto" />
          <span className="hidden sm:inline-flex rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-500">
            控制台
          </span>
        </div>

        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-500 transition-colors hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          返回首页
        </Link>
      </header>

      <div className="flex-1 bg-slate-100">
        <iframe
          src="/api-console/"
          className="h-full w-full border-0"
          title="乾羲API 控制台"
          allow="clipboard-write"
        />
      </div>
    </div>
  );
}
