"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

const STATIC_MODELS: ModelItem[] = [
  { id: "gpt-image-2", name: "GPT Image 2", provider: "OpenAI", badge: "稳定推荐", price: 0.50, category: "image-generation", description: "已验证稳定，适合广告图、电商主图、海报和高质量视觉草案。" },
  { id: "gemini-2.5-flash-image", name: "Nano Banana / Gemini 2.5 Flash", provider: "Google", badge: "需 Key", price: 0.35, category: "image-generation", description: "低成本快速改图和角色一致性。需配置 Google AI Studio API Key。" },
  { id: "gemini-3.1-flash-image-preview", name: "Nano Banana 2", provider: "Google", badge: "候选", price: 0.50, category: "image-generation", description: "更快的草案迭代和批量变体。" },
  { id: "gemini-3-pro-image-preview", name: "Nano Banana Pro", provider: "Google", badge: "候选", price: 0.80, category: "image-generation", description: "复杂图文、海报、信息图。" },
  { id: "doubao-seedream-4-0-250828", name: "Seedream 4.0", provider: "火山方舟/字节", badge: "稳定可用", price: 0.60, category: "image-generation", description: "适合中文商业图、电商图、海报草案。" },
  { id: "doubao-seedream-3-0-t2i-250415", name: "Seedream 3.0", provider: "火山方舟/字节", badge: "账号未开通", category: "image-generation", description: "保留路由，待账号开通。" },
  { id: "wanx2.1-t2i-turbo", name: "通义万相 2.1 Turbo", provider: "阿里云百炼", badge: "稳定可用", price: 0.25, category: "image-generation", description: "低成本中文文生图，电商配图和快速草案。" },
  { id: "wanx2.1-t2i-plus", name: "通义万相 2.1 Plus", provider: "阿里云百炼", badge: "稳定可用", price: 0.60, category: "image-generation", description: "高质量中文商业图、产品海报和品牌视觉。" },
  { id: "wanx2.1-imageedit", name: "通义万相图生图", provider: "阿里云百炼", badge: "MVP", price: 0.60, category: "image-processing", description: "上传参考图后按提示词改图，适合产品图换背景。" },
  { id: "cogview-4-250304", name: "CogView 4", provider: "智谱 AI", badge: "稳定可用", price: 0.35, category: "image-generation", description: "中文语义理解、创意视觉和海报草案。" },
  { id: "cogview-3-flash", name: "CogView 3 Flash", provider: "智谱 AI", badge: "稳定可用", price: 0.15, category: "image-generation", description: "快速低成本生图和批量草案。" },
  { id: "hy-image-lite", name: "混元生图 极速版", provider: "腾讯混元", badge: "稳定可用", price: 0.20, category: "image-generation", description: "秒级响应，适合快速草案和低成本批量生图。" },
  { id: "hy-image-v3.0", name: "混元生图 3.0", provider: "腾讯混元", badge: "稳定可用", price: 0.35, category: "image-generation", description: "千字语义理解，图文生成、漫画、表情包，国风审美强项。" },
  { id: "midjourney", name: "Midjourney", provider: "Midjourney", badge: "待接入", price: 0.80, category: "image-generation", description: "风格化海报、概念设计、空间氛围。需 Midjourney API。" },
];

interface ModelItem {
  id: string; name: string; provider: string; badge: string;
  price?: number; category: string; description?: string;
}

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

function PriceTierCard({ models, title, desc, accent }: { models: ModelItem[]; title: string; desc: string; accent: string }) {
  if (!models.length) return null;
  return (
    <div className={`rounded-[22px] border p-5 ${accent}`}>
      <h3 className="text-base font-extrabold text-slate-950">{title}</h3>
      <p className="text-sm text-slate-500 mt-1 mb-4">{desc}</p>
      <div className="space-y-2">
        {models.map(m => (
          <div key={m.id} className="flex items-center justify-between rounded-xl bg-white/80 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-900">{m.name}</span>
              <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-extrabold ring-1 ${getBadge(m.badge)}`}>{m.badge}</span>
            </div>
            <span className="text-sm font-extrabold text-slate-950">¥{m.price?.toFixed(2) ?? "—"}/次</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PricingPage() {
  const params = useParams();
  const [models, setModels] = useState<ModelItem[]>(STATIC_MODELS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/cn-image/model-config")
      .then(r => r.ok ? r.json() : null)
      .then(cfg => { if (!cancelled && cfg?.models?.length) setModels(cfg.models); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(t);
  }, []);

  const priced = models.filter(m => m.price !== undefined && m.price !== null);
  const unpriced = models.filter(m => m.price === undefined || m.price === null);
  const cheap = priced.filter(m => (m.price ?? 0) <= 0.3).sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
  const mid = priced.filter(m => (m.price ?? 0) > 0.3 && (m.price ?? 0) <= 0.5).sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
  const high = priced.filter(m => (m.price ?? 0) > 0.5).sort((a, b) => (a.price ?? 0) - (b.price ?? 0));

  if (loading) {
    return (
      <div className="flex-1 max-w-7xl mx-auto px-6 py-16">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-48" />
          <div className="h-5 bg-slate-200 rounded w-96" />
          <div className="h-64 bg-slate-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      {/* hero */}
      <section className="border-b border-sky-100 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.16),_transparent_30%),linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(239,246,255,0.90))]">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
          <span className="inline-flex rounded-full border border-sky-200 bg-white/85 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.24em] text-sky-700">PRICING</span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-950 lg:text-5xl">模型定价</h1>
          <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-600">
            透明计费，按量付费。所有价格均为人民币，数据实时同步后台配置。
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-10 space-y-10">
        {/* tier cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <PriceTierCard models={cheap} title="经济型" desc="适合大量试错、草案和批量生成" accent="border-slate-200/80 bg-[linear-gradient(180deg,_rgba(248,250,252,0.98),_rgba(255,255,255,0.98))]" />
          <PriceTierCard models={mid} title="均衡型" desc="日常使用，质量与价格兼顾" accent="border-sky-200/80 bg-[linear-gradient(180deg,_rgba(240,249,255,0.96),_rgba(255,255,255,0.98))]" />
          <PriceTierCard models={high} title="高质量型" desc="商业定稿、品牌海报和成品输出" accent="border-violet-200/80 bg-[linear-gradient(180deg,_rgba(245,243,255,0.96),_rgba(255,255,255,0.98))]" />
        </div>

        {/* full price table */}
        {priced.length > 0 && (
          <div>
            <h2 className="text-xl font-extrabold text-slate-950 mb-4">全部已定价模型</h2>
            <div className="overflow-hidden rounded-[20px] border border-slate-200/80 bg-white">
              <div className="hidden md:grid grid-cols-5 gap-3 bg-slate-50 px-5 py-3 text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-400">
                <div>模型</div><div>供应商</div><div>状态</div><div>单价</div><div>说明</div>
              </div>
              {priced.map(m => (
                <div key={m.id} className="grid grid-cols-1 gap-2 md:grid-cols-5 md:gap-3 px-5 py-3.5 text-sm border-t border-slate-100 items-start md:items-center">
                  <div className="font-extrabold text-slate-950">{m.name}</div>
                  <div className="text-slate-500">{m.provider}</div>
                  <div><span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ring-1 ${getBadge(m.badge)}`}>{m.badge}</span></div>
                  <div className="text-slate-950 font-extrabold text-base">¥{(m.price ?? 0).toFixed(2)}</div>
                  <div className="text-xs text-slate-500">{m.description || ""}</div>
                </div>
              ))}
            </div>
          </div>
        )}

                {/* llm pricing */}
        <div className="rounded-[22px] border border-sky-200/80 bg-[linear-gradient(180deg,_rgba(239,246,255,0.96),_rgba(255,255,255,0.98))] p-6">
          <h2 className="text-lg font-extrabold text-slate-950 mb-2">语言模型定价</h2>
          <p className="text-sm leading-7 text-slate-600 mb-4">大语言模型按 token 计费，以下为参考均价。精确价格请在控制台查看。</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {[
              { name:"GPT-5.5", provider:"OpenAI", input:"¥0.005/K", output:"¥0.015/K" },
              { name:"Claude Sonnet 4", provider:"Anthropic", input:"¥0.003/K", output:"¥0.015/K" },
              { name:"DeepSeek V4 Flash", provider:"DeepSeek", input:"¥0.001/K", output:"¥0.004/K" },
              { name:"通义千问 Max", provider:"阿里云", input:"¥0.005/K", output:"¥0.02/K" },
            ].map(llm => (
              <div key={llm.name} className="rounded-xl bg-white/80 px-4 py-3 flex items-center justify-between gap-2">
                <div>
                  <span className="text-sm font-extrabold text-slate-950">{llm.name}</span>
                  <span className="text-xs text-slate-400 ml-2">{llm.provider}</span>
                </div>
                <div className="text-xs text-right">
                  <span className="text-slate-500">输入 {llm.input}</span>
                  <span className="text-slate-400 mx-1">·</span>
                  <span className="text-slate-500">输出 {llm.output}</span>
                </div>
              </div>
            ))}
          </div>
          <Link href="/zh/console" className="inline-flex h-10 items-center rounded-xl bg-slate-950 px-4 text-sm font-bold text-white no-underline transition hover:opacity-90">控制台查实时价 →</Link>
        </div>

        {/* unpriced */}
        {unpriced.length > 0 && (
          <div>
            <h2 className="text-xl font-extrabold text-slate-950 mb-4">待定价</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {unpriced.map(m => (
                <div key={m.id} className="rounded-[20px] border border-slate-200/80 bg-[linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(248,250,252,0.98))] p-4">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <strong className="text-sm text-slate-900">{m.name}</strong>
                    <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-extrabold ring-1 ${getBadge(m.badge)}`}>{m.badge || "待定"}</span>
                  </div>
                  <p className="text-xs text-slate-400">{m.provider}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


