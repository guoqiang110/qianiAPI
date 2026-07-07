"use client";

import { forwardRef } from "react";
import AppLogo from "../app-logo";

const footerLinks = [
  { label: "模型广场", href: "/zh/models" },
  { label: "模型定价", href: "/zh/pricing" },
  { label: "在线生图", href: "/zh/studio" },
  { label: "图片处理", href: "/zh/image-tools" },
  { label: "接入文档", href: "/zh/docs" },
  { label: "SEO 工具", href: "/zh/tools" },
  { label: "更新日志", href: "/zh/changelog" },
  { label: "控制台", href: "/console" },
];

type FooterProps = { className?: string };

const Footer = forwardRef<HTMLDivElement, FooterProps>(({ className }, ref) => {
  return (
    <footer ref={ref} className={className}>
      <div className="border-t border-slate-200 bg-[linear-gradient(180deg,_rgba(248,250,252,0.98),_rgba(255,255,255,0.98))]">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <AppLogo className="h-7 w-auto mb-3" />
              <p className="text-xs text-slate-500 leading-6">AI 模型统一接入网关 · 在线生图工作台</p>
            </div>
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-slate-400 mb-3">产品</p>
              <div className="space-y-2">
                {footerLinks.slice(0, 4).map(l => <div key={l.label}><a href={l.href} className="text-sm text-slate-600 no-underline hover:text-sky-700 transition">{l.label}</a></div>)}
              </div>
            </div>
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-slate-400 mb-3">资源</p>
              <div className="space-y-2">
                {footerLinks.slice(4).map(l => <div key={l.label}><a href={l.href} className="text-sm text-slate-600 no-underline hover:text-sky-700 transition">{l.label}</a></div>)}
              </div>
            </div>
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-slate-400 mb-3">联系</p>
              <p className="text-sm text-slate-600">邮箱：qianxiapi@163.com</p>
              <p className="text-sm text-slate-600 mt-1">官网：qianxi-api.com</p>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400">© 2026 乾羲API · 沪ICP备XXXXXXXX号</p>
          </div>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "AppFooter";
export default Footer;

