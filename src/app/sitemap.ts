import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://qianxi-api.com";
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

  return pages.map((path) => ({
    url: `${base}/zh${path}`,
    lastModified: new Date(),
    changeFrequency: (path === "" || path === "/changelog") ? "daily" : "weekly",
    priority: path === "" ? 1 : path === "/models" || path === "/studio" ? 0.9 : 0.7,
  })) as MetadataRoute.Sitemap;
}
