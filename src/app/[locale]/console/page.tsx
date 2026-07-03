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
      <header className="flex items-center justify-between h-12 px-4 border-b bg-background shrink-0">
        <Link href={`/${locale}`} className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          返回乾羲首页
        </Link>
        <AppLogo className="h-6 w-auto" />
        <div className="w-24" />
      </header>

      <iframe
        src="/api-console/"
        className="flex-1 w-full border-0"
        title="乾羲API 控制台"
        allow="clipboard-write"
      />
    </div>
  );
}