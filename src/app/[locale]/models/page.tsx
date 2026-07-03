"use client";

import { useState } from "react";
import AppLogo from "@/components/global/app-logo";

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

// ── Categories ──
const CATEGORIES = [
  { id:"image-generation", name:"图片生成", icon:"🖼", toolUrl:"/zh/studio", toolLabel:"在线生图" },
  { id:"image-processing", name:"图片处理", icon:"✂", toolUrl:"/zh/image-tools", toolLabel:"图片处理" },
  { id:"llm-chat", name:"语言大模型", icon:"💬", toolUrl:"/zh/playground", toolLabel:"LLM 游乐场" },
  { id:"video-generation", name:"视频生成", icon:"🎬", toolUrl:"/zh/models", toolLabel:"规划中" },
];

const badgeColor = (s: string) => {
  if (s.includes("稳定")||s.includes("推荐")) return "bg-emerald-50 text-emerald-700";
  if (s.includes("MVP")||s.includes("可用")) return "bg-blue-50 text-blue-700";
  if (s.includes("候选")||s.includes("待")) return "bg-amber-50 text-amber-700";
  return "bg-secondary text-secondary-foreground";
};

export default function ModelsPage() {
  const [activeCat, setActiveCat] = useState("image-generation");

  const models = Object.entries(MODEL_DATA)
    .map(([id, m]) => ({ id, ...m }))
    .filter(m => m.category === activeCat);

  const cat = CATEGORIES.find(c => c.id === activeCat);

  return (
    <div className="flex-1 max-w-7xl mx-auto px-6 py-10">
      <div className="flex items-center gap-2 mb-2">
        <span className="px-3 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-extrabold uppercase tracking-wider">QIANXI API MODELS</span>
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight mb-2">模型广场</h1>
      <p className="text-muted-foreground text-lg mb-8">覆盖图片生成、图片处理、语言模型等品类，通过统一 API 网关接入。</p>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map(c => (
          <button
            key={c.id}
            onClick={() => setActiveCat(c.id)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
              activeCat === c.id
                ? "bg-primary text-primary-foreground"
                : "border border-border/70 bg-background text-muted-foreground hover:border-primary/60 hover:bg-primary/5"
            }`}
          >
            <span>{c.icon}</span>
            {c.name}
          </button>
        ))}
      </div>

      {/* Category info */}
      {cat && (
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            {models.length} 个模型
            {cat.toolUrl && (
              <a href={cat.toolUrl} className="ml-3 text-primary font-bold text-sm no-underline hover:underline">
                {cat.toolLabel} →
              </a>
            )}
          </p>
        </div>
      )}

      {/* Model cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {models.map(m => (
          <div key={m.id} className="rounded-xl border border-border/70 bg-card/90 p-5 flex flex-col gap-3 shadow-sm transition-colors hover:border-primary/60 hover:bg-primary/5">
            <div className="flex justify-between items-start gap-2">
              <strong className="text-base">{m.name}</strong>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className={`text-[10px] px-2 py-0.5 rounded font-extrabold ${badgeColor(m.badge)}`}>{m.badge}</span>
                {m.price !== undefined && (
                  <span className="text-xs font-bold text-primary">¥{m.price.toFixed(2)}/次</span>
                )}
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{m.summary}</p>
            <div className="mt-auto pt-2 border-t text-xs text-muted-foreground">{m.provider}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
