"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ArrowRight, BookOpen, Search, FileText, BarChart3 } from "lucide-react";

const tools = [
  {
    id: "prompts",
    name: "Yao Open Prompts",
    icon: BookOpen,
    desc: "200+ AI prompts for content, GEO, marketing, design, and development. Search by category and copy directly.",
    href: "/tools/yao-open-prompts/",
    badge: "Prompt Library",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    id: "geo",
    name: "Yao GEO Skills",
    icon: Search,
    desc: "Generative Engine Optimization toolkit: audits, tracking, brand graphs, content refinement. Full GEO pipeline.",
    href: "/tools/yao-geo-skills/",
    badge: "GEO Pipeline",
    color: "text-teal-600",
    bg: "bg-teal-50",
  },
  {
    id: "audit",
    name: "Qianxi GEO Audit",
    icon: BarChart3,
    desc: "Complete GEO audit report for qianxi-api.com. Identifies 7 critical issues and provides actionable fixes.",
    href: "/zh/tools/audit",
    badge: "Site Audit",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
];

const features = [
  {
    title: "Prompt Library",
    desc: "200+ community prompts organized by category: content creation, GEO, marketing, AI image generation, learning, and more.",
  },
  {
    title: "GEO Pipeline",
    desc: "End-to-end GEO workflow: audit, knowledge base building, content refinement, title optimization, and ranking tracking.",
  },
  {
    title: "Site Audit",
    desc: "Qianxi-specific GEO diagnosis: score by dimension, critical issues, and prioritized action items.",
  },
];

export default function ToolsPage() {
  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 md:px-6 py-6">
      <div className="mb-8">
        <Badge className="mb-3">SEO / GEO TOOLS</Badge>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">
          SEO & GEO Tools
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Open-source SEO/GEO tools powered by Yao community. Prompts, audits, brand graphs, and content optimization.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-10">
        {tools.map((tool) => (
          <a
            key={tool.id}
            href={tool.href}
            className="group rounded-2xl border p-5 no-underline transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
          >
            <div className={`inline-flex rounded-lg ${tool.bg} px-2.5 py-1 text-xs font-bold ${tool.color} mb-3`}>
              {tool.badge}
            </div>
            <div className="flex items-center gap-2 mb-2">
              <tool.icon className={`h-4 w-4 ${tool.color}`} />
              <h3 className="text-lg font-bold">{tool.name}</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-6 mb-3">{tool.desc}</p>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:underline">
              Open <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </a>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-10">
        {features.map((f) => (
          <Card key={f.title} className="p-5">
            <h3 className="font-extrabold mb-2">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-6">{f.desc}</p>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-4 w-4 text-primary" />
          <h2 className="text-lg font-extrabold">About These Tools</h2>
        </div>
        <p className="text-sm text-muted-foreground leading-6">
          These are community-maintained open-source tools from github.com/yaojingang. The Prompt Library contains 200+ prompts for AI-powered content creation, marketing, and GEO. The GEO Skills toolkit provides full pipeline support for Generative Engine Optimization. Both tools are served as static pages within the Qianxi ecosystem.
        </p>
      </Card>
    </div>
  );
}
