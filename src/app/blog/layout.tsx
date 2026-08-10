import type { ReactNode } from "react";

/**
 * Blog layout (static). Sits directly under the static root layout, so every
 * blog page is pre-rendered to real HTML at build time — no Suspense streaming,
 * no RSC flight payload. This is what makes the content crawlable by Baidu.
 */
export default function BlogLayout({ children }: { children: ReactNode }) {
  return <main className="flex grow flex-col bg-white">{children}</main>;
}
