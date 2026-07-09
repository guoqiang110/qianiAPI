"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Users, Copy, Wallet, TrendingUp, Loader2, Check, X, Shield } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

type UserData = {
  username?: string; display_name?: string; group?: string;
  aff_code?: string; aff_count?: number; aff_quota?: number; aff_history?: number;
};

type Customer = {
  username?: string; displayName?: string; email?: string; group?: string;
  used_quota?: number; quota?: number; created_at?: number;
};

function yuan(q: number) { return (Number(q || 0) / 20000).toFixed(2); }

async function api(path: string, options: RequestInit = {}) {
  const res = await fetch(path, { credentials: "include", ...options });
  const text = await res.text();
  let data: Record<string, unknown> = {};
  try { data = text ? JSON.parse(text) : {}; } catch {}
  if (!res.ok || data.success === false) throw new Error((data.message as string) || `HTTP ${res.status}`);
  return data;
}

export default function AgentPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<UserData | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [amount, setAmount] = useState("");
  const [msg, setMsg] = useState("");
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [adminKey, setAdminKey] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [pendingItems, setPendingItems] = useState<Record<string, unknown>[]>([]);
  const [adminMsg, setAdminMsg] = useState("");

  useEffect(() => { init(); }, []);

  async function init() {
    try {
      const self = await api("/api/user/self");
      const cd = await api("/api/cn-image/agent/customers").catch(() => ({ customers: [] }));
      setUser((self.data || {}) as UserData);
      setCustomers((cd.customers || []) as Customer[]);
      load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "加载失败");
    } finally { setLoading(false); }
  }

  async function load() {
    try {
      const key = localStorage.getItem("qianxi_agent_key") || "";
      const res = await fetch("/api/cn-image/withdraw", { headers: { Authorization: "Bearer " + key } });
      const data = await res.json();
      setItems(data.withdrawals || []);
    } catch {}
  }

  async function submit() {
    const a = parseFloat(amount);
    if (!a || a < 10) { setMsg(a < 10 ? "最低 10 元起提" : "金额无效"); return; }
    setSubmitting(true); setMsg("提交中...");
    try {
      const key = localStorage.getItem("qianxi_agent_key") || "";
      const res = await fetch("/api/cn-image/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + key },
        body: JSON.stringify({ amount: a, username: user?.display_name || user?.username || "", method: "balance" }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error as string);
      setMsg(data.message as string);
      setAmount("");
      load();
    } catch (err: unknown) {
      setMsg(err instanceof Error ? err.message : "提交失败");
    } finally { setSubmitting(false); }
  }

  async function loadAdmin() {
    const key = adminKey || localStorage.getItem("qianxi_admin_key") || "";
    if (!key) { setPendingItems([]); setIsAdmin(false); return; }
    try {
      const res = await fetch("/api/cn-image/withdraw/pending", { headers: { Authorization: "Bearer " + key } });
      const data = await res.json();
      if (res.ok) {
        setPendingItems(data.withdrawals || []);
        setIsAdmin(true);
        if (key !== adminKey) setAdminKey(key);
        localStorage.setItem("qianxi_admin_key", key);
      } else {
        setPendingItems([]);
        setIsAdmin(false);
        setAdminMsg(data.error || "管理员验证失败");
      }
    } catch { setPendingItems([]); setIsAdmin(false); }
  }

  async function approveWithdraw(id: number) {
    const key = adminKey || localStorage.getItem("qianxi_admin_key") || "";
    try {
      const res = await fetch("/api/cn-image/withdraw/" + id, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + key },
        body: JSON.stringify({ status: "approved" }),
      });
      const data = await res.json();
      if (res.ok) { setAdminMsg("已批准"); loadAdmin(); } else { setAdminMsg(data.error || "操作失败"); }
    } catch { setAdminMsg("网络错误"); }
  }

  async function rejectWithdraw(id: number) {
    const key = adminKey || localStorage.getItem("qianxi_admin_key") || "";
    try {
      const res = await fetch("/api/cn-image/withdraw/" + id, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + key },
        body: JSON.stringify({ status: "rejected" }),
      });
      const data = await res.json();
      if (res.ok) { setAdminMsg("已拒绝"); loadAdmin(); } else { setAdminMsg(data.error || "操作失败"); }
    } catch { setAdminMsg("网络错误"); }
  }

  // Compute chart data from customers and withdrawals
  const customerChartData = (() => {
    const monthly: Record<string, number> = {};
    for (const c of customers) {
      if (!c.created_at) continue;
      const d = new Date(Number(c.created_at) * 1000);
      const key = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0");
      monthly[key] = (monthly[key] || 0) + 1;
    }
    return Object.entries(monthly).sort().slice(-6).map(([m, v]) => ({ month: m, count: v }));
  })();

  const withdrawalChartData = (() => {
    const monthly: Record<string, number> = {};
    for (const w of items) {
      const ts = typeof w.created_at === "string" ? new Date(w.created_at).getTime() : Number(w.created_at) * 1000;
      if (isNaN(ts)) continue;
      const d = new Date(ts);
      const key = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0");
      monthly[key] = (monthly[key] || 0) + Number(w.amount || 0);
    }
    return Object.entries(monthly).sort().slice(-6).map(([m, v]) => ({ month: m, amount: parseFloat(v.toFixed(2)) }));
  })();

  const customerSpendData = customers
    .map((c) => ({ name: c.displayName || c.username || "-", amount: yuan(Number(c.used_quota || 0)) }))
    .sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount))
    .slice(0, 8);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1">
        <section className="border-b border-sky-100 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.14),_transparent_30%),linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(239,246,255,0.90))]">
          <div className="mx-auto max-w-3xl px-6 py-20 text-center">
            <h1 className="text-3xl font-extrabold text-slate-950 mb-3">代理商后台</h1>
            <p className="text-slate-500 mb-6">{error}</p>
            <a href="/console" className="inline-flex h-11 items-center rounded-xl bg-slate-950 px-6 text-sm font-bold text-white no-underline hover:opacity-90">前往控制台登录</a>
          </div>
        </section>
      </div>
    );
  }

  const username = user?.display_name || user?.username || "代理商";
  const code = user?.aff_code || "";
  const inviteLink = `${location.origin}/register?aff=${encodeURIComponent(code)}`;
  const affCount = Number(user?.aff_count || 0);
  const affQuota = Number(user?.aff_quota || 0);
  const affHistory = Number(user?.aff_history || 0);
  const total = customers.reduce((s, c) => s + Number(c.used_quota || 0), 0);

  const statCardColors = [
    "border-violet-200/70 bg-[linear-gradient(180deg,_rgba(245,243,255,0.96),_rgba(255,255,255,0.98))]",
    "border-emerald-200/70 bg-[linear-gradient(180deg,_rgba(236,253,245,0.96),_rgba(255,255,255,0.98))]",
    "border-amber-200/70 bg-[linear-gradient(180deg,_rgba(255,251,235,0.96),_rgba(255,255,255,0.98))]",
    "border-sky-200/70 bg-[linear-gradient(180deg,_rgba(240,249,255,0.96),_rgba(255,255,255,0.98))]",
  ];
  const statCards = [
    { label: "邀请人数", value: affCount, icon: Users },
    { label: "可提余额", value: `¥${yuan(affQuota)}`, icon: Wallet },
    { label: "累计奖励", value: `¥${yuan(affHistory)}`, icon: TrendingUp },
    { label: "客户消费", value: `¥${yuan(total)}`, icon: TrendingUp },
  ];

  return (
    <div className="flex-1">
      {/* hero */}
      <section className="border-b border-sky-100 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.16),_transparent_30%),linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(239,246,255,0.90))]">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
          <span className="inline-flex rounded-full border border-sky-200 bg-white/85 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.24em] text-sky-700">AGENT CENTER</span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-950 lg:text-5xl">代理商后台</h1>
          <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-600">
            {username} · 邀请客户、查看奖励、申请提现
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-8 bg-[linear-gradient(180deg,_rgba(248,250,252,0.98),_rgba(239,246,255,0.68))] px-6 py-8">
        {/* stat cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {statCards.map((s, idx) => (
            <div key={s.label} className={`rounded-[20px] border p-5 shadow-[0_12px_28px_rgba(15,23,42,0.04)] ${statCardColors[idx] || statCardColors[3]}`}>
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <s.icon className="h-4 w-4" />
                <span className="text-[11px] font-extrabold uppercase tracking-[0.16em]">{s.label}</span>
              </div>
              <div className="text-2xl font-extrabold text-slate-950">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Admin Approval Panel */}
        {isAdmin && (
          <div className="rounded-[22px] border border-rose-200/70 bg-[linear-gradient(180deg,_rgba(255,245,245,0.96),_rgba(255,255,255,0.98))] p-5 shadow-[0_16px_32px_rgba(244,63,94,0.08)]">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-4 w-4 text-rose-500" />
              <h3 className="text-base font-extrabold text-slate-950">提现审批</h3>
              <span className="ml-auto rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-700">{pendingItems.length} 待处理</span>
            </div>
            {adminMsg && <p className="text-xs text-slate-500 mb-3">{adminMsg}</p>}
            {pendingItems.length === 0 ? (
              <p className="text-sm text-slate-400 py-6 text-center">暂无待审批的提现申请。</p>
            ) : (
              <div className="overflow-hidden rounded-xl border border-slate-100">
                <div className="hidden grid-cols-6 gap-3 bg-slate-50 px-4 py-3 text-[11px] font-extrabold uppercase tracking-[0.12em] text-slate-400 sm:grid">
                  <div>用户</div><div>金额</div><div>方式</div><div>时间</div><div className="col-span-2">操作</div>
                </div>
                {pendingItems.map((item) => (
                  <div key={String(item.id)} className="grid grid-cols-3 gap-2 border-t border-slate-100 px-4 py-3 text-sm sm:grid-cols-6 sm:gap-3">
                    <div className="font-semibold text-slate-900 truncate">{String(item.username || "-")}</div>
                    <div className="font-bold text-rose-600">¥{Number(item.amount).toFixed(2)}</div>
                    <div className="text-slate-500">{String(item.method || "balance")}</div>
                    <div className="text-xs text-slate-400">{typeof item.created_at === "string" ? item.created_at.slice(0, 10) : ""}</div>
                    <div className="col-span-2 flex gap-2">
                      <button onClick={() => approveWithdraw(Number(item.id))} className="inline-flex h-8 items-center gap-1 rounded-lg bg-emerald-600 px-3 text-xs font-bold text-white hover:bg-emerald-700"><Check className="h-3 w-3" />批准</button>
                      <button onClick={() => rejectWithdraw(Number(item.id))} className="inline-flex h-8 items-center gap-1 rounded-lg bg-slate-200 px-3 text-xs font-bold text-slate-700 hover:bg-slate-300"><X className="h-3 w-3" />拒绝</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Admin Token Input */}
        <div className="rounded-[22px] border border-slate-200/80 bg-[linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(248,250,252,0.98))] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-4 w-4 text-slate-400" />
            <h3 className="text-base font-extrabold text-slate-950">管理员入口</h3>
          </div>
          <div className="flex gap-3">
            <input type="password" placeholder="输入管理员令牌..." value={adminKey} onChange={(e) => setAdminKey(e.target.value)} className="flex-1 h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-sky-400" />
            <button onClick={loadAdmin} className="inline-flex h-11 items-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-bold text-white transition hover:opacity-90">{isAdmin ? "刷新" : "验证"}</button>
          </div>
        </div>

        {/* Data Dashboard */}
        {(customerChartData.length > 0 || withdrawalChartData.length > 0) && (
          <div className="grid gap-6 lg:grid-cols-2">
            {customerChartData.length > 0 && (
              <div className="rounded-[22px] border border-violet-200/70 bg-[linear-gradient(180deg,_rgba(245,243,255,0.96),_rgba(255,255,255,0.98))] p-5">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-4 w-4 text-violet-500" />
                  <h3 className="text-sm font-extrabold text-slate-950">月度新增客户</h3>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={customerChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8b5cf6" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
            {withdrawalChartData.length > 0 && (
              <div className="rounded-[22px] border border-emerald-200/70 bg-[linear-gradient(180deg,_rgba(236,253,245,0.96),_rgba(255,255,255,0.98))] p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Wallet className="h-4 w-4 text-emerald-500" />
                  <h3 className="text-sm font-extrabold text-slate-950">月度提现 (¥)</h3>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={withdrawalChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="amount" fill="#10b981" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}

        {/* Top Customers by Spend */}
        {customerSpendData.length > 0 && (
          <div className="rounded-[22px] border border-amber-200/70 bg-[linear-gradient(180deg,_rgba(255,251,235,0.96),_rgba(255,255,255,0.98))] p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-4 w-4 text-amber-500" />
              <h3 className="text-sm font-extrabold text-slate-950">客户消费排行 (¥)</h3>
            </div>
            <div className="overflow-hidden rounded-xl border border-slate-100">
              {customerSpendData.map((c, i) => (
                <div key={i} className="flex items-center justify-between border-t border-slate-100 px-4 py-2.5 text-sm first:border-t-0">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-400 w-5">{i + 1}</span>
                    <span className="font-semibold text-slate-900 truncate max-w-[160px]">{c.name}</span>
                  </div>
                  <span className="font-bold text-amber-600">¥{c.amount}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-6">
            {/* invite link */}
            <div className="rounded-[22px] border border-slate-200/80 bg-[linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(248,250,252,0.98))] p-5">
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-4 w-4 text-sky-500" />
                <h3 className="text-base font-extrabold text-slate-950">邀请链接</h3>
              </div>
              <div className="flex gap-3">
                <Input value={inviteLink} readOnly className="flex-1 h-11 text-sm rounded-xl" />
                <button onClick={() => navigator.clipboard.writeText(inviteLink)} className="inline-flex h-11 items-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-bold text-white transition hover:opacity-90">
                  <Copy className="h-3.5 w-3.5" />复制
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-2">邀请码：{code}</p>
            </div>

            {/* customers */}
            <div className="rounded-[22px] border border-slate-200/80 bg-[linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(248,250,252,0.98))] p-5">
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-4 w-4 text-sky-500" />
                <h3 className="text-base font-extrabold text-slate-950">客户列表</h3>
                <span className="ml-auto rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600">{customers.length}</span>
              </div>
              {customers.length === 0 ? (
                <p className="text-sm text-slate-400 py-10 text-center">暂无客户，分享邀请链接开始推广。</p>
              ) : (
                <div className="overflow-hidden rounded-xl border border-slate-100">
                  <div className="hidden grid-cols-4 gap-3 bg-slate-50 px-4 py-3 text-[11px] font-extrabold uppercase tracking-[0.12em] text-slate-400 sm:grid">
                    <div>名称</div><div>分组</div><div>额度</div><div>已用</div>
                  </div>
                  {customers.map((item, i) => (
                    <div key={i} className="grid grid-cols-2 gap-2 border-t border-slate-100 px-4 py-3 text-sm sm:grid-cols-4 sm:gap-3">
                      <div className="font-semibold text-slate-900 truncate">{item.displayName || item.username || "-"}</div>
                      <div className="text-slate-500">{item.group || "default"}</div>
                      <div className="text-slate-600">{yuan(item.quota || 0)}</div>
                      <div className="font-bold text-sky-600">{yuan(item.used_quota || 0)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* conversion table */}
            <div className="rounded-[22px] border border-slate-200/80 bg-[linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(248,250,252,0.98))] p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-4 w-4 text-sky-500" />
                <h3 className="text-base font-extrabold text-slate-950">转化数据</h3>
              </div>
              <div className="overflow-hidden rounded-xl border border-slate-100">
                {[
                  ["邀请数", affCount, "通过你的邀请码注册"],
                  ["可提奖励", `¥${yuan(affQuota)}`, "可申请提现"],
                  ["累计奖励", `¥${yuan(affHistory)}`, "历史总奖励"],
                  ["客户消费", `¥${yuan(total)}`, "所有客户累计"],
                ].map(([label, value, desc]) => (
                  <div key={label as string} className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-sm first:border-t-0">
                    <span className="font-semibold text-slate-900">{label}</span>
                    <span className="font-bold text-sky-600">{value}</span>
                    <span className="hidden text-xs text-slate-400 sm:inline">{desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* sidebar */}
          <aside className="space-y-5">
            {/* reward rules */}
            <div className="rounded-[22px] border border-sky-200/60 bg-[linear-gradient(180deg,_rgba(239,246,255,0.96),_rgba(255,255,255,0.98))] p-5">
              <div className="flex items-center gap-2 mb-4">
                <Wallet className="h-4 w-4 text-sky-500" />
                <h3 className="text-base font-extrabold text-slate-950">奖励规则</h3>
              </div>
              <div className="space-y-3 text-sm">
                {[
                  ["邀请注册", "¥5 / 人"],
                  ["每日签到", "¥1 / 天"],
                  ["充值返佣", "10%"],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between rounded-xl bg-white/80 px-4 py-3">
                    <span className="text-slate-600">{label}</span>
                    <strong className="text-slate-950">{value}</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* withdraw */}
            <div className="rounded-[22px] border border-slate-200/80 bg-[linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(248,250,252,0.98))] p-5">
              <h3 className="text-base font-extrabold text-slate-950 mb-4">申请提现</h3>
              <div className="flex gap-3 mb-3">
                <Input type="number" min="10" step="1" placeholder="最低 ¥10" value={amount} onChange={(e) => setAmount(e.target.value)} className="flex-1 h-11 text-sm rounded-xl" />
                <button onClick={submit} disabled={submitting} className="inline-flex h-11 items-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-50">
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  提交
                </button>
              </div>
              {msg && <p className="text-xs text-slate-500 mb-3">{msg}</p>}
              {items.length > 0 && (
                <div className="border-t border-slate-100 pt-3 space-y-2">
                  {items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="font-bold text-slate-900">¥{Number(item.amount).toFixed(2)}</span>
                      <span className={
                        item.status === "approved" ? "text-emerald-600 font-bold" :
                        item.status === "rejected" ? "text-red-500" : "text-amber-600 font-bold"
                      }>
                        {item.status === "approved" ? "已通过" : item.status === "rejected" ? "已拒绝" : "审核中"}
                      </span>
                      <span className="text-xs text-slate-400">{item.created_at ? new Date(Number(item.created_at) * 1000).toLocaleDateString("zh-CN") : ""}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
