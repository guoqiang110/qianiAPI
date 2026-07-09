"use client";

import { AlertTriangle, CheckCircle2, Info, Shield, BarChart3 } from "lucide-react";

const findings = {
  fixed: [
    "12 API SEO landing pages — 已整合到统一前端",
    "模型卡片链接指向 — 已修复，模型广场已动态化",
    "sitemap.xml 品牌名 — 当前使用 Next.js 动态 sitemap",
    "文档页内容单薄 — 已扩充为 8 个完整指南章节",
    "图片工具页内容 — 已重构为 4 工具蓝金系卡片",
    "控制台后退问题 — 已修复，添加返回导航条",
  ],
  improved: [
    "Schema.org JSON-LD — 7/9 已部署 Organization + WebSite 双实体",
    "About/Security 页面 — 文档页包含接入说明，安全信息在控制台",
    "VID/AUD/DOC 分类 0 模型 — 已精简为 3 分类（生图/图片处理/LLM）",
    "GitHub 仓库 — 已设为首选 https://github.com/guoqiang110/qianiAPI",
    "品牌 Logo — 已统一，JSON-LD 中已引用",
  ],
  ongoing: [
    "客户案例、媒体报道 — 待积累后补充",
    "百度百科 — 待品牌知名度提升后申请",
    "Nano Banana/Midjourney 接入 — 暂缓，先稳固国产生图链路",
    "模型订制后台化 — 第二期规划中",
    "生图板块独立窗口/应用 — 第二期规划中",
  ],
};

export default function AuditPage() {
  return (
    <div className="flex-1">
      <section className="border-b border-sky-100 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.14),_transparent_30%),linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(239,246,255,0.90))]">
        <div className="mx-auto max-w-5xl px-6 py-14 lg:py-18">
          <div className="flex items-center gap-3 mb-3">
            <BarChart3 className="h-5 w-5 text-sky-600" />
            <span className="inline-flex rounded-full border border-sky-200 bg-white/85 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.24em] text-sky-700">GEO AUDIT · 2026-07-09</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 lg:text-5xl">乾羲 GEO 诊断</h1>
          <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-600">qianxi-api.com 生成式引擎优化诊断报告。7/9 完成 JSON-LD 结构化数据、多语言 sitemap、robots.txt 部署。</p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6 py-10 space-y-5">
        {/* 分数卡片 */}
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { dim: "可索引性", score: "良好", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
            { dim: "品牌实体", score: "中等", cls: "bg-amber-50 text-amber-700 border-amber-200" },
            { dim: "结构化数据", score: "已有", cls: "bg-sky-50 text-sky-700 border-sky-200" },
          ].map(({ dim, score, cls }) => (
            <div key={dim} className={`rounded-[20px] border p-5 text-center ${cls}`}>
              <div className="text-[11px] font-extrabold uppercase tracking-[0.14em] opacity-70 mb-2">{dim}</div>
              <div className="text-2xl font-extrabold">{score}</div>
            </div>
          ))}
        </div>

        {/* 已修复 */}
        <div className="rounded-[22px] border border-emerald-200 bg-emerald-50/50 p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <h2 className="text-lg font-extrabold text-emerald-800">已修复（6 项）</h2>
          </div>
          <ul className="space-y-2">
            {findings.fixed.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-emerald-800"><span className="font-bold mt-1 shrink-0">✓</span>{f}</li>
            ))}
          </ul>
        </div>

        {/* 已改善 */}
        <div className="rounded-[22px] border border-sky-200 bg-sky-50/50 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Info className="h-5 w-5 text-sky-600" />
            <h2 className="text-lg font-extrabold text-sky-800">已改善（5 项）</h2>
          </div>
          <ul className="space-y-2">
            {findings.improved.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-sky-800"><span className="font-bold mt-1 shrink-0">→</span>{f}</li>
            ))}
          </ul>
        </div>

        {/* 持续进行 */}
        <div className="rounded-[22px] border border-amber-200 bg-amber-50/50 p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <h2 className="text-lg font-extrabold text-amber-800">持续进行（5 项）</h2>
          </div>
          <ul className="space-y-2">
            {findings.ongoing.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-amber-800"><span className="font-bold mt-1 shrink-0">○</span>{f}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-[22px] border border-slate-200/80 bg-white p-6 text-center">
          <Shield className="h-5 w-5 text-slate-400 mx-auto mb-2" />
          <p className="text-sm text-slate-500">当前得分：P0 100% · P1 90% · 综合良好。7/9 部署 JSON-LD + 多语言 sitemap + robots.txt。</p>
        </div>
      </div>
    </div>
  );
}
