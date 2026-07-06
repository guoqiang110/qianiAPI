"use client";
import { usePathname } from "next/navigation";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { isAuthPath } from "@/utils/path";
import AppLogo from "@/components/global/app-logo";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeSwitcher } from "./theme-switcher";

const NAV_LINKS = [
  { href: "/zh/models", label: "模型广场" },
  { href: "/zh/pricing", label: "定价" },
  { href: "/zh/studio", label: "在线生图" },
  { href: "/zh/docs", label: "文档" },{ href: "/zh/agent", label: "代理商" },
];

type HeaderProps = { className?: string };

const Header = forwardRef<HTMLDivElement, HeaderProps>(({ className }, ref) => {
  const pathname = usePathname();
  if (isAuthPath(pathname)) return null;

  return (
    <header className={cn("sticky top-0 z-50 border-b bg-background/95 backdrop-blur", className)} ref={ref}>
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <AppLogo />
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                pathname.startsWith(link.href)
                  ? "bg-accent/10 text-accent"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/5"
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <a href="/console" className="text-sm font-medium text-muted-foreground hover:text-foreground px-3 py-1.5">控制台</a>
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
});

Header.displayName = "AppHeader";

export default Header;

