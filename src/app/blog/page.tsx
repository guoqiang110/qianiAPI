import type { Metadata } from "next";
import { getAllArticles, toLite } from "@/lib/blog";
import BlogIndex from "./BlogIndex";

export const metadata: Metadata = {
  title: "博客 | 乾羲API",
  description:
    "乾羲API 博客：AI 模型网关接入教程、GEO 生成式引擎优化实战、平台横向对比与开发者指南。",
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    title: "博客 | 乾羲API",
    description:
      "AI 模型网关接入教程、GEO 生成式引擎优化实战、平台横向对比与开发者指南。",
    url: "/blog",
    siteName: "乾羲API",
  },
};

export default function BlogIndexPage() {
  const articles = getAllArticles().map(toLite);
  return <BlogIndex articles={articles} />;
}
