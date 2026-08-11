import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  extractFaq,
  getAllArticles,
  getAllSlugs,
  getArticleBySlug,
  renderMarkdownToHtml,
  toLite,
} from "@/lib/blog";
import BlogDetail from "./BlogDetail";

const SITE = "https://qianxi-api.com";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};

  const url = `/blog/${slug}`;
  return {
    title: `${article.title} | 乾羲API`,
    description: article.description,
    keywords: article.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.description,
      url,
      images: [article.ogImage],
      publishedTime: article.date,
      modifiedTime: article.date,
      authors: [article.author.name],
      siteName: "乾羲API",
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: [article.ogImage],
    },
  };
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const faq = extractFaq(article.content);
  const articleUrl = `${SITE}/blog/${slug}`;
  const html = renderMarkdownToHtml(article.content);

  const related = article.related
    .map((s) => getAllArticles().find((a) => a.slug === s))
    .filter((a): a is NonNullable<typeof a> => a != null)
    .map(toLite);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    author: {
      "@type": "Person",
      name: article.author.name,
      jobTitle: article.author.jobTitle,
    },
    publisher: {
      "@type": "Organization",
      name: "乾羲API",
      url: SITE,
    },
    datePublished: article.date,
    dateModified: article.date,
    mainEntityOfPage: articleUrl,
    image: article.ogImage.startsWith("http")
      ? article.ogImage
      : `${SITE}${article.ogImage}`,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "首页", item: `${SITE}/zh` },
      { "@type": "ListItem", position: 2, name: "博客", item: `${SITE}/blog` },
      { "@type": "ListItem", position: 3, name: article.title, item: articleUrl },
    ],
  };

  const faqLd =
    faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }
      : null;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}

      <BlogDetail
        article={{
          ...toLite(article),
          html,
          ogImage: article.ogImage,
        }}
        related={related}
      />
    </div>
  );
}
