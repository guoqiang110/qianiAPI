import type { MetadataRoute } from "next";
import { BLOG_SLUGS } from "@/lib/blog-slugs";

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
  // Blog (Chinese / zh only — content is China-focused SEO)
  for (const slug of BLOG_SLUGS) {
    entries.push({
      url: `${base}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }
  entries.push({
    url: `${base}/zh/blog`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.8,
  });

  return entries;
}