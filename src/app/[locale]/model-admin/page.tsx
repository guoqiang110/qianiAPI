"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, CheckCircle2, XCircle, RefreshCw, Save, Database, History, ToggleLeft, ToggleRight } from "lucide-react";

type AdminModel = { id: number; name: string; status: number; vendor_id: number | null; endpoints: string | null };
type AdminChannel = { id: number; name: string; status: number; model_list: string; model_mapping: string };
type CnImageModel = { id: string; name: string; provider: string; badge: string; price?: number; enabled: boolean };
type CnImageConfig = { version: number; updatedAt: string; models: CnImageModel[] };
type BillingPrice = { model: string; price: number; ts: string };

export default function ModelAdminPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newApiModels, setNewApiModels] = useState<AdminModel[]>([]);
  const [channels, setChannels] = useState<AdminChannel[]>([]);
  const [cnConfig, setCnConfig] = useState<CnImageConfig | null>(null);
  const [billingPrices, setBillingPrices] = useState<BillingPrice[]>([]);
  const [backups, setBackups] = useState<string[]>([]);
  const [toggleMap, setToggleMap] = useState<Record<string, boolean>>({});
  const [syncing, setSyncing] = useState(false);

  const loadAll = useCallback(async () => {
    try {
      const [adminRes, cnRes, billingRes, backupRes] = await Promise.all([
        fetch("/api/admin/models").then(r => r.json()),
        fetch("/api/cn-image/model-config").then(r => r.json()),
        fetch("/api/cn-image/billing-prices").then(r => r.json()).catch(() => ({ prices: [] })),
        fetch("/api/cn-image/model-config/backups").then(r => r.json()).catch(() => ({ backups: [] })),
      ]);
      setNewApiModels(adminRes.models || []);
      setChannels(adminRes.channels || []);
      setCnConfig(cnRes);
      setBillingPrices(billingRes.prices || []);
      setBackups(backupRes.backups || []);
      if (cnRes?.models) {
        const map: Record<string, boolean> = {};
        cnRes.models.forEach((m: CnImageModel) => { map[m.id] = m.enabled; });
        setToggleMap(map);
      }
    } catch { /* empty */ }
    setLoading(false);
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const handleToggle = (modelId: string) => {
    setToggleMap(prev => ({ ...prev, [modelId]: !prev[modelId] }));
  };

  const handleSave = async () => {
    if (!cnConfig) return;
    setSaving(true);
    try {
      const updatedModels = cnConfig.models.map(m => ({ ...m, enabled: toggleMap[m.id] ?? m.enabled }));
      await fetch("/api/admin/model-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ models: updatedModels }),
      });
      await loadAll();
    } catch { /* empty */ }
    setSaving(false);
  };

  const handleSyncPrices = async () => {
    setSyncing(true);
    try { await fetch("/api/cn-image/generations", { method: "HEAD" }).catch(() => {}); await new Promise(r => setTimeout(r, 1500)); await loadAll(); } catch {}
    setSyncing(false);
  };

  const handleRestore = async (filename: string) => {
    if (!confirm("恢复备份 " + filename + "？")) return;
    try {
      await fetch("/api/admin/model-config", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "restore", filename }) });
      await loadAll();
    } catch {}
  };

  function getChannelForModel(modelName: string) {
    return channels.filter(c => { const list = (c.model_list || "").split(",").map(s => s.trim()); return list.includes(modelName); });
  }

  function getBillingPrice(modelId: string) { const bp = billingPrices.find(p => p.model === modelId); return bp?.price; }

  if (loading) return <div className="flex-1 flex items-center justify-center py-32"><Loader2 className="h-8 w-8 animate-spin text-sky-500" /></div>;

  return (
    <div className="flex-1">
      <section className="border-b border-sky-100 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.14),_transparent_30%),linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(239,246,255,0.90))]">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="inline-flex rounded-full border border-sky-200 bg-white/85 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.24em] text-sky-700">MODEL ADMIN</span>
            <button onClick={handleSyncPrices} disabled={syncing} className="inline-flex items-center gap-1.5 rounded-full bg-sky-600 px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-white hover:bg-sky-700 transition disabled:opacity-50">
              <RefreshCw className={"h-3.5 w-3.5" + (syncing ? " animate-spin" : "")} />{syncing ? "同步中..." : "手动同步"}
            </button>
            {Object.keys(toggleMap).some(k => toggleMap[k] !== cnConfig?.models?.find(m => m.id === k)?.enabled) && (
              <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-white hover:bg-emerald-700 transition disabled:opacity-50">
                <Save className="h-3.5 w-3.5" />{saving ? "保存中..." : "保存变更"}
              </button>
            )}
          </div>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-950 lg:text-5xl">模型管理后台</h1>
          <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-600">New-API 通道配置 · cn-image 展示价同步 · 上次更新：{cnConfig?.updatedAt ? new Date(cnConfig.updatedAt).toLocaleString("zh-CN") : "未知"}</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-8 space-y-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[{label:"New-API 模型",v:newApiModels.length},{label:"上游通道",v:channels.length},{label:"展示模型",v:cnConfig?.models?.length??0},{label:"备份数量",v:backups.length}].map((c,i)=><div key={i} className="rounded-[20px] border border-slate-200/80 bg-white p-4"><p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">{c.label}</p><p className="mt-2 text-2xl font-extrabold text-slate-950">{c.v}</p></div>)}
        </div>

        {cnConfig && (
          <div>
            <h2 className="text-xl font-extrabold text-slate-950 mb-4">cn-image 展示配置 (v{cnConfig.version})</h2>
            <div className="overflow-hidden rounded-[20px] border border-slate-200/80 bg-white">
              <div className="hidden grid-cols-7 gap-3 bg-slate-50 px-5 py-3 text-[11px] font-extrabold uppercase tracking-[0.12em] text-slate-400 sm:grid"><div>模型ID</div><div>名称</div><div>供应商</div><div>展示价</div><div>计费价</div><div>标签</div><div>开关</div></div>
              {cnConfig.models.map(m => {
                const bp = getBillingPrice(m.id);
                const pd = bp !== undefined && m.price !== undefined && Math.abs(bp - m.price) > 0.01;
                return (
                  <div key={m.id} className="grid grid-cols-2 gap-2 border-t border-slate-100 px-5 py-3 text-sm sm:grid-cols-7 sm:gap-3 items-center">
                    <div className="text-slate-400 font-mono text-[10px]">{m.id}</div>
                    <div className="font-bold text-slate-900 truncate">{m.name}</div>
                    <div className="text-slate-500 text-xs">{m.provider}</div>
                    <div>{m.price!==undefined?<span className={pd?"rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700":"rounded-full bg-slate-950 px-2.5 py-0.5 text-[10px] font-bold text-white"}>¥{m.price.toFixed(2)}{pd&&bp!==undefined&&<span className="ml-0.5 opacity-70">(实际 ¥{bp.toFixed(2)})</span>}</span>:<span className="text-amber-600 font-bold text-[10px]">未定价</span>}</div>
                    <div>{bp!==undefined?<span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">¥{bp.toFixed(2)}</span>:<span className="text-slate-300 text-[10px]">—</span>}</div>
                    <div><span className="rounded-md bg-purple-50 px-1.5 py-0.5 text-[10px] font-semibold text-purple-600">{m.badge}</span></div>
                    <div><button onClick={()=>handleToggle(m.id)} className="inline-flex items-center gap-1">{(toggleMap[m.id]??m.enabled)?<span className="inline-flex items-center gap-1 text-emerald-600 text-[10px] font-extrabold"><ToggleRight className="h-5 w-5"/>启用</span>:<span className="inline-flex items-center gap-1 text-slate-400 text-[10px] font-extrabold"><ToggleLeft className="h-5 w-5"/>禁用</span>}</button></div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-xl font-extrabold text-slate-950 mb-4">New-API 模型注册</h2>
          <div className="overflow-hidden rounded-[20px] border border-slate-200/80 bg-white">
            <div className="hidden grid-cols-6 gap-3 bg-slate-50 px-5 py-3 text-[11px] font-extrabold uppercase tracking-[0.12em] text-slate-400 sm:grid"><div>ID</div><div>模型名</div><div>状态</div><div>通道</div><div>endpoints</div><div>vendor</div></div>
            {newApiModels.map(m => {
              const mc = getChannelForModel(m.name);
              return (<div key={m.id} className="grid grid-cols-2 gap-2 border-t border-slate-100 px-5 py-3 text-sm sm:grid-cols-6 sm:gap-3"><div className="text-slate-400 font-mono text-xs">{m.id}</div><div className="font-bold text-slate-900 truncate">{m.name}</div><div>{m.status===1?<span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-extrabold text-emerald-700"><CheckCircle2 className="h-3 w-3"/>启用</span>:<span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-extrabold text-slate-500"><XCircle className="h-3 w-3"/>禁用</span>}</div><div className="text-xs text-slate-500">{mc.length>0?mc.map(c=>c.name).join(", "):<span className="text-amber-600 font-bold">未分配</span>}</div><div className="text-xs text-slate-400 font-mono truncate">{m.endpoints||"—"}</div><div className="text-xs text-slate-400">{m.vendor_id||"—"}</div></div>);
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div><h2 className="text-xl font-extrabold text-slate-950 mb-4">上游通道</h2><div className="space-y-3">{channels.map(c=>(<div key={c.id} className="rounded-[20px] border border-slate-200/80 bg-[linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(248,250,252,0.98))] p-5"><div className="flex items-center justify-between mb-3"><strong className="text-base text-slate-950">{c.name}</strong>{c.status===1?<span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,0.16)]"/>:<span className="h-2.5 w-2.5 rounded-full bg-slate-300"/>}</div><p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-slate-400 mb-2">已分配模型</p><div className="flex flex-wrap gap-1.5">{(c.model_list||"").split(",").filter(Boolean).slice(0,10).map(name=><span key={name} className="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">{name.trim()}</span>)}</div></div>))}</div></div>
          <div><h2 className="text-xl font-extrabold text-slate-950 mb-4"><span className="inline-flex items-center gap-2"><History className="h-5 w-5"/>配置备份</span></h2>{backups.length===0?<div className="rounded-[20px] border border-slate-200/80 bg-white p-6 text-center text-slate-400 text-sm">暂无备份</div>:<div className="space-y-2">{backups.slice(0,20).map((bf:string)=>(<div key={bf} className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-white px-4 py-3"><div className="flex items-center gap-2"><Database className="h-4 w-4 text-slate-400"/><span className="text-sm font-mono text-slate-700">{bf}</span></div><button onClick={()=>handleRestore(bf)} className="rounded-lg bg-sky-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.1em] text-sky-700 hover:bg-sky-100 transition">恢复</button></div>))}</div>}</div>
        </div>
      </div>
    </div>
  );
}
