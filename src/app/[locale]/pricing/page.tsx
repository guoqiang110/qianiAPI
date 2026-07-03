"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

// ── Static fallback model data ──
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
  id: string;
  name: string;
  provider: string;
  badge: string;
  price?: number;
  category: string;
  description?: string;
}

function badgeColor(s: string) {
  if (s.includes("稳定") || s.includes("推荐")) return "bg-emerald-50 text-emerald-700";
  if (s.includes("MVP") || s.includes("可用")) return "bg-blue-50 text-blue-700";
  if (s.includes("候选") || s.includes("待")) return "bg-amber-50 text-amber-700";
  return "bg-secondary text-secondary-foreground";
}

function PriceTierCard({ models, title, desc }: { models: ModelItem[]; title: string; desc: string }) {
  if (!models.length) return null;
  return (
    <div className="rounded-xl border border-border/70 bg-card/90 p-6 shadow-sm">
      <h3 className="text-lg font-extrabold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{desc}</p>
      <div className="space-y-2">
        {models.map((m) => (
          <div key={m.id} className="flex items-center justify-between py-2 border-t border-border/50 first:border-t-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">{m.name}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-extrabold ${badgeColor(m.badge)}`}>{m.badge}</span>
            </div>
            <span className="text-sm font-extrabold text-primary">
              {m.price !== undefined ? `¥${m.price.toFixed(2)}/次` : "待定价"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PricingPage() {
  const params = useParams();
  const locale = typeof params?.locale === "string" ? params.locale : "zh";
  const [models, setModels] = useState<ModelItem[]>(STATIC_MODELS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/cn-image/model-config")
      .then((r) => (r.ok ? r.json() : null))
      .then((cfg) => {
        if (cancelled || !cfg?.models?.length) return;
        setModels(cfg.models);
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(t);
  }, []);

  const priced = models.filter((m) => m.price !== undefined && m.price !== null);
  const unpriced = models.filter((m) => m.price === undefined || m.price === null);

  const cheap = priced.filter((m) => (m.price ?? 0) <= 0.3).sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
  const mid = priced.filter((m) => (m.price ?? 0) > 0.3 && (m.price ?? 0) <= 0.5).sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
  const high = priced.filter((m) => (m.price ?? 0) > 0.5).sort((a, b) => (a.price ?? 0) - (b.price ?? 0));

  const recommendations = [
    { title: "电商主图/海报", note: "高质量成品输出", models: high.slice(0, 3) },
    { title: "快速草案迭代", note: "成本低、速度快", models: cheap.slice(0, 3) },
    { title: "日常运营配图", note: "质量与价格兼顾", models: mid.slice(0, 3) },
  ];

  if (loading) {
    return (
      <div className="flex-1 max-w-7xl mx-auto px-6 py-16">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-48" />
          <div className="h-5 bg-muted rounded w-96" />
          <div className="h-64 bg-muted rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-7xl mx-auto px-6 py-10">
      <div className="flex items-center gap-2 mb-2">
        <span className="px-3 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-extrabold uppercase tracking-wider">PRICING</span>
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight mb-2">模型定价</h1>
      <p className="text-muted-foreground text-lg mb-8 max-w-2xl">
        透明计费，按量付费。所有价格均为人民币，数据实时同步后台配置。
      </p>

      {priced.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-extrabold mb-1">已定价模型</h2>
          <p className="text-sm text-muted-foreground mb-5">以下模型已配置价格，可直接调用。价格单位：人民币/次。</p>
          <div className="border rounded-lg overflow-hidden">
            <div className="hidden md:grid grid-cols-5 gap-3 bg-muted/50 text-xs font-bold text-muted-foreground px-4 py-3">
              <div>模型</div><div>供应商</div><div>状态</div><div>单价</div><div>说明</div>
            </div>
            {priced.map((m) => (
              <div key={m.id} className="grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-3 px-4 py-3 text-sm border-t items-start md:items-center">
                <div className="font-extrabold text-foreground">{m.name}</div>
                <div className="text-muted-foreground">{m.provider}</div>
                <div><span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-bold ${badgeColor(m.badge)}`}>{m.badge}</span></div>
                <div className="text-primary font-extrabold text-base">¥{(m.price ?? 0).toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">{m.description || ""}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <PriceTierCard models={cheap} title="经济型" desc="适合大量试错、草案和批量生成" />
        <PriceTierCard models={mid} title="均衡型" desc="日常使用，质量与价格兼顾" />
        <PriceTierCard models={high} title="高质量型" desc="商业定稿、品牌海报和成品输出" />
      </div>

      <div className="mb-10">
        <h2 className="text-xl font-extrabold mb-4">场景推荐</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map((rec) => (
            <div key={rec.title} className="rounded-xl border border-primary/20 bg-primary/10 p-5 shadow-sm">
              <strong className="text-base block mb-1">{rec.title}</strong>
              <p className="text-sm text-muted-foreground mb-3">{rec.note}</p>
              <div className="flex flex-wrap gap-1.5">
                {rec.models.map((m) => (
                  <span key={m.id} className="rounded-md border border-primary/20 bg-background/90 px-2 py-1 text-xs font-mono text-foreground">{m.name}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-10 rounded-xl border border-primary/15 bg-gradient-to-br from-primary/10 via-background to-accent/60 p-6 shadow-sm">
        <h2 className="text-lg font-extrabold mb-2">语言模型定价</h2>
        <p className="text-sm text-muted-foreground mb-4">
          语言大模型（GPT、Claude、DeepSeek 等）走 New-API 计价体系，请在控制台查看实时价格。
        </p>
        <Link href="/console" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold hover:opacity-90 transition-opacity">
          前往控制台 →
        </Link>
      </div>

      {unpriced.length > 0 && (
        <div>
          <h2 className="text-xl font-extrabold mb-1">待定价</h2>
          <p className="text-sm text-muted-foreground mb-5">以下模型尚未配置价格或处于接入评估阶段。</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {unpriced.map((m) => (
              <div key={m.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <strong className="text-sm">{m.name}</strong>
                  <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-bold ${badgeColor(m.badge)}`}>{m.badge || "待定"}</span>
                </div>
                <p className="text-xs text-muted-foreground">{m.provider}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
