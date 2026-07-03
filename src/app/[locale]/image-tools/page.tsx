import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '图片处理 - 乾羲API',
  description: '图生图、参考图改图、图片增强',
};

const tools = [
  {
    icon: "🖼",
    name: "图生图 / 改图",
    model: "wanx2.1-imageedit",
    badge: "MVP",
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
    icon: "🔍",
    name: "图片放大 / 修复",
    model: "规划中",
    badge: "待接入",
    desc: "低分辨率图片 AI 超分放大，老照片修复，去噪去模糊。",
    usage: null,
  },
  {
    icon: "🎨",
    name: "风格迁移",
    model: "wanx2.1-imageedit",
    badge: "可用",
    desc: "将照片转为插画、油画、水彩、二次元等多种风格。通过图生图 + 风格描述提示词实现。",
    usage: null,
  },
  {
    icon: "✂️",
    name: "背景移除",
    model: "规划中",
    badge: "待接入",
    desc: "一键移除图片背景，输出透明 PNG。适合电商白底图和素材抠图。",
    usage: null,
  },
];

export default function Page() {
  return (
    <div className="flex-1 max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center gap-2 mb-2">
        <span className="px-3 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-extrabold uppercase tracking-wider">IMAGE TOOLS</span>
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight mb-2">图片处理</h1>
      <p className="text-muted-foreground text-lg mb-8 max-w-2xl">
        图生图、参考图改图、风格迁移、图片增强。通过统一 API 调用，也可在在线生图中直接使用。
      </p>

      {/* Tool cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        {tools.map((t) => (
          <div key={t.name} className="border rounded-xl p-6 bg-background flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{t.icon}</span>
                <strong className="text-base">{t.name}</strong>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded font-extrabold ${
                t.badge.includes("待") ? "bg-amber-50 text-amber-700" :
                t.badge.includes("可用") || t.badge.includes("MVP") ? "bg-blue-50 text-blue-700" :
                "bg-emerald-50 text-emerald-700"
              }`}>{t.badge}</span>
            </div>
            <p className="text-sm text-muted-foreground">{t.desc}</p>
            {t.model && <p className="text-xs text-muted-foreground font-mono">模型：{t.model}</p>}
            {t.usage && (
              <pre className="bg-muted/50 border rounded-lg p-3 text-xs overflow-x-auto mt-2">
                <code>{t.usage}</code>
              </pre>
            )}
          </div>
        ))}
      </div>

      {/* Quick link to studio */}
      <div className="border rounded-xl p-6 bg-primary/5 text-center">
        <h2 className="text-lg font-extrabold mb-2">在线生图工作台</h2>
        <p className="text-sm text-muted-foreground mb-4">图生图和文生图统一入口，选模型、写提示词、上传参考图，一步到位。</p>
        <a href="/zh/studio" className="inline-flex h-10 px-5 items-center rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:opacity-90">
          前往在线生图 →
        </a>
      </div>
    </div>
  );
}