import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '更新日志 - 乾羲API',
  description: '乾羲API 版本更新记录',
};

const changelog = [
  {
    date: "2026-07-02",
    title: "统一前端上线",
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
    date: "2026-07-01",
    title: "GEO 诊断 + 302 模板搭建",
    items: [
      "GEO 全景诊断报告修复（6 个 P0 全部上线）",
      "基于 302_starter 搭建统一前端框架（Next.js 15 + Tailwind + Radix UI）",
      "品牌替换：Logo、导航、Footer、SEO 常量",
      "分享码机制去除，改为本地预览模式",
    ],
  },
  {
    date: "2026-06",
    title: "生图能力扩充",
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
    date: "2026-05",
    title: "基础设施搭建",
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
    <div className="flex-1 max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center gap-2 mb-2">
        <span className="px-3 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-extrabold uppercase tracking-wider">CHANGELOG</span>
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight mb-2">更新日志</h1>
      <p className="text-muted-foreground text-lg mb-8">乾羲API 版本更新记录</p>

      <div className="space-y-8">
        {changelog.map((entry) => (
          <div key={entry.date} className="border-l-2 border-primary pl-6">
            <div className="flex items-baseline gap-3 mb-3">
              <span className="text-sm font-extrabold text-primary">{entry.date}</span>
              <h2 className="text-xl font-extrabold">{entry.title}</h2>
            </div>
            <ul className="space-y-1.5">
              {entry.items.map((item, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary mt-1 shrink-0">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}