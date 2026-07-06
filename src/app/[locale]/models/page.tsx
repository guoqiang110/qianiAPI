"use client";

import { useState } from "react";

// ── Model data ──
const MODEL_DATA: Record<string, {
  name: string; provider: string; badge: string;
  summary: string; price?: number; category: string;
}> = {
  "gpt-image-2": { name:"GPT Image 2", provider:"OpenAI", badge:"稳定推荐", summary:"已验证稳定，适合广告图、电商主图、海报和高质量视觉草案。", price:0.5, category:"image-generation" },
  "gemini-2.5-flash-image": { name:"Nano Banana / Gemini 2.5 Flash", provider:"Google", badge:"需 Key", summary:"低成本快速改图和角色一致性。需配置 Google AI Studio API Key。", price:0.35, category:"image-generation" },
  "gemini-3.1-flash-image-preview": { name:"Nano Banana 2", provider:"Google", badge:"候选", summary:"更快的草案迭代和批量变体。", price:0.5, category:"image-generation" },
  "gemini-3-pro-image-preview": { name:"Nano Banana Pro", provider:"Google", badge:"候选", summary:"复杂图文、海报、信息图。", price:0.8, category:"image-generation" },
  "doubao-seedream-4-0-250828": { name:"Seedream 4.0", provider:"火山方舟/字节", badge:"稳定可用", summary:"适合中文商业图、电商图、海报草案。", price:0.6, category:"image-generation" },
  "doubao-seedream-3-0-t2i-250415": { name:"Seedream 3.0", provider:"火山方舟/字节", badge:"账号未开通", summary:"保留路由，待账号开通。", category:"image-generation" },
  "wanx2.1-t2i-turbo": { name:"通义万相 2.1 Turbo", provider:"阿里云百炼", badge:"稳定可用", summary:"低成本中文文生图，电商配图和快速草案。", price:0.25, category:"image-generation" },
  "wanx2.1-t2i-plus": { name:"通义万相 2.1 Plus", provider:"阿里云百炼", badge:"稳定可用", summary:"高质量中文商业图、产品海报和品牌视觉。", price:0.6, category:"image-generation" },
  "wanx2.1-imageedit": { name:"通义万相图生图", provider:"阿里云百炼", badge:"MVP", summary:"上传参考图后按提示词改图，适合产品图换背景。", price:0.6, category:"image-processing" },
  "cogview-4-250304": { name:"CogView 4", provider:"智谱 AI", badge:"稳定可用", summary:"中文语义理解、创意视觉和海报草案。", price:0.35, category:"image-generation" },
  "cogview-3-flash": { name:"CogView 3 Flash", provider:"智谱 AI", badge:"稳定可用", summary:"快速低成本生图和批量草案。", price:0.15, category:"image-generation" },
  "hy-image-lite": { name:"混元生图 极速版", provider:"腾讯混元", badge:"稳定可用", summary:"秒级响应，适合快速草案和低成本批量生图。", price:0.2, category:"image-generation" },
  "hy-image-v3.0": { name:"混元生图 3.0", provider:"腾讯混元", badge:"稳定可用", summary:"千字语义理解，图文生成、漫画、表情包，国风审美强项。", price:0.35, category:"image-generation" },
  "midjourney": { name:"Midjourney", provider:"Midjourney", badge:"待接入", summary:"风格化海报、概念设计、空间氛围。需 Midjourney API。", price:0.8, category:"image-generation" },
  "gpt-5.5": { name:"GPT-5.5", provider:"OpenAI", badge:"推荐", summary:"OpenAI 最新旗舰，强推理、多模态、长上下文。", category:"llm-chat" },
  "claude-sonnet-4-20250514": { name:"Claude Sonnet 4", provider:"Anthropic", badge:"推荐", summary:"均衡模型，出色的代码生成和长文理解。", category:"llm-chat" },
  "deepseek-v4-flash": { name:"DeepSeek V4 Flash", provider:"DeepSeek", badge:"可用", summary:"国产高性价比，中文优化。", category:"llm-chat" },
  "qwen-max": { name:"通义千问 Max", provider:"阿里云", badge:"可用", summary:"阿里旗舰中文大模型，知识广博。", category:"llm-chat" },
};

const CATEGORIES = [
  { id:"image-generation", name:"图片生成", icon:"🖼", toolUrl:"/zh/studio", toolLabel:"在线生图" },
  { id:"image-processing", name:"图片处理", icon:"✂", toolUrl:"/zh/image-tools", toolLabel:"图片处理" },
  { id:"llm-chat", name:"语言大模型", icon:"💬", toolUrl:"/zh/playground", toolLabel:"LLM 游乐场" },
  { id:"video-generation", name:"视频生成", icon:"🎬", toolUrl:"/zh/models", toolLabel:"规划中" },
];

const badgeColors: Record<string, string> = {
  "稳定推荐": "bg-emerald-50 text-emerald-700 ring-emerald-200/50",
  "稳定可用": "bg-sky-50 text-sky-700 ring-sky-200/50",
  "推荐": "bg-emerald-50 text-emerald-700 ring-emerald-200/50",
  "可用": "bg-sky-50 text-sky-700 ring-sky-200/50",
  "MVP": "bg-blue-50 text-blue-700 ring-blue-200/50",
  "候选": "bg-amber-50 text-amber-700 ring-amber-200/50",
  "需 Key": "bg-amber-50 text-amber-700 ring-amber-200/50",
  "待接入": "bg-slate-100 text-slate-600 ring-slate-200/50",
  "账号未开通": "bg-slate-100 text-slate-500 ring-slate-200/50",
};

const getBadge = (b: string) => badgeColors[b] ?? "bg-slate-100 text-slate-600 ring-slate-200/50";

export default function ModelsPage() {
  const [activeCat, setActiveCat] = useState("image-generation");

  const models = Object.entries(MODEL_DATA)
    .map(([id, m]) => ({ id, ...m }))
    .filter(m => m.category === activeCat);

  const cat = CATEGORIES.find(c => c.id === activeCat);

  return (
    <div className="flex-1">
      {/* hero */}
      <section className="border-b border-sky-100 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.16),_transparent_30%),linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(239,246,255,0.90))]">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-sky-200 bg-white/85 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.24em] text-sky-700">
              QIANXI API MODELS
            </span>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-950 lg:text-5xl">
              模型广场
            </h1>
            <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-600">
              覆盖图片生成、图片处理、语言模型等品类，通过统一 API 网关接入。
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-8 space-y-8">
        {/* category tabs */}
        <div className="flex flex-wrap gap-3">
          {CATEGORIES.map(c => (
            <button
              key={c.id}
              onClick={() => setActiveCat(c.id)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${
                activeCat === c.id
                  ? "bg-slate-950 text-white shadow-[0_14px_32px_rgba(15,23,42,0.20)]"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-sky-200 hover:bg-sky-50 hover:text-slate-950"
              }`}
            >
              <span>{c.icon}</span>
              {c.name}
            </button>
          ))}
        </div>

        {/* category info bar */}
        {cat && (
          <div className="flex flex-col gap-3 rounded-[20px] border border-slate-200/80 bg-[linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(248,250,252,0.98))] p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-slate-400">当前分类</p>
              <div className="mt-1 flex items-center gap-3">
                <strong className="text-xl text-slate-950">{cat.name}</strong>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                  {models.length} 个模型
                </span>
              </div>
            </div>
            {cat.toolUrl && (
              <a
                href={cat.toolUrl}
                className="inline-flex h-10 items-center rounded-xl bg-slate-950 px-4 text-sm font-bold text-white no-underline transition hover:opacity-90"
              >
                {cat.toolLabel} →
              </a>
            )}
          </div>
        )}

        {/* model cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {models.map(m => (
            <div
              key={m.id}
              className="group flex flex-col gap-4 rounded-[22px] border border-slate-200/80 bg-[linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(248,250,252,0.98))] p-5 transition-all hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-[0_20px_48px_rgba(59,130,246,0.10)]"
            >
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                <span>{m.provider}</span>
                <span className="h-2.5 w-2.5 rounded-full bg-sky-400/80 shadow-[0_0_0_5px_rgba(125,211,252,0.16)]" />
              </div>

              <div className="flex items-start justify-between gap-2">
                <strong className="text-lg leading-7 text-slate-950">{m.name}</strong>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ring-1 ${getBadge(m.badge)}`}>
                    {m.badge}
                  </span>
                  {m.price !== undefined && (
                    <span className="rounded-full bg-slate-950 px-2.5 py-0.5 text-[10px] font-bold text-white">
                      ¥{m.price.toFixed(2)}/次
                    </span>
                  )}
                </div>
              </div>

              <p className="text-sm leading-7 text-slate-600">{m.summary}</p>

              <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 text-[11px] font-semibold">
                <span className="text-slate-400">统一接入 · 乾羲网关</span>
                <span className="text-slate-600 transition-colors group-hover:text-sky-700">查看能力</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
