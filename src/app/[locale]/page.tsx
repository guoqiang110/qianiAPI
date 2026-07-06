"use client";

const categories = [
  {
    icon: "LLM",
    name: "语言大模型",
    items: ["OpenAI", "Anthropic", "Gemini", "DeepSeek", "Qwen"],
    href: "/zh/models",
    tone: {
      card: "border-sky-200 bg-[linear-gradient(180deg,_rgba(240,249,255,0.96),_rgba(255,255,255,0.98))] hover:border-sky-300 hover:shadow-[0_20px_48px_rgba(59,130,246,0.16)]",
      chip: "bg-sky-100 text-sky-700",
      link: "group-hover:text-sky-700",
    },
  },
  {
    icon: "IMG",
    name: "图片生成",
    items: ["GPT Image", "Seedream", "万相", "CogView", "混元"],
    href: "/zh/models",
    tone: {
      card: "border-violet-200 bg-[linear-gradient(180deg,_rgba(245,243,255,0.96),_rgba(255,255,255,0.98))] hover:border-violet-300 hover:shadow-[0_20px_48px_rgba(139,92,246,0.16)]",
      chip: "bg-violet-100 text-violet-700",
      link: "group-hover:text-violet-700",
    },
  },
  {
    icon: "EDIT",
    name: "图片处理",
    items: ["图生图", "背景移除", "放大修复"],
    href: "/zh/image-tools",
    tone: {
      card: "border-emerald-200 bg-[linear-gradient(180deg,_rgba(236,253,245,0.96),_rgba(255,255,255,0.98))] hover:border-emerald-300 hover:shadow-[0_20px_48px_rgba(16,185,129,0.14)]",
      chip: "bg-emerald-100 text-emerald-700",
      link: "group-hover:text-emerald-700",
    },
  },
  {
    icon: "VID",
    name: "视频生成",
    items: ["Seedance", "Sora", "即梦", "Luma"],
    href: "/zh/models",
    tone: {
      card: "border-amber-200 bg-[linear-gradient(180deg,_rgba(255,251,235,0.96),_rgba(255,255,255,0.98))] hover:border-amber-300 hover:shadow-[0_20px_48px_rgba(245,158,11,0.14)]",
      chip: "bg-amber-100 text-amber-700",
      link: "group-hover:text-amber-700",
    },
  },
  {
    icon: "AUD",
    name: "音频处理",
    items: ["TTS", "ASR", "可灵"],
    href: "/zh/models",
    tone: {
      card: "border-rose-200 bg-[linear-gradient(180deg,_rgba(255,241,242,0.96),_rgba(255,255,255,0.98))] hover:border-rose-300 hover:shadow-[0_20px_48px_rgba(244,63,94,0.14)]",
      chip: "bg-rose-100 text-rose-700",
      link: "group-hover:text-rose-700",
    },
  },
  {
    icon: "DOC",
    name: "信息处理",
    items: ["文档解析", "数据分析", "RAG"],
    href: "/zh/models",
    tone: {
      card: "border-slate-300 bg-[linear-gradient(180deg,_rgba(248,250,252,0.98),_rgba(255,255,255,0.98))] hover:border-slate-400 hover:shadow-[0_20px_48px_rgba(100,116,139,0.14)]",
      chip: "bg-slate-100 text-slate-700",
      link: "group-hover:text-slate-700",
    },
  },
];

const highlights = [
  { title: "模型广场", desc: "统一浏览模型能力、上游来源与调用方式", href: "/zh/models", badge: "API", tone: "border-sky-200 bg-sky-50/80 text-sky-700 hover:border-sky-300 hover:shadow-[0_22px_50px_rgba(37,99,235,0.12)]" },
  { title: "在线生图", desc: "GPT Image 2、Seedream、万相、混元同屏工作台", href: "/zh/studio", badge: "热门", tone: "border-violet-200 bg-violet-50/80 text-violet-700 hover:border-violet-300 hover:shadow-[0_22px_50px_rgba(124,58,237,0.12)]" },
  { title: "模型定价", desc: "展示价与真实计费价逐步同步，方便销售对外报价", href: "/zh/pricing", badge: "定价", tone: "border-amber-200 bg-amber-50/80 text-amber-700 hover:border-amber-300 hover:shadow-[0_22px_50px_rgba(217,119,6,0.12)]" },
  { title: "图像工具", desc: "图生图、修复、背景移除集中到一个入口", href: "/zh/image-tools", badge: "工具", tone: "border-emerald-200 bg-emerald-50/80 text-emerald-700 hover:border-emerald-300 hover:shadow-[0_22px_50px_rgba(5,150,105,0.12)]" },
  { title: "接入文档", desc: "面向 Codex、Claude Code、Cherry Studio 的接入说明", href: "/zh/docs", badge: "文档", tone: "border-cyan-200 bg-cyan-50/80 text-cyan-700 hover:border-cyan-300 hover:shadow-[0_22px_50px_rgba(8,145,178,0.12)]" },
  { title: "SEO 工具", desc: "Prompt 库 · GEO 诊断 · 内容优化工具链", href: "/zh/tools", badge: "SEO", tone: "border-rose-200 bg-rose-50/80 text-rose-700 hover:border-rose-300 hover:shadow-[0_22px_50px_rgba(225,29,72,0.12)]" },
  { title: "控制台", desc: "充值、API Key、用量日志与模型配置后台", href: "/console", badge: "账户", tone: "border-slate-300 bg-slate-50/90 text-slate-700 hover:border-slate-400 hover:shadow-[0_22px_50px_rgba(71,85,105,0.12)]" },
];

const stats = [
  { value: "100+", label: "可调模型与能力" },
  { value: "4", label: "稳定生图链路" },
  { value: "1 Key", label: "统一鉴权接入" },
  { value: "24/7", label: "在线工作台可用" },
];

const workflows = [
  {
    title: "设计师生图",
    desc: "从提示词到出图、再到作品库沉淀，适合高频视觉生产。",
  },
  {
    title: "开发者聚合调用",
    desc: "统一 API 兼容多上游，减少切换供应商和单独接入成本。",
  },
  {
    title: "企业模型运营",
    desc: "把模型定价、渠道能力和控制台配置逐步收敛到主站。",
  },
];

export default function Home() {
  return (
    <div className="flex-1">
      <section className="relative overflow-hidden border-b border-border/60 bg-[radial-gradient(circle_at_top_left,_rgba(24,119,242,0.22),_transparent_34%),linear-gradient(180deg,_rgba(255,255,255,0.98)_0%,_rgba(239,246,255,0.94)_58%,_rgba(255,255,255,0.98)_100%)]">
        <div className="absolute inset-x-0 top-0 h-64 bg-[linear-gradient(90deg,_rgba(59,130,246,0.16),_rgba(14,165,233,0.06),_transparent)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-18 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:items-center lg:py-24">
          <div>
            <span className="inline-flex items-center rounded-full border border-sky-200 bg-white/85 px-3 py-1 text-xs font-semibold text-sky-700 shadow-sm">
              乾羲 AI Gateway
            </span>
            <h1 className="mt-5 max-w-3xl text-5xl font-extrabold tracking-tight text-slate-950 lg:text-6xl">
              一个入口，统一调度 AI 模型与在线生图能力
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 lg:text-xl">
              乾羲 API 面向设计师、开发者与企业团队，提供统一 Key、统一计费和统一工作台。
              现在重点推进生图板块独立化，再逐步把控制台与模型运营能力收回主站。
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="/zh/studio"
                className="inline-flex h-12 items-center rounded-lg bg-[hsl(var(--primary))] px-6 text-sm font-semibold text-white no-underline shadow-[0_16px_40px_rgba(37,99,235,0.22)] transition hover:-translate-y-0.5 hover:opacity-95"
              >
                进入生图工作台
              </a>
              <a
                href="/zh/models"
                className="inline-flex h-12 items-center rounded-lg border border-sky-200 bg-white px-6 text-sm font-semibold text-slate-800 no-underline shadow-sm transition hover:border-sky-400 hover:text-sky-700"
              >
                查看模型广场
              </a>
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((item) => (
                <div key={item.label} className="rounded-xl border border-white/70 bg-white/82 px-4 py-4 shadow-[0_14px_40px_rgba(148,163,184,0.12)] backdrop-blur">
                  <div className="text-2xl font-bold text-slate-950">{item.value}</div>
                  <div className="mt-1 text-sm text-slate-500">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-sky-100 bg-slate-950 p-5 text-white shadow-[0_30px_80px_rgba(15,23,42,0.22)]">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <div className="text-sm font-semibold text-sky-300">工作台状态</div>
                <div className="mt-1 text-xl font-bold">在线生图链路稳定运行</div>
              </div>
              <span className="rounded-full bg-emerald-500/18 px-3 py-1 text-xs font-semibold text-emerald-300">
                Running
              </span>
            </div>
            <div className="mt-5 space-y-3">
              {[
                ["GPT Image 2", "稳定可用"],
                ["Seedream 4.0", "工作台已打通"],
                ["万相 2.1", "国内链路稳定"],
                ["混元生图", "按上游适配接入"],
              ].map(([name, status]) => (
                <div key={name} className="flex items-center justify-between rounded-xl border border-white/8 bg-white/5 px-4 py-3">
                  <div>
                    <div className="text-sm font-semibold text-white">{name}</div>
                    <div className="text-xs text-slate-400">{status}</div>
                  </div>
                  <div className="h-2.5 w-2.5 rounded-full bg-sky-400" />
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-xl border border-sky-400/20 bg-sky-400/10 px-4 py-4">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">当前重点</div>
              <p className="mt-2 text-sm leading-6 text-slate-200">
                主站正在从宣传页升级为产品入口，后续把生图、模型定价、文档和控制台体验做统一收口。
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-sky-700">模型能力矩阵</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">按能力分组，而不是按供应商割裂</h2>
          </div>
          <a href="/zh/models" className="text-sm font-semibold text-slate-500 no-underline hover:text-sky-700">
            查看全部模型
          </a>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((cat) => (
            <a
              key={cat.name}
              href={cat.href}
              className={`group rounded-2xl border p-5 no-underline shadow-[0_14px_36px_rgba(148,163,184,0.10)] transition hover:-translate-y-1 ${cat.tone.card}`}
            >
              <div className="flex items-center justify-between">
                <span className={`rounded-lg px-2.5 py-1 text-xs font-bold ${cat.tone.chip}`}>{cat.icon}</span>
                <span className="text-xs text-slate-400">分类入口</span>
              </div>
              <h3 className={`mt-4 text-lg font-bold text-slate-950 ${cat.tone.link}`}>{cat.name}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{cat.items.join(" · ")}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="border-y border-border/60 bg-[linear-gradient(180deg,_rgba(239,246,255,0.92),_rgba(248,250,252,0.96))]">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <p className="text-sm font-semibold text-sky-700">重点入口</p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-3xl font-bold tracking-tight text-slate-950">先把高频动作做好，再扩展后台能力</h2>
            <p className="max-w-2xl text-sm leading-6 text-slate-500">
              现在的主站目标不是展示信息，而是把用户最常用的动作直接放到第一层入口。
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {highlights.map((item) => (
              <a
                key={item.title}
                href={item.href}
                className={`group rounded-2xl border bg-white p-5 no-underline shadow-[0_16px_36px_rgba(148,163,184,0.10)] transition hover:-translate-y-0.5 ${item.tone}`}
              >
                <span className="inline-flex rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-semibold">
                  {item.badge}
                </span>
                <h3 className="mt-4 text-lg font-bold text-slate-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{item.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-2xl border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_24px_60px_rgba(15,23,42,0.18)]">
            <p className="text-sm font-semibold text-sky-300">使用场景</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">围绕真实工作流组织产品结构</h2>
            <div className="mt-6 space-y-4">
              {workflows.map((item, index) => (
                <div key={item.title} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs font-semibold text-sky-300">0{index + 1}</div>
                  <div className="mt-1 text-lg font-semibold text-white">{item.title}</div>
                  <div className="mt-2 text-sm leading-6 text-slate-300">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_14px_36px_rgba(148,163,184,0.10)] sm:col-span-2">
              <p className="text-sm font-semibold text-sky-700">产品方向</p>
              <h3 className="mt-2 text-2xl font-bold text-slate-950">主站、工作台、控制台逐步合一</h3>
              <p className="mt-3 text-sm leading-7 text-slate-500">
                第一阶段先把生图入口与模型信息做强；第二阶段把定价、配置、代理与渠道能力收进控制台；第三阶段再考虑完整运营后台与增长工具链。
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-sky-50 p-6 shadow-[0_14px_30px_rgba(125,211,252,0.12)]">
              <div className="text-sm font-semibold text-sky-700">面向客户</div>
              <div className="mt-3 text-xl font-bold text-slate-950">设计师 / 开发者 / 企业团队</div>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                用同一套平台解决生图生产、API 接入和模型运营三类需求。
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_14px_30px_rgba(148,163,184,0.10)]">
              <div className="text-sm font-semibold text-slate-500">当前状态</div>
              <div className="mt-3 text-xl font-bold text-slate-950">生图链路优先，体验持续迭代</div>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                先保证核心出图稳定，再逐步处理价格展示、后台整合和模型管理能力。
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

