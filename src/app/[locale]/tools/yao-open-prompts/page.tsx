"use client";

export default function YaoOpenPromptsPage() {
  return (
    <div className="flex-1 min-h-[calc(100vh-56px)] bg-slate-50">
      <iframe
        src="/tools/yao-open-prompts/index.html"
        title="Yao Open Prompts"
        className="h-[calc(100vh-56px)] w-full border-0 bg-white"
      />
    </div>
  );
}
