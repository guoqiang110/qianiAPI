import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const findings = {
  critical: [
    "12 API SEO landing pages all return 404",
    "Model card links point to /models/undefined",
    "sitemap.xml shows 'New API' not 'Qianxi API'",
    "No Schema.org JSON-LD on entire site",
    "No About page / security page",
  ],
  major: [
    "Docs page content is very thin (722 chars)",
    "Image tools page content thin (357 chars)",
    "VID/AUD/DOC/RAG categories show '0 models'",
    "GitHub link points to placeholder repo",
    "No customer cases, media coverage, or Baidu Baike",
  ],
  good: [
    "Pricing page has clear 3-tier structure",
    "Model badge statuses are clear",
    "Navigation structure is clean",
    "Full HTTPS coverage",
    "robots.txt is correct",
  ],
};

export default function AuditPage() {
  return (
    <div className="flex-1 max-w-4xl mx-auto px-4 md:px-6 py-6">
      <div className="mb-8">
        <Badge className="mb-3">GEO AUDIT · 2026-07-01</Badge>
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">
          Qianxi API GEO Audit
        </h1>
        <p className="text-sm text-muted-foreground">
          Comprehensive Generative Engine Optimization diagnosis for qianxi-api.com.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        {[
          ["Indexability", "Good", "bg-green-50 text-green-700"],
          ["Brand Entity", "Medium", "bg-amber-50 text-amber-700"],
          ["Structured Data", "Missing", "bg-red-50 text-red-700"],
        ].map(([dim, score, cls]) => (
          <Card key={dim} className="p-4 text-center">
            <div className="text-xs text-muted-foreground mb-1">{dim}</div>
            <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${cls}`}>
              {score}
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-5 mb-6">
        <h2 className="text-lg font-extrabold text-red-600 mb-4">Critical Issues</h2>
        <ul className="space-y-2 text-sm">
          {findings.critical.map((f, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-red-500 font-bold mt-0.5">x</span>
              {f}
            </li>
          ))}
        </ul>
      </Card>

      <Card className="p-5 mb-6">
        <h2 className="text-lg font-extrabold text-amber-600 mb-4">Major Issues</h2>
        <ul className="space-y-2 text-sm">
          {findings.major.map((f, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-amber-500 font-bold mt-0.5">!</span>
              {f}
            </li>
          ))}
        </ul>
      </Card>

      <Card className="p-5">
        <h2 className="text-lg font-extrabold text-green-600 mb-4">What's Working</h2>
        <ul className="space-y-2 text-sm">
          {findings.good.map((f, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-green-500 font-bold mt-0.5">+</span>
              {f}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
