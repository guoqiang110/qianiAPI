"use client";

import { Clock, Rocket, Palette, Shield, Wrench, Zap } from "lucide-react";

const changelog = [
  {
    date: "2026-07-07", title: "全站 302 风格化 + 计费价实时同步",
    icon: Palette, color: "from-violet-400 to-purple-500",
    items: [
      "计费价同步：定价页 + 模型广场接入 /api/cn-image/billing-prices，每个模型旁显示「已同步」或「待更新」徽章",
      "代理页：四个统计卡片差异化配色（紫/绿/琥珀/蓝），提现日期中文格式化",
      "控制台页：左上角从返回链接改为乾羲 logo 主位",
      "图片处理页：渐变卡片 + 可折叠 API 代码示例 + 规划中工具接入进度提示",
      "接入文档页：8 个分区卡片带彩色左侧边框 + 顶部锚点快速导航",
      "认证页：乾羲品牌风格化，渐变背景 + 卡片式表单",
    ],
  },
  {
    date: "2026-07-06", title: "SEO 工具上线 + 模型管理增强",
    icon: Wrench, color: "from-sky-400 to-blue-500",
    items: [
      "SEO/GEO 工具中心页上线（Yao Open Prompts + Yao GEO Skills）",
      "模型管理后台 v2：展示价 vs 计费价对照、备份管理含恢复",
      "新增 /api/admin/model-config 代理端点，支持 PUT 更新、POST 恢复",
      "导航栏新增「SEO 工具」入口",
      "systemd 接管 qianxi-app 服务，修复 nohup 游离进程",
      "CI/CD 改用 systemctl restart，确保部署后正确切换进程",
    ],
  },
  {
    date: "2026-07-02", title: "统一前端上线",
    icon: Rocket, color: "from-emerald-400 to-teal-500",
    items: [
      "全新 Next.js 统一前端替代旧 Astro 站点",
      "模型广场页：18 个模型 × 4 分类，含价格和状态标识",
      "模型定价页：三级价格卡片 + 场景推荐",
      "在线生图页：iframe 集成完整 Studio 工作台",
      "API Key 登录：支持输入 Key 验证后保存到本地",
      "接入文档页：Codex / Claude Code / Cherry Studio 配置指南",
      "图片处理页：图生图、风格迁移、工具说明",
      "服务器部署：swap + systemd 保活 + Nginx 精准路由",
    ],
  },
  {
    date: "2026-07-01", title: "GEO 诊断 + 302 模板搭建",
    icon: Shield, color: "from-amber-400 to-orange-500",
    items: [
      "GEO 全景诊断报告修复（6 个 P0 全部上线）",
      "基于 302_starter 搭建统一前端框架（Next.js 15 + Tailwind + Radix UI）",
      "品牌替换：Logo、导航、Footer、SEO 常量",
      "分享码机制去除，改为本地预览模式",
    ],
  },
  {
    date: "2026-06", title: "生图能力扩充",
    icon: Zap, color: "from-rose-400 to-pink-500",
    items: [
      "Seedream 4.0（豆包/火山）接入，中文商业图稳定可用",
      "通义万相 Turbo / Plus / 图生图 三模型全上线",
      "CogView 4 / 3-Flash（智谱）接入，中文语义理解强项",
      "混元生图 极速版 / 3.0（腾讯）接入，国风审美",
      "模型管理后台上线，可视化配置上游",
      "用户 API Key → /v1/responses sanitizer 兼容层上线",
    ],
  },
  {
    date: "2026-05", title: "基础设施搭建",
    icon: Shield, color: "from-slate-400 to-slate-600",
    items: [
      "乾羲API 主站上线（qianxi-api.com）",
      "New-API 网关部署，OpenAI 兼容 /v1 接口",
      "GPT Image 2 接入，验证统一 API 网关可行性",
      "Astro 文档站 + 定价页 + 模型页上线",
      "支付宝充值集成（epay）",
      "代理邀请 + 返佣体系初版",
    ],
  },
];

export default function Page() {
  return (
    <div className="flex-1">
      <section className="border-b border-sky-100 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.16),_transparent_30%),linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(239,246,255,0.90))]">
        <div className="mx-auto max-w-5xl px-6 py-14 lg:py-18">
          <div className="flex items-center gap-3 mb-3">
            <Clock className="h-5 w-5 text-sky-600" />
            <span className="inline-flex rounded-full border border-sky-200 bg-white/85 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.24em] text-sky-700">CHANGELOG</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 lg:text-5xl">更新日志</h1>
          <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-600">乾羲API 版本更新记录</p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6 py-10 bg-[linear-gradient(180deg,_rgba(248,250,252,0.98),_rgba(239,246,255,0.68))]">
        <div className="relative">
          <div className="absolute left-[22px] top-3 bottom-3 w-0.5 bg-gradient-to-b from-sky-200 via-violet-200 to-slate-200 hidden sm:block rounded-full" />
          <div className="space-y-8">
            {changelog.map((entry) => (
              <div key={entry.date} className="relative pl-0 sm:pl-14">
                {/* timeline dot */}
                <div className={`hidden sm:flex absolute left-[18px] top-3 h-[10px] w-[10px] rounded-full bg-gradient-to-br ${entry.color} ring-4 ring-white shadow-sm`} />
                {/* card */}
                <div className={`rounded-[22px] border border-slate-200/80 p-6 bg-[linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(248,250,252,0.98))] transition-all hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-[0_16px_40px_rgba(59,130,246,0.08)]`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${entry.color} text-white`}>
                      <entry.icon className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-400">{entry.date}</span>
                      <h2 className="text-lg font-extrabold text-slate-950">{entry.title}</h2>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {entry.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600 leading-7">
                        <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400/80" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* footer */}
        <div className="mt-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-[11px] font-bold text-slate-400">
            <Clock className="h-3.5 w-3.5" />
            乾羲API 持续迭代中
          </span>
        </div>
      </div>
    </div>
  );
}
