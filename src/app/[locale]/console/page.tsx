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
      {/* thin shell bar — only back + logo */}
      <header className="flex items-center justify-between h-11 px-5 shrink-0 border-b border-slate-200/80 bg-[linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(248,250,252,0.96))] backdrop-blur">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold text-slate-500 transition-colors hover:bg-sky-50 hover:text-sky-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          返回乾羲首页
        </Link>

        <AppLogo className="h-6 w-auto" />

        <span className="w-[72px] text-right text-[11px] font-semibold text-slate-400">
          控制台
        </span>
      </header>

      {/* console workspace */}
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

