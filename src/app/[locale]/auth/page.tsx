"use client";

import { useTranslations } from "next-intl";
import { Key } from "lucide-react";
import SignInForm from "@/components/forms/auth";
import AppLogo from "@/components/global/app-logo";

export default function AuthPage() {
  const t = useTranslations();

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.12),_transparent_40%),linear-gradient(180deg,_rgba(248,250,252,0.98),_rgba(239,246,255,0.80))]">
      <div className="flex flex-col items-center gap-5 w-full max-w-sm">
        {/* logo + badge */}
        <div className="flex flex-col items-center gap-3">
          <AppLogo className="h-auto w-auto" />
          <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-white/85 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-sky-600">
            <Key className="h-3 w-3" />
            API 登录
          </span>
        </div>

        {/* card */}
        <div className="w-full rounded-[24px] border border-slate-200/80 bg-[linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(248,250,252,0.96))] p-6 shadow-[0_16px_48px_rgba(15,23,42,0.06)]">
          <SignInForm />
        </div>

        {/* footer */}
        <p className="text-xs text-slate-400 text-center leading-6">
          还没有 API Key？{" "}
          <a
            href="/zh/console"
            className="text-sky-600 font-bold hover:underline"
          >
            控制台获取
          </a>
          <span className="mx-2 text-slate-300">|</span>
          <a
            href="/zh/docs"
            className="text-slate-500 hover:text-sky-600 transition"
          >
            接入文档
          </a>
        </p>
      </div>
    </div>
  );
}
