import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '接入文档 - 乾羲API',
  description: 'Codex、Claude Code、Cherry Studio 接入指南',
};

const sections = [
  {
    title: "注册与充值",
    content: (
      <ol className="list-decimal pl-5 space-y-1 text-sm">
        <li>访问 <a href="https://qianxi-api.com/console" className="text-primary font-bold hover:underline">控制台</a> 注册账号</li>
        <li>邮箱验证后登录</li>
        <li>在「API Keys」页面创建密钥，格式为 <code className="bg-muted px-1.5 py-0.5 rounded text-xs">sk-...</code></li>
        <li>支付宝充值，按量计费</li>
      </ol>
    ),
  },
  {
    title: "API Key 使用",
    content: (
      <pre className="bg-muted/50 border rounded-lg p-4 text-sm overflow-x-auto">
        <code>Authorization: Bearer sk-yourapikeyhere</code>
      </pre>
    ),
  },
  {
    title: "图片生成 API",
    content: (
      <div className="space-y-3">
        <pre className="bg-muted/50 border rounded-lg p-4 text-sm overflow-x-auto">
          <code>{`POST https://qianxi-api.com/api/cn-image/generations
Content-Type: application/json
Authorization: Bearer sk-...

{
  "model": "gpt-image-2",
  "prompt": "一只柯基在草地上奔跑",
  "size": "1024x1024"
}`}</code>
        </pre>
        <p className="text-sm text-muted-foreground">
          文生图和图生图统一入口。支持模型：GPT Image 2、Seedream 4.0、通义万相 Turbo/Plus/图生图、CogView 4/3-Flash、混元生图。
        </p>
        <div className="flex gap-2">
          <a href="/zh/pricing" className="inline-flex h-9 px-4 items-center rounded-lg border text-sm font-bold hover:border-primary">查看定价</a>
          <a href="/zh/studio" className="inline-flex h-9 px-4 items-center rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:opacity-90">在线生图</a>
        </div>
      </div>
    ),
  },
  {
    title: "LLM API（OpenAI 兼容）",
    content: (
      <pre className="bg-muted/50 border rounded-lg p-4 text-sm overflow-x-auto">
        <code>{`Base URL: https://qianxi-api.com/v1
API Key: sk-...
Model: gpt-5.5 / claude-sonnet-4-20250514 / deepseek-v4-flash`}</code>
      </pre>
    ),
  },
  {
    title: "Codex 配置",
    content: (
      <pre className="bg-muted/50 border rounded-lg p-4 text-sm overflow-x-auto">
        <code>{`Base URL: https://qianxi-api.com/v1
API Key: sk-...
Model: gpt-5.5`}</code>
      </pre>
    ),
  },
  {
    title: "Claude Code",
    content: (
      <pre className="bg-muted/50 border rounded-lg p-4 text-sm overflow-x-auto">
        <code>{`ANTHROPIC_BASE_URL=https://qianxi-api.com
ANTHROPIC_AUTH_TOKEN=sk-...`}</code>
      </pre>
    ),
  },
  {
    title: "Cherry Studio",
    content: (
      <ol className="list-decimal pl-5 space-y-1 text-sm">
        <li>新增 OpenAI 兼容服务</li>
        <li>地址：<code className="bg-muted px-1.5 py-0.5 rounded text-xs">https://qianxi-api.com/v1</code></li>
        <li>密钥：<code className="bg-muted px-1.5 py-0.5 rounded text-xs">sk-...</code></li>
      </ol>
    ),
  },
  {
    title: "常见问题",
    content: (
      <div className="space-y-3">
        <div className="border rounded-lg p-4">
          <strong className="text-sm">401 Unauthorized</strong>
          <p className="text-sm text-muted-foreground mt-1">确认 <code className="bg-muted px-1 py-0.5 rounded text-xs">sk-...</code> 格式完整，Bearer 后有空格。</p>
        </div>
        <div className="border rounded-lg p-4">
          <strong className="text-sm">模型不可用</strong>
          <p className="text-sm text-muted-foreground mt-1">在控制台检查该模型的 API Key 权限是否已开通。部分模型需单独配置上游。</p>
        </div>
        <div className="border rounded-lg p-4">
          <strong className="text-sm">生图超时</strong>
          <p className="text-sm text-muted-foreground mt-1">图片生成模型可能需要 5-30 秒，建议客户端超时设为 120 秒。</p>
        </div>
      </div>
    ),
  },
];

export default function Page() {
  return (
    <div className="flex-1 max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center gap-2 mb-2">
        <span className="px-3 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-extrabold uppercase tracking-wider">DOCS</span>
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight mb-2">接入文档</h1>
      <p className="text-muted-foreground text-lg mb-8">Codex · Claude Code · Cherry Studio · OpenAI 兼容客户端</p>

      <div className="space-y-5">
        {sections.map((s) => (
          <section key={s.title} className="border rounded-xl p-6 bg-background">
            <h2 className="text-lg font-extrabold mb-3">{s.title}</h2>
            {s.content}
          </section>
        ))}
      </div>

      <p className="text-center text-sm text-muted-foreground mt-10">
        客服：qianxiapi@163.com
      </p>
    </div>
  );
}