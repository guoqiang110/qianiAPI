"use client";

import { ArrowRight, BookOpen, Search, BarChart3, FileText, ExternalLink, Globe, Zap } from "lucide-react";

const tools = [
  {
    id: "prompts", name: "Yao Open Prompts", icon: BookOpen,
    desc: "200+ AI提示词库，覆盖内容创作、GEO、营销、设计、开发等场景。按类别检索，一键复制使用。",
    href: "/tools/yao-open-prompts/", badge: "提示词库", color: "from-sky-500 to-blue-600",
  },
  {
    id: "geo", name: "Yao GEO Skills", icon: Search,
    desc: "生成式引擎优化全流程工具：站点审计、知识库构建、内容精炼、标题优化、排名追踪。",
    href: "/tools/yao-geo-skills/", badge: "GEO 全流程", color: "from-emerald-500 to-teal-600",
  },
  {
    id: "audit", name: "乾羲 GEO 审计", icon: BarChart3,
    desc: "针对 qianxi-api.com 的完整 GEO 诊断报告。识别关键问题，提供可操作的修复方案。",
    href: "/zh/tools/audit", badge: "站点审计", color: "from-amber-500 to-orange-600",
  },
];

export default function ToolsPage() {
  return (
    <div className="flex-1">
      <section className="border-b border-sky-100 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.14),_transparent_30%),linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(239,246,255,0.90))]">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:py-18">
          <div className="flex items-center gap-3 mb-3">
            <Globe className="h-5 w-5 text-sky-600" />
            <span className="inline-flex rounded-full border border-sky-200 bg-white/85 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.24em] text-sky-700">SEO / GEO TOOLS</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 lg:text-5xl">SEO & GEO 工具集</h1>
          <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-600">
            基于 Yao 社区开源工具，为乾羲用户提供完整的搜索引擎优化与生成式引擎优化能力。
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-10 space-y-10">
        {/* 工具卡片 */}
        <div className="grid gap-5 md:grid-cols-3">
          {tools.map((tool) => (
            <a key={tool.id} href={tool.href} className="group relative overflow-hidden rounded-[20px] border border-slate-200/80 bg-white p-6 no-underline transition hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg hover:shadow-sky-50">
              <div className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${tool.color} px-3 py-1 text-[10px] font-extrabold tracking-[0.1em] text-white mb-4`}>
                <tool.icon className="h-3 w-3" />
                {tool.badge}
              </div>
              <h3 className="text-lg font-extrabold text-slate-950 mb-2">{tool.name}</h3>
              <p className="text-sm text-slate-500 leading-6 mb-4">{tool.desc}</p>
              <span className="inline-flex items-center gap-1 text-sm font-bold text-sky-600 group-hover:underline group-hover:text-sky-700 transition">
                打开工具 <ExternalLink className="h-3.5 w-3.5" />
              </span>
            </a>
          ))}
        </div>

        {/* 功能能力 */}
        <div>
          <h2 className="text-xl font-extrabold text-slate-950 mb-5 flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500" />能力覆盖
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { icon: BookOpen, title: "提示词库", desc: "200+ 社区提示词，按内容创作、GEO、营销、AI 生图、学习等分类。" },
              { icon: Search, title: "GEO 全流程", desc: "审计 → 知识库构建 → 内容精炼 → 标题优化 → 排名追踪，端到端。" },
              { icon: BarChart3, title: "站点诊断", desc: "按维度打分，识别关键问题，提供优先级排序的修复行动项。" },
            ].map((f, i) => (
              <div key={i} className="rounded-[20px] border border-slate-200/80 bg-[linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(248,250,252,0.98))] p-5">
                <f.icon className="h-5 w-5 text-sky-600 mb-3" />
                <h3 className="font-extrabold text-slate-950 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-6">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 关于说明 */}
        <div className="rounded-[20px] border border-slate-200/80 bg-[linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(248,250,252,0.98))] p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-4 w-4 text-sky-600" />
            <h2 className="text-lg font-extrabold text-slate-950">关于这些工具</h2>
          </div>
          <p className="text-sm text-slate-600 leading-7">
            这些是社区维护的开源工具，来自 <a href="https://github.com/yaojingang" target="_blank" rel="noopener noreferrer" className="font-bold text-sky-600 hover:underline">github.com/yaojingang</a>。
            提示词库收录 200+ 条 AI 内容创作与营销提示词。GEO Skills 提供生成式引擎优化的完整流水线支持。
            两套工具以静态页面形式部署在乾羲生态中，供全体用户免费使用。
          </p>
        </div>
      </div>
    </div>
  );
}
