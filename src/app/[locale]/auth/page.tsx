"use client";

import { useTranslations } from "next-intl";
import SignInForm from "@/components/forms/auth";
import AppLogo from "@/components/global/app-logo";

export default function AuthPage() {
  const t = useTranslations();

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-16">
      <div className="flex flex-col items-center gap-6 max-w-sm w-full">
        <AppLogo className="h-10 w-auto" />
        <div className="text-center">
          <h1 className="text-2xl font-extrabold tracking-tight mb-2">
            {t("auth.title")}
          </h1>
          <p className="text-muted-foreground text-sm">
            {t("auth.description")}
          </p>
        </div>
        <SignInForm />
        <p className="text-xs text-muted-foreground text-center">
          还没有 API Key？
          {" "}
          <a
            href="https://qianxi-api.com/console"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-bold hover:underline"
          >
            前往控制台获取
          </a>
        </p>
      </div>
    </div>
  );
}