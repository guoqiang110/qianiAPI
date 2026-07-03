"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Users, Copy, Wallet, TrendingUp, ArrowRight, Loader2 } from "lucide-react";

type UserData = {
  username?: string;
  display_name?: string;
  group?: string;
  aff_code?: string;
  aff_count?: number;
  aff_quota?: number;
  aff_history?: number;
};

type Customer = {
  username?: string;
  displayName?: string;
  email?: string;
  group?: string;
  used_quota?: number;
  quota?: number;
  created_at?: number;
};

function yuan(quota: number) {
  const n = Number(quota || 0);
  return (n / 20000).toFixed(2);
}

function usedYuan(quota: number) {
  const n = Number(quota || 0);
  return (n / 20000).toFixed(2);
}

async function api(path: string, options: RequestInit = {}) {
  const res = await fetch(path, { credentials: "include", ...options });
  const text = await res.text();
  let data: Record<string, unknown> = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {}
  if (!res.ok || data.success === false) {
    const err = new Error(
      (data.message as string) || "HTTP " + res.status
    );
    throw err;
  }
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

  useEffect(() => {
    init();
  }, []);

  async function init() {
    try {
      const self = await api("/api/user/self");
      const cd = await api("/api/cn-image/agent/customers").catch(() => ({ customers: [] }));
      setUser((self.data || {}) as UserData);
      setCustomers((cd.customers || []) as Customer[]);
      load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  async function load() {
    try {
      const key = localStorage.getItem("qianxi_agent_key") || "";
      const res = await fetch("/api/cn-image/withdraw", {
        headers: { Authorization: "Bearer " + key },
      });
      const data = await res.json();
      setItems(data.withdrawals || []);
    } catch {}
  }

  async function submit() {
    const a = parseFloat(amount);
    if (!a || a < 10) {
      setMsg(a < 10 ? "Min 10 yuan" : "Invalid amount");
      return;
    }
    setSubmitting(true);
    setMsg("Submitting...");
    try {
      const key = localStorage.getItem("qianxi_agent_key") || "";
      const res = await fetch("/api/cn-image/withdraw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + key,
        },
        body: JSON.stringify({
          amount: a,
          username: user?.display_name || user?.username || "",
          method: "balance",
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error as string);
      setMsg(data.message as string);
      setAmount("");
      load();
    } catch (err: unknown) {
      setMsg(err instanceof Error ? err.message : "Failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="mb-4 text-4xl">Agent Login Required</div>
        <h1 className="text-2xl font-extrabold mb-2">Agent Backend</h1>
        <p className="text-muted-foreground mb-6">{error}</p>
        <a href="/console" className="inline-flex h-11 items-center rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground no-underline">
          Go to Console
        </a>
      </div>
    );
  }

  const username = user?.display_name || user?.username || "Agent";
  const code = user?.aff_code || "";
  const inviteLink = `${location.origin}/register?aff=${encodeURIComponent(code)}`;
  const affCount = Number(user?.aff_count || 0);
  const affQuota = Number(user?.aff_quota || 0);
  const affHistory = Number(user?.aff_history || 0);
  const total = customers.reduce((s, c) => s + Number(c.used_quota || 0), 0);

  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 md:px-6 py-6">
      <div className="mb-8">
        <Badge className="mb-3">AGENT CENTER</Badge>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Agent Dashboard</h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Invite links, customer list, rewards, and withdrawal requests.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold">{username}</h2>
                <p className="text-sm text-muted-foreground mt-1">Group: {user?.group || "default"}</p>
              </div>
              <Badge variant="secondary">Testing</Badge>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-4 w-4 text-primary" />
              <h3 className="text-lg font-extrabold">Invite Link</h3>
            </div>
            <div className="flex gap-3">
              <Input value={inviteLink} readOnly className="flex-1 h-11 text-sm" />
              <Button onClick={() => navigator.clipboard.writeText(inviteLink)}>
                <Copy className="h-4 w-4 mr-2" />Copy
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Code: {code}</p>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-4 w-4 text-primary" />
              <h3 className="text-lg font-extrabold">Customers</h3>
              <Badge variant="secondary" className="ml-auto">{customers.length}</Badge>
            </div>
            {customers.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">No customers yet.</p>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <div className="grid grid-cols-4 gap-3 bg-muted/50 text-xs font-bold text-muted-foreground px-4 py-3">
                  <div>Name</div><div>Group</div><div>Quota</div><div>Used</div>
                </div>
                {customers.map((item, i) => (
                  <div key={i} className="grid grid-cols-4 gap-3 px-4 py-3 text-sm border-t">
                    <div className="font-semibold truncate">{item.displayName || item.username || "-"}</div>
                    <div className="text-muted-foreground">{item.group || "default"}</div>
                    <div>{yuan(item.quota || 0)}</div>
                    <div className="text-primary font-semibold">{usedYuan(item.used_quota || 0)}</div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-4 w-4 text-primary" />
              <h3 className="text-lg font-extrabold">Conversion</h3>
            </div>
            <div className="border rounded-lg overflow-hidden">
              <div className="grid grid-cols-3 bg-muted/50 text-xs font-bold text-muted-foreground px-4 py-3">
                <div>Metric</div><div>Value</div><div>Note</div>
              </div>
              {[
                ["Invites", affCount, "inviter_id bound"],
                ["Reward", yuan(affQuota), "transferable"],
                ["Total Reward", yuan(affHistory), "lifetime"],
                ["Cust. Spend", usedYuan(total), "all customers"],
              ].map(([label, value, desc]) => (
                <div key={label} className="grid grid-cols-3 px-4 py-3 text-sm border-t">
                  <div className="font-semibold">{label}</div>
                  <div className="text-primary font-semibold">{value}</div>
                  <div className="text-muted-foreground">{desc}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <aside className="space-y-6">
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Wallet className="h-4 w-4 text-primary" />
              <h3 className="text-lg font-extrabold">Reward Rules</h3>
            </div>
            <div className="space-y-3 text-sm">
              {[
                ["Invite Signup", "¥5/person"],
                ["Daily Check-in", "¥1/day"],
                ["Top-up Rebate", "10%"],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between border-b pb-3 last:border-0">
                  <span className="text-muted-foreground">{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <ArrowRight className="h-4 w-4 text-primary" />
              <h3 className="text-lg font-extrabold">Withdraw</h3>
            </div>
            <div className="flex gap-3 mb-3">
              <Input type="number" min="10" step="1" placeholder="Min ¥10" value={amount} onChange={(e) => setAmount(e.target.value)} className="flex-1 h-11 text-sm" />
              <Button onClick={submit} disabled={submitting}>
                {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Submit
              </Button>
            </div>
            {msg && <p className="text-xs text-muted-foreground mb-3">{msg}</p>}
            {items.length > 0 && (
              <div className="border-t pt-3 space-y-2">
                {items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="font-semibold">¥{Number(item.amount).toFixed(2)}</span>
                    <span className={
                      item.status === "approved" ? "text-green-600 font-semibold" :
                      item.status === "rejected" ? "text-red-500" : "text-amber-600 font-semibold"
                    }>
                      {item.status === "approved" ? "Approved" : item.status === "rejected" ? "Rejected" : "Pending"}
                    </span>
                    <span className="text-xs text-muted-foreground">{String(item.created_at || "")}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-5">
            <h3 className="text-lg font-extrabold mb-3">Quick Links</h3>
            <div className="space-y-2">
              <a href="/console/personal" className="flex items-center gap-2 text-sm text-primary font-semibold no-underline hover:underline">
                <ArrowRight className="h-3.5 w-3.5" />Personal Settings
              </a>
              <a href="/console" className="flex items-center gap-2 text-sm text-primary font-semibold no-underline hover:underline">
                <ArrowRight className="h-3.5 w-3.5" />Console
              </a>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
