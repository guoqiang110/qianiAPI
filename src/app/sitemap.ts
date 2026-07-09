import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://qianxi-api.com";
  const locales = ["zh", "en", "ja"];
  const pages = [
    "",
    "/models",
    "/pricing",
    "/studio",
    "/docs",
    "/image-tools",
    "/tools",
    "/tools/audit",
    "/changelog",
    "/agent",
    "/auth",
    "/console",
  ];

  const entries: MetadataRoute.Sitemap = [];
  for (const locale of locales) {
    for (const path of pages) {
      entries.push({
        url: `${base}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: (path === "" || path === "/changelog") ? "daily" as const : "weekly" as const,
        priority: path === "" ? 1 : path === "/models" || path === "/studio" ? 0.9 : 0.7,
      });
    }
  }
  return entries;
}