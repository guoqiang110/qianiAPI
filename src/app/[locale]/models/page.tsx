"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Search } from "lucide-react";

type CnImageModel = { id: string; name: string; provider: string; badge: string; price?: number; enabled: boolean; description?: string };
type CnImageConfig = { version: number; updatedAt: string; models: CnImageModel[] };

const LLM_MODELS: Record<string, { name: string; provider: string; badge: string; summary: string; category: string }> = {
  "gpt-5.5": { name:"GPT-5.5", provider:"OpenAI", badge:"推荐", summary:"OpenAI 最新旗舰，强推理、多模态、长上下文。", category:"llm-chat" },
  "claude-sonnet-4-20250514": { name:"Claude Sonnet 4", provider:"Anthropic", badge:"推荐", summary:"均衡模型，出色的代码生成和长文理解。", category:"llm-chat" },
  "deepseek-v4-flash": { name:"DeepSeek V4 Flash", provider:"DeepSeek", badge:"可用", summary:"国产高性价比，中文优化。", category:"llm-chat" },
  "qwen-max": { name:"通义千问 Max", provider:"阿里云", badge:"可用", summary:"阿里旗舰中文大模型，知识广博。", category:"llm-chat" },
};

const CATEGORIES = [
  { id:"image-generation", name:"图片生成", icon:"🖼", toolUrl:"/zh/studio", toolLabel:"在线生图" },
  { id:"image-processing", name:"图片处理", icon:"✂", toolUrl:"/zh/image-tools", toolLabel:"图片处理" },
  { id:"llm-chat", name:"语言大模型", icon:"💬", toolUrl:"/zh/models", toolLabel:"LLM 接入" },
];

const badgeColors: Record<string, string> = {
  "稳定推荐":"bg-emerald-50 text-emerald-700 ring-emerald-200/50","稳定可用":"bg-sky-50 text-sky-700 ring-sky-200/50",
  "推荐":"bg-emerald-50 text-emerald-700 ring-emerald-200/50","可用":"bg-sky-50 text-sky-700 ring-sky-200/50",
  "MVP":"bg-blue-50 text-blue-700 ring-blue-200/50","候选":"bg-amber-50 text-amber-700 ring-amber-200/50",
  "需 Key":"bg-amber-50 text-amber-700 ring-amber-200/50","待接入":"bg-slate-100 text-slate-600 ring-slate-200/50",
  "待配置":"bg-slate-100 text-slate-500 ring-slate-200/50","账号未开通":"bg-slate-100 text-slate-500 ring-slate-200/50",
  "兼容":"bg-sky-50 text-sky-700 ring-sky-200/50",
};
const getBadge = (b: string) => badgeColors[b] ?? "bg-slate-100 text-slate-600 ring-slate-200/50";

type ModelCard = { id: string; name: string; provider: string; badge: string; summary: string; price?: number; category: string };

export default function ModelsPage() {
  const [activeCat, setActiveCat] = useState("image-generation");
  const [cnModels, setCnModels] = useState<CnImageModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/cn-image/model-config").then(r => r.json());
        setCnModels((res?.models || []).filter((m: CnImageModel) => m.enabled));
      } catch {}
      setLoading(false);
    })();
  }, []);

  const allModels: ModelCard[] = useMemo(() => [
    ...cnModels.map(m => ({
      id: m.id, name: m.name, provider: m.provider, badge: m.badge,
      summary: (m as any).description || m.name, price: m.price,
      category: m.id.includes("imageedit") ? "image-processing" : "image-generation",
    })),
    ...Object.entries(LLM_MODELS).map(([id, m]) => ({ id, ...m })),
  ], [cnModels]);

  const models = useMemo(() => {
    let list = allModels.filter(m => m.category === activeCat);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(m => m.name.toLowerCase().includes(q) || m.provider.toLowerCase().includes(q) || m.summary.toLowerCase().includes(q));
    }
    return list;
  }, [allModels, activeCat, search]);

  const cat = CATEGORIES.find(c => c.id === activeCat);

  if (loading) return <div className="flex-1 flex items-center justify-center py-32"><Loader2 className="h-8 w-8 animate-spin text-sky-500" /></div>;

  return (
    <div className="flex-1">
      <section className="border-b border-sky-100 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.16),_transparent_30%),linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(239,246,255,0.90))]">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
          <span className="inline-flex rounded-full border border-sky-200 bg-white/85 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.24em] text-sky-700">QIANXI API MODELS</span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-950 lg:text-5xl">模型广场</h1>
          <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-600">覆盖图片生成、图片处理、语言模型等品类。价格与后台配置实时同步。</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-8 space-y-6">
        {/* 分类 tab + 搜索 */}
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-3">
            {CATEGORIES.map(c => {
              const colors: Record<string,string> = {"image-generation":"bg-[linear-gradient(135deg,_#3b82f6,_#8b5cf6)]","image-processing":"bg-[linear-gradient(135deg,_#f59e0b,_#ef4444)]","llm-chat":"bg-[linear-gradient(135deg,_#10b981,_#06b6d4)]"};
              return (
              <button key={c.id} onClick={() => { setActiveCat(c.id); setSearch(""); }} className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${activeCat===c.id?colors[c.id]+" text-white shadow-[0_14px_32px_rgba(15,23,42,0.20)]":"border border-slate-200 bg-white text-slate-600 hover:border-sky-200 hover:bg-sky-50 hover:text-slate-950"}`}>
                <span>{c.icon}</span>{c.name}
              </button>
              )})}
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="搜索模型或供应商..."
              className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100 transition"
            />
          </div>
        </div>

        {cat && (
          <div className="flex flex-col gap-3 rounded-[20px] border border-slate-200/80 bg-[linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(248,250,252,0.98))] p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-slate-400">当前分类</p>
              <div className="mt-1 flex items-center gap-3">
                <strong className="text-xl text-slate-950">{cat.name}</strong>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">{models.length} 个模型</span>
                {search && <span className="text-xs text-sky-600">搜索：&ldquo;{search}&rdquo;</span>}
              </div>
            </div>
            {cat.toolUrl && <a href={cat.toolUrl} className="inline-flex h-10 items-center rounded-xl bg-slate-950 px-4 text-sm font-bold text-white no-underline transition hover:opacity-90">{cat.toolLabel} →</a>}
          </div>
        )}

        {models.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <Search className="h-8 w-8 mx-auto mb-3 opacity-50" />
            <p className="text-sm">没有匹配的模型</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {models.map(m => (
              <div key={m.id} className="group flex flex-col gap-4 rounded-[22px] border border-slate-200/80 bg-[linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(248,250,252,0.98))] p-5 transition-all hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-[0_20px_48px_rgba(59,130,246,0.10)]">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  <span>{m.provider}</span>
                  <span className="h-2.5 w-2.5 rounded-full bg-sky-400/80 shadow-[0_0_0_5px_rgba(125,211,252,0.16)]" />
                </div>
                <div className="flex items-start justify-between gap-2">
                  <strong className="text-lg leading-7 text-slate-950">{m.name}</strong>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ring-1 ${getBadge(m.badge)}`}>{m.badge}</span>
                    {m.price !== undefined && <span className="rounded-full bg-slate-950 px-2.5 py-0.5 text-[10px] font-bold text-white">¥{m.price.toFixed(2)}/次</span>}
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
        )}
      </div>
    </div>
  );
}
