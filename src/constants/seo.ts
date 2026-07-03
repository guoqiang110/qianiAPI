export type SEOData = {
  supportLanguages: string[];
  fallbackLanguage: string;
  languages: Record<
    string,
    { title: string; description: string; image: string }
  >;
};

export const SEO_DATA: SEOData = {
  supportLanguages: ["zh", "en", "ja"],
  fallbackLanguage: "zh",
  languages: {
    zh: {
      title: "乾羲API — 统一 AI 模型网关",
      description: "一套 API Key，调用 GPT、Claude、Seedream、万相、混元等全部模型。在线生图 + API 接入一站式。",
      image: "/images/global/desc_zh.png",
    },
    en: {
      title: "Qianxi API — Unified AI Model Gateway",
      description: "One API key for GPT, Claude, Seedream, Wanxiang, Hunyuan and more. Image generation + API access in one place.",
      image: "/images/global/desc_en.png",
    },
    ja: {
      title: "乾羲API — 統合AIモデルゲートウェイ",
      description: "1つのAPIキーでGPT、Claude、Seedream、万象、混元など全モデルにアクセス。画像生成とAPIアクセスを一括提供。",
      image: "/images/global/desc_ja.png",
    },
  },
};