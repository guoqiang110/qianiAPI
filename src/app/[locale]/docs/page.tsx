import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "接入文档 - 乾羲API",
  description: "Codex、Claude Code、Cherry Studio 接入指南",
};

const sections = [
  {
    title: "注册与充值",
    content: (
      <ol className="list-decimal space-y-2 pl-5 text-sm leading-7 text-slate-600">
        <li>访问 <a href="https://qianxi-api.com/console" className="font-bold text-sky-700 hover:underline">控制台</a> 注册账号</li>
        <li>邮箱验证后登录</li>
        <li>在「API Keys」页面创建密钥，格式为 <code className="rounded-md bg-slate-100 px-1.5 py-0.5 text-xs font-semibold text-slate-800">sk-...</code></li>
        <li>支付宝充值，按量计费</li>
      </ol>
    ),
  },
  {
    title: "API Key 使用",
    content: (
      <pre className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800">
        <code>Authorization: Bearer sk-yourapikeyhere</code>
      </pre>
    ),
  },
  {
    title: "图片生成 API",
    content: (
      <div className="space-y-4">
        <pre className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800">
          <code>{`POST https://qianxi-api.com/api/cn-image/generations
Content-Type: application/json
Authorization: Bearer sk-...

{
  "model": "gpt-image-2",
  "prompt": "一只柯基在草地上奔跑",
  "size": "1024x1024"
}`}</code>
        </pre>
        <p className="text-sm leading-7 text-slate-600">
          文生图和图生图统一入口。支持模型：GPT Image 2、Seedream 4.0、通义万相 Turbo/Plus/图生图、CogView 4/3-Flash、混元生图。
        </p>
        <div className="flex flex-wrap gap-3">
          <a href="/zh/pricing" className="inline-flex h-10 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-800 no-underline transition hover:border-sky-200 hover:text-sky-700">查看定价</a>
          <a href="/zh/studio" className="inline-flex h-10 items-center rounded-xl bg-slate-950 px-4 text-sm font-bold text-white no-underline transition hover:opacity-90">在线生图</a>
        </div>
      </div>
    ),
  },
  {
    title: "LLM API（OpenAI 兼容）",
    content: (
      <pre className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800">
        <code>{`Base URL: https://qianxi-api.com/v1
API Key: sk-...
Model: gpt-5.5 / claude-sonnet-4-20250514 / deepseek-v4-flash`}</code>
      </pre>
    ),
  },
  {
    title: "Codex 配置",
    content: (
      <pre className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800">
        <code>{`Base URL: https://qianxi-api.com/v1
API Key: sk-...
Model: gpt-5.5`}</code>
      </pre>
    ),
  },
  {
    title: "Claude Code",
    content: (
      <pre className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800">
        <code>{`ANTHROPIC_BASE_URL=https://qianxi-api.com
ANTHROPIC_AUTH_TOKEN=sk-...`}</code>
      </pre>
    ),
  },
  {
    title: "Cherry Studio",
    content: (
      <ol className="list-decimal space-y-2 pl-5 text-sm leading-7 text-slate-600">
        <li>新增 OpenAI 兼容服务</li>
        <li>地址：<code className="rounded-md bg-slate-100 px-1.5 py-0.5 text-xs font-semibold text-slate-800">https://qianxi-api.com/v1</code></li>
        <li>密钥：<code className="rounded-md bg-slate-100 px-1.5 py-0.5 text-xs font-semibold text-slate-800">sk-...</code></li>
      </ol>
    ),
  },
  {
    title: "常见问题",
    content: (
      <div className="space-y-3">
        {[
          { q: "401 Unauthorized", a: <>确认 <code className="rounded-md bg-slate-100 px-1 py-0.5 text-xs font-semibold text-slate-800">sk-...</code> 格式完整，Bearer 后有空格。</> },
          { q: "模型不可用", a: "在控制台检查该模型的 API Key 权限是否已开通。部分模型需单独配置上游。" },
          { q: "生图超时", a: "图片生成模型可能需要 5-30 秒，建议客户端超时设为 120 秒。" },
        ].map(faq => (
          <div key={faq.q} className="rounded-xl border border-slate-200 bg-white p-4">
            <strong className="text-sm text-slate-950">{faq.q}</strong>
            <p className="mt-1 text-sm leading-7 text-slate-600">{faq.a}</p>
          </div>
        ))}
      </div>
    ),
  },
];

export default function Page() {
  return (
    <div className="flex-1">
      {/* hero */}
      <section className="border-b border-sky-100 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.14),_transparent_30%),linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(239,246,255,0.90))]">
        <div className="mx-auto max-w-5xl px-6 py-12 lg:py-16">
          <span className="inline-flex rounded-full border border-sky-200 bg-white/85 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.24em] text-sky-700">DOCS</span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-950 lg:text-5xl">接入文档</h1>
          <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-600">
            Codex · Claude Code · Cherry Studio · OpenAI 兼容客户端
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6 py-10 space-y-6">
        {sections.map(s => (
          <section key={s.title} className="rounded-[22px] border border-slate-200/80 bg-[linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(248,250,252,0.98))] p-6">
            <h2 className="text-lg font-extrabold text-slate-950 mb-4">{s.title}</h2>
            {s.content}
          </section>
        ))}

        <p className="text-center text-sm text-slate-400 pt-6">客服：qianxiapi@163.com</p>
      </div>
    </div>
  );
}
