import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex-1 flex items-center justify-center py-32 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.06),_transparent_30%),linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(248,250,252,0.96))]">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-sky-500 mx-auto" />
        <p className="mt-4 text-sm text-slate-500 font-medium">加载中...</p>
      </div>
    </div>
  );
}
