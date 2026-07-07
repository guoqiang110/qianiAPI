"use client";

import { ArrowRight, Image, Scissors, Palette, Wand2, Search } from "lucide-react";

const tools = [
  {
    icon: Wand2, name: "图生图 / 改图", model: "wanx2.1-imageedit", badge: "MVP",
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
    icon: Search, name: "图片放大 / 修复", model: "规划中", badge: "待接入",
    desc: "低分辨率图片 AI 超分放大，老照片修复，去噪去模糊。", usage: null,
  },
  {
    icon: Palette, name: "风格迁移", model: "wanx2.1-imageedit", badge: "可用",
    desc: "将照片转为插画、油画、水彩、二次元等多种风格。通过图生图 + 风格描述提示词实现。", usage: null,
  },
  {
    icon: Scissors, name: "背景移除", model: "规划中", badge: "待接入",
    desc: "一键移除图片背景，输出透明 PNG。适合电商白底图和素材抠图。", usage: null,
  },
];

export default function Page() {
  return (
    <div className="flex-1">
      <section className="border-b border-sky-100 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.14),_transparent_30%),linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(239,246,255,0.90))]">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:py-18">
          <div className="flex items-center gap-3 mb-3">
            <Image className="h-5 w-5 text-sky-600" />
            <span className="inline-flex rounded-full border border-sky-200 bg-white/85 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.24em] text-sky-700">IMAGE TOOLS</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 lg:text-5xl">图片处理</h1>
          <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-600">
            图生图、参考图改图、风格迁移、图片增强。通过统一 API 调用，也可在在线生图工作台中直接使用。
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {tools.map((t) => (
            <div key={t.name} className="rounded-[20px] border border-slate-200/80 bg-white p-6 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <t.icon className="h-6 w-6 text-sky-600" />
                  <strong className="text-base text-slate-950">{t.name}</strong>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                  t.badge.includes("待") ? "bg-amber-50 text-amber-700 border border-amber-200" :
                  t.badge.includes("可用") || t.badge.includes("MVP") ? "bg-sky-50 text-sky-700 border border-sky-200" :
                  "bg-emerald-50 text-emerald-700 border border-emerald-200"
                }`}>{t.badge}</span>
              </div>
              <p className="text-sm text-slate-500 leading-6">{t.desc}</p>
              {t.model && <p className="text-xs text-slate-400 font-mono">模型：{t.model}</p>}
              {t.usage && (
                <div className="bg-slate-950 rounded-xl p-4 mt-1 overflow-x-auto">
                  <pre className="text-xs text-emerald-300 leading-relaxed"><code>{t.usage}</code></pre>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="rounded-[20px] border border-sky-200 bg-[linear-gradient(135deg,_rgba(239,246,255,0.95),_rgba(255,255,255,0.98))] p-8 text-center">
          <h2 className="text-xl font-extrabold text-slate-950 mb-2">在线生图工作台</h2>
          <p className="text-sm text-slate-500 mb-5 max-w-md mx-auto">图生图和文生图统一入口，选模型、写提示词、上传参考图，一步到位。</p>
          <a href="/zh/studio" className="inline-flex h-11 px-6 items-center gap-2 rounded-full bg-sky-600 text-white text-sm font-bold hover:bg-sky-700 transition">
            前往在线生图 <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
