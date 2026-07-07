"use client";
import { usePathname } from "next/navigation";
import { forwardRef, useState } from "react";
import { cn } from "@/lib/utils";
import { isAuthPath } from "@/utils/path";
import AppLogo from "@/components/global/app-logo";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeSwitcher } from "./theme-switcher";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/zh/models", label: "模型广场" },
  { href: "/zh/pricing", label: "定价" },
  { href: "/zh/studio", label: "在线生图" },
  { href: "/zh/docs", label: "文档" },
  { href: "/zh/tools", label: "SEO 工具" },
  { href: "/zh/agent", label: "代理商" },
];

type HeaderProps = { className?: string };

const Header = forwardRef<HTMLDivElement, HeaderProps>(({ className }, ref) => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  if (isAuthPath(pathname)) return null;

  return (
    <header className={cn("sticky top-0 z-50 border-b bg-background/95 backdrop-blur", className)} ref={ref}>
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <AppLogo />

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className={cn(
              "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
              pathname.startsWith(link.href) ? "bg-accent/10 text-accent" : "text-muted-foreground hover:text-foreground hover:bg-accent/5"
            )}>{link.label}</a>
          ))}
        </nav>

        {/* Desktop right */}
        <div className="hidden md:flex items-center gap-1">
          <a href="/console" className="text-sm font-medium text-muted-foreground hover:text-foreground px-3 py-1.5">控制台</a>
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-md text-slate-600 hover:bg-slate-100 transition" aria-label="菜单">
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-white/98 backdrop-blur">
          <div className="px-6 py-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className={cn(
                "block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                pathname.startsWith(link.href) ? "bg-sky-50 text-sky-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
              )}>{link.label}</a>
            ))}
            <div className="border-t border-slate-100 pt-2 mt-2 flex items-center justify-between">
              <a href="/console" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-sky-600 hover:bg-sky-50 transition">控制台</a>
              <div className="flex items-center gap-1">
                <LanguageSwitcher />
                <ThemeSwitcher />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
});

Header.displayName = "AppHeader";
export default Header;
