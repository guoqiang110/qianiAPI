"use client";

import { useState } from "react";
import { ArrowRight, Image, Scissors, Palette, Wand2, Search, Code, ChevronDown } from "lucide-react";

const tools = [
  {
    icon: Wand2, name: "图生图 / 改图", model: "wanx2.1-imageedit", badge: "可用", badgeColor: "bg-sky-50 text-sky-700 ring-sky-200/50",
    gradient: "from-sky-500/5 to-sky-100/10",
    desc: "上传参考图，按提示词修改。适合产品换背景、风格转换、局部修改。",
    usage: `POST https://qianxi-api.com/api/cn-image/generations
Content-Type: application/json
Authorization: Bearer sk-...

{
  "model": "wanx2.1-imageedit",
  "prompt": "把背景换成白色摄影棚",
  "image": "base64... or URL"
}`,
  },
  {
    icon: Palette, name: "风格迁移", model: "wanx2.1-imageedit", badge: "可用", badgeColor: "bg-sky-50 text-sky-700 ring-sky-200/50",
    gradient: "from-violet-500/5 to-violet-100/10",
    desc: "将照片转为插画、油画、水彩、二次元等多种风格。通过图生图 + 风格描述提示词实现。",
    usage: `POST https://qianxi-api.com/api/cn-image/generations
Content-Type: application/json
Authorization: Bearer sk-...

{
  "model": "wanx2.1-imageedit",
  "prompt": "转为吉卜力动画风格",
  "image": "base64... or URL"
}`,
  },
  {
    icon: Search, name: "图片放大 / 修复", model: "规划中", badge: "规划中", badgeColor: "bg-amber-50 text-amber-700 ring-amber-200/50",
    gradient: "from-amber-500/5 to-amber-100/10",
    desc: "低分辨率图片 AI 超分放大，老照片修复，去噪去模糊。候选方案：Real-ESRGAN 或云端超分 API。",
    usage: null,
  },
  {
    icon: Scissors, name: "背景移除", model: "规划中", badge: "规划中", badgeColor: "bg-amber-50 text-amber-700 ring-amber-200/50",
    gradient: "from-emerald-500/5 to-emerald-100/10",
    desc: "一键移除图片背景，输出透明 PNG。适合电商白底图和素材抠图。候选方案：rembg 或云端抠图 API。",
    usage: null,
  },
];

function CodeBlock({ code }: { code: string }) {
  const [open, setOpen] = useState(false);
  const lines = code.trim().split("\n");
  return (
    <div className="mt-3">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
      >
        <Code className="h-3 w-3" />
        {open ? "收起示例" : "查看 API 示例"}
        <ChevronDown className={`h-3 w-3 transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="mt-2 rounded-xl bg-slate-950 p-4 overflow-x-auto">
          <pre className="text-xs text-emerald-300 leading-relaxed"><code>{code}</code></pre>
        </div>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <div className="flex-1">
      <section className="border-b border-sky-100 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.16),_transparent_30%),linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(239,246,255,0.90))]">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:py-18">
          <div className="flex items-center gap-3 mb-3">
            <Image className="h-5 w-5 text-sky-600" />
            <span className="inline-flex rounded-full border border-sky-200 bg-white/85 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.24em] text-sky-700">IMAGE TOOLS</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 lg:text-5xl">图片处理</h1>
          <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-600">
            图生图 · 风格迁移 · 图片增强 · 背景移除。统一 API 调用，也可在在线生图工作台中直接操作。
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-10 space-y-10 bg-[linear-gradient(180deg,_rgba(248,250,252,0.98),_rgba(239,246,255,0.68))]">
        {/* tool cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {tools.map((t) => (
            <div key={t.name} className={`rounded-[22px] border border-slate-200/80 p-6 flex flex-col gap-3 bg-[linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(248,250,252,0.98))] transition-all hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-[0_20px_48px_rgba(59,130,246,0.08)]`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${t.gradient.replace("/5","/20").replace("/10","/30")}`}>
                    <t.icon className="h-5 w-5 text-slate-700" />
                  </div>
                  <div>
                    <strong className="text-base text-slate-950">{t.name}</strong>
                    {t.model && <p className="text-xs text-slate-400 font-mono mt-0.5">{t.model}</p>}
                  </div>
                </div>
                <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ring-1 ${t.badgeColor}`}>{t.badge}</span>
              </div>
              <p className="text-sm text-slate-500 leading-6">{t.desc}</p>
              {t.badge === "规划中" ? (
                <div className="mt-1 rounded-xl border border-amber-100 bg-amber-50/60 px-3 py-2 text-xs text-amber-700 font-medium">
                  正在评估接入方案，预计下个迭代上线。有加速需求请联系客服。
                </div>
              ) : (
                <div className="mt-1 rounded-xl border border-emerald-100 bg-emerald-50/60 px-3 py-2 text-xs text-emerald-700 font-medium">
                  已接入，可直接调用 API 或在在线生图工作台使用。
                </div>
              )}
              {t.usage && <CodeBlock code={t.usage} />}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="rounded-[24px] border border-sky-200/80 bg-[linear-gradient(135deg,_rgba(239,246,255,0.95),_rgba(255,255,255,0.98))] p-10 text-center shadow-[0_12px_40px_rgba(59,130,246,0.06)]">
          <h2 className="text-2xl font-extrabold text-slate-950 mb-2">在线生图工作台</h2>
          <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto leading-7">
            图生图和文生图统一入口。选模型、写提示词、上传参考图，一步到位，无需写代码。
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <a href="/zh/studio" className="inline-flex h-11 px-6 items-center gap-2 rounded-full bg-slate-950 text-white text-sm font-bold transition hover:opacity-90">
              打开工作台 <ArrowRight className="h-4 w-4" />
            </a>
            <a href="/zh/docs" className="inline-flex h-11 px-6 items-center gap-2 rounded-full border border-slate-200 bg-white text-sm font-bold text-slate-700 transition hover:border-sky-200 hover:text-sky-700">
              查看 API 文档
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
