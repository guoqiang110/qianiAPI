"use client";

import { useEffect, useState } from "react";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

type AdminModel = { id: number; name: string; status: number; vendor_id: number | null; endpoints: string | null };
type AdminChannel = { id: number; name: string; status: number; model_list: string; model_mapping: string };
type CnImageModel = { id: string; name: string; provider: string; badge: string; price?: number; enabled: boolean };
type CnImageConfig = { version: number; updatedAt: string; models: CnImageModel[] };

export default function ModelAdminPage() {
  const [loading, setLoading] = useState(true);
  const [newApiModels, setNewApiModels] = useState<AdminModel[]>([]);
  const [channels, setChannels] = useState<AdminChannel[]>([]);
  const [cnConfig, setCnConfig] = useState<CnImageConfig | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [adminRes, cnRes] = await Promise.all([
          fetch("/api/admin/models").then(r => r.json()),
          fetch("/api/cn-image/model-config").then(r => r.json()),
        ]);
        setNewApiModels(adminRes.models || []);
        setChannels(adminRes.channels || []);
        setCnConfig(cnRes);
      } catch {}
      setLoading(false);
    })();
  }, []);

  function getChannelForModel(modelName: string) {
    return channels.filter(c => {
      const list = (c.model_list || "").split(",").map(s => s.trim());
      return list.includes(modelName);
    });
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
      </div>
    );
  }

  return (
    <div className="flex-1">
      <section className="border-b border-sky-100 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.14),_transparent_30%),linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(239,246,255,0.90))]">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
          <span className="inline-flex rounded-full border border-sky-200 bg-white/85 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.24em] text-sky-700">MODEL ADMIN</span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-950 lg:text-5xl">模型管理后台</h1>
          <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-600">
            New-API 通道配置 · cn-image 展示价同步 · 上次同步：
            {cnConfig?.updatedAt ? new Date(cnConfig.updatedAt).toLocaleString("zh-CN") : "未知"}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-8 space-y-8">
        {/* New-API models */}
        <div>
          <h2 className="text-xl font-extrabold text-slate-950 mb-4">New-API 模型注册</h2>
          <div className="overflow-hidden rounded-[20px] border border-slate-200/80 bg-white">
            <div className="hidden grid-cols-6 gap-3 bg-slate-50 px-5 py-3 text-[11px] font-extrabold uppercase tracking-[0.12em] text-slate-400 sm:grid">
              <div>ID</div><div>模型名</div><div>状态</div><div>通道</div><div>endpoints</div><div>vendor</div>
            </div>
            {newApiModels.map(m => {
              const modelChannels = getChannelForModel(m.name);
              return (
                <div key={m.id} className="grid grid-cols-2 gap-2 border-t border-slate-100 px-5 py-3 text-sm sm:grid-cols-6 sm:gap-3">
                  <div className="text-slate-400 font-mono text-xs">{m.id}</div>
                  <div className="font-bold text-slate-900 truncate">{m.name}</div>
                  <div>
                    {m.status === 1 ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-extrabold text-emerald-700">
                        <CheckCircle2 className="h-3 w-3" />启用
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-extrabold text-slate-500">
                        <XCircle className="h-3 w-3" />禁用
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500">
                    {modelChannels.length > 0
                      ? modelChannels.map(c => c.name).join(", ")
                      : <span className="text-amber-600 font-bold">未分配</span>
                    }
                  </div>
                  <div className="text-xs text-slate-400 font-mono truncate">{m.endpoints || "—"}</div>
                  <div className="text-xs text-slate-400">{m.vendor_id || "—"}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* cn-image config */}
        {cnConfig && (
          <div>
            <h2 className="text-xl font-extrabold text-slate-950 mb-4">cn-image 展示配置 (v{cnConfig.version})</h2>
            <div className="overflow-hidden rounded-[20px] border border-slate-200/80 bg-white">
              <div className="hidden grid-cols-5 gap-3 bg-slate-50 px-5 py-3 text-[11px] font-extrabold uppercase tracking-[0.12em] text-slate-400 sm:grid">
                <div>模型ID</div><div>名称</div><div>供应商</div><div>价格</div><div>状态</div>
              </div>
              {cnConfig.models.map(m => (
                <div key={m.id} className="grid grid-cols-2 gap-2 border-t border-slate-100 px-5 py-3 text-sm sm:grid-cols-5 sm:gap-3">
                  <div className="text-slate-400 font-mono text-xs">{m.id}</div>
                  <div className="font-bold text-slate-900 truncate">{m.name}</div>
                  <div className="text-slate-500">{m.provider}</div>
                  <div>
                    {m.price !== undefined
                      ? <span className="rounded-full bg-slate-950 px-2.5 py-0.5 text-[10px] font-bold text-white">¥{m.price.toFixed(2)}/次</span>
                      : <span className="text-amber-600 font-bold text-xs">未定价</span>
                    }
                  </div>
                  <div>
                    {m.enabled ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-extrabold text-emerald-700">
                        <CheckCircle2 className="h-3 w-3" />启用
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-extrabold text-slate-500">
                        <XCircle className="h-3 w-3" />禁用
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Channels */}
        <div>
          <h2 className="text-xl font-extrabold text-slate-950 mb-4">上游通道</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {channels.map(c => (
              <div key={c.id} className="rounded-[20px] border border-slate-200/80 bg-[linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(248,250,252,0.98))] p-5">
                <div className="flex items-center justify-between mb-3">
                  <strong className="text-base text-slate-950">{c.name}</strong>
                  {c.status === 1
                    ? <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,0.16)]" />
                    : <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                  }
                </div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-slate-400 mb-2">已分配模型</p>
                <div className="flex flex-wrap gap-1.5">
                  {(c.model_list || "").split(",").filter(Boolean).slice(0, 10).map(name => (
                    <span key={name} className="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">{name.trim()}</span>
                  ))}
                  {(c.model_list || "").split(",").filter(Boolean).length > 10 && (
                    <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-400">
                      +{(c.model_list || "").split(",").filter(Boolean).length - 10}
                    </span>
                  )}
                </div>
                {c.model_mapping && (
                  <>
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-slate-400 mt-3 mb-1">映射</p>
                    <p className="text-[10px] text-slate-500 font-mono">{c.model_mapping}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}