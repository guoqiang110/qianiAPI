"use client";

import { useEffect, useState } from "react";
import { ExternalLink, RefreshCw } from "lucide-react";

export default function ToolPage() {
  const toolSrc = "/tools/yao-open-prompts/index.html";
  const toolName = "Yao Open Prompts";
  const [available, setAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;
    fetch(toolSrc, { method: "HEAD" })
      .then((res) => {
        if (mounted) setAvailable(res.ok);
      })
      .catch(() => {
        if (mounted) setAvailable(false);
      });
    return () => {
      mounted = false;
    };
  }, [toolSrc]);

  if (available === false) {
    return (
      <div className="flex flex-1 items-center justify-center bg-[linear-gradient(180deg,_rgba(248,250,252,0.98),_rgba(239,246,255,0.88))] px-6 py-12">
        <div className="max-w-xl rounded-[24px] border border-sky-200/70 bg-white p-8 text-center shadow-[0_18px_42px_rgba(59,130,246,0.08)]">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sky-50 text-sky-600">
            <ExternalLink className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-extrabold text-slate-950">{toolName} 暂未部署到当前站点</h1>
          <p className="mt-3 text-sm leading-7 text-slate-500">
            这个工具的静态资源当前没有在线上目录中生效，所以 iframe 会返回 404。需要把
            <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-700">public/tools</code>
            一起部署到站点。
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <a
              href={toolSrc}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-sky-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-sky-700"
            >
              <ExternalLink className="h-4 w-4" />尝试直接打开
            </a>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 transition hover:border-sky-200 hover:text-sky-700"
            >
              <RefreshCw className="h-4 w-4" />刷新重试
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-[calc(100vh-56px)] bg-slate-50">
      <iframe
        src={toolSrc}
        title={toolName}
        className="h-[calc(100vh-56px)] w-full border-0 bg-white"
      />
    </div>
  );
}