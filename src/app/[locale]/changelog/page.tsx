"use client";

import { Clock } from "lucide-react";

const changelog = [
  {
    date: "2026-07-07", title: "模型管理后台增强 + 部署修复",
    items: [
      "模型管理后台 v2：开关切换、展示价 vs 计费价对照、备份管理含恢复",
      "新增 /api/admin/model-config 代理端点，支持 PUT 更新、POST 恢复",
      "导航栏新增「SEO 工具」入口",
      "SEO 工具页、图片处理页、接入文档页 UI 统一为蓝金设计风格",
      "systemd 接管 qianxi-app 服务，修复 nohup 游离进程导致 58,327 次重启 loop",
      "CI/CD 改用 systemctl restart，确保部署后正确切换进程",
      "清理旧 mystic-ai-mvp 僵尸进程，释放 37MB 内存（可用 443MB）",
    ],
  },
  {
    date: "2026-07-02", title: "统一前端上线",
    items: [
      "全新 Next.js 统一前端替代旧 Astro 站点",
      "模型广场页：18 个模型 × 4 分类，含价格和状态标识",
      "模型定价页：三级价格卡片 + 场景推荐",
      "在线生图页：iframe 集成完整 Studio 工作台",
      "API Key 登录：支持输入 Key 验证后保存到本地",
      "接入文档页：Codex / Claude Code / Cherry Studio 配置指南",
      "图片处理页：图生图、风格迁移、背景移除工具说明",
      "更新日志页：版本历史记录（本页）",
      "服务器部署：swap + systemd 保活 + Nginx 精准路由",
    ],
  },
  {
    date: "2026-07-01", title: "GEO 诊断 + 302 模板搭建",
    items: [
      "GEO 全景诊断报告修复（6 个 P0 全部上线）",
      "基于 302_starter 搭建统一前端框架（Next.js 15 + Tailwind + Radix UI）",
      "品牌替换：Logo、导航、Footer、SEO 常量",
      "分享码机制去除，改为本地预览模式",
    ],
  },
  {
    date: "2026-06", title: "生图能力扩充",
    items: [
      "Seedream 4.0（豆包/火山）接入，中文商业图稳定可用",
      "通义万相 Turbo / Plus / 图生图 三模型全上线",
      "CogView 4 / 3-Flash（智谱）接入，中文语义理解强项",
      "混元生图 极速版 / 3.0（腾讯）接入，国风审美",
      "模型管理后台（model-admin）上线，可视化配置上游",
      "用户 API Key → /v1/responses sanitizer 兼容层上线",
    ],
  },
  {
    date: "2026-05", title: "基础设施搭建",
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
      <section className="border-b border-sky-100 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.14),_transparent_30%),linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(239,246,255,0.90))]">
        <div className="mx-auto max-w-5xl px-6 py-14 lg:py-18">
          <div className="flex items-center gap-3 mb-3">
            <Clock className="h-5 w-5 text-sky-600" />
            <span className="inline-flex rounded-full border border-sky-200 bg-white/85 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.24em] text-sky-700">CHANGELOG</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 lg:text-5xl">更新日志</h1>
          <p className="mt-3 max-w-2xl text-lg leading-8 text-slate-600">乾羲API 版本更新记录</p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="relative">
          <div className="absolute left-5 top-2 bottom-2 w-px bg-sky-200 hidden sm:block" />
          <div className="space-y-6">
            {changelog.map((entry) => (
              <div key={entry.date} className="relative pl-0 sm:pl-12">
                <div className="hidden sm:flex absolute left-[14px] top-2 h-3 w-3 rounded-full border-2 border-sky-400 bg-white" />
                <div className="rounded-[20px] border border-slate-200/80 bg-white p-6">
                  <div className="flex items-baseline gap-3 mb-3">
                    <span className="text-sm font-extrabold text-sky-600">{entry.date}</span>
                    <h2 className="text-xl font-extrabold text-slate-950">{entry.title}</h2>
                  </div>
                  <ul className="space-y-1.5">
                    {entry.items.map((item, i) => (
                      <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                        <span className="text-sky-400 mt-1 shrink-0">·</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
