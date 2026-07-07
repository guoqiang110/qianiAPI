"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Download,
  Sparkles,
  Clock,
  Upload,
  X,
  BookmarkPlus,
  Trash2,
  Images,
  Wand2,
} from "lucide-react";

type CatalogModel = {
  id: string;
  name: string;
  badge?: string;
  provider: string;
  description?: string;
  enabled?: boolean;
};

type SessionRecord = {
  model: string;
  prompt: string;
  status: "success" | "error";
  message?: string;
  time: string;
  hasRef?: boolean;
};

type LibraryItem = {
  id: string;
  image: string;
  model: string;
  prompt: string;
  size: string;
  createdAt: string;
};

const IMAGE_EDIT_MODELS = new Set(["wanx2.1-imageedit"]);
const LIBRARY_STORAGE_KEY = "qianxi_image_library";
const PROMPT_PRESETS = [
  { label: "电商主图", prompt: "一款高端护肤品放在纯净浅色背景上，柔和棚拍光线，商业电商主图风格，真实质感，高清细节" },
  { label: "海报视觉", prompt: "未来感品牌海报，中心主体突出，强对比灯光，电影级构图，精致排版留白，商业广告风格" },
  { label: "国风插画", prompt: "中国传统审美国风插画，山水云雾，细腻笔触，雅致配色，高级感构图" },
  { label: "角色设定", prompt: "年轻女性角色设定图，完整半身，服装细节丰富，统一人物风格，高质量概念设计" },
];

function normalizeCatalogModel(input: unknown): CatalogModel | null {
  if (!input || typeof input !== "object") return null;

  const raw = input as Record<string, unknown>;
  const id = typeof raw.id === "string" ? raw.id : "";
  if (!id) return null;

  return {
    id,
    name: typeof raw.name === "string" && raw.name ? raw.name : id,
    provider:
      typeof raw.provider === "string" && raw.provider
        ? raw.provider
        : "乾羲适配层",
    badge: typeof raw.badge === "string" ? raw.badge : undefined,
    description:
      typeof raw.description === "string" ? raw.description : undefined,
    enabled: raw.enabled === false ? false : true,
  };
}

function extractImageUrls(payload: unknown): string[] {
  if (!payload || typeof payload !== "object") return [];

  const data = payload as Record<string, unknown>;
  const items = Array.isArray(data.data)
    ? data.data
    : Array.isArray(data.images)
      ? data.images
      : [];

  return items
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const record = item as Record<string, unknown>;
      if (typeof record.b64_json === "string" && record.b64_json) {
        return `data:image/png;base64,${record.b64_json}`;
      }
      return typeof record.url === "string" ? record.url : null;
    })
    .filter((item): item is string => Boolean(item));
}

function loadLibrary(): LibraryItem[] {
  try {
    const stored = window.localStorage.getItem(LIBRARY_STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed)
      ? parsed.filter(
          (item): item is LibraryItem =>
            !!item &&
            typeof item === "object" &&
            typeof item.id === "string" &&
            typeof item.image === "string" &&
            typeof item.model === "string" &&
            typeof item.prompt === "string" &&
            typeof item.size === "string" &&
            typeof item.createdAt === "string"
        )
      : [];
  } catch {
    return [];
  }
}

function persistLibrary(items: LibraryItem[]) {
  try {
    window.localStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(items));
  } catch {}
}

function isCnImageModel(model: string) {
  return /wanx|cogview|seedream|hy-image|hunyuan/i.test(model);
}

function isImageEditModel(model: string) {
  return IMAGE_EDIT_MODELS.has(model);
}

export default function StudioPage() {
  const [catalog, setCatalog] = useState<CatalogModel[]>([]);
  const [sessionHistory, setSessionHistory] = useState<SessionRecord[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [library, setLibrary] = useState<LibraryItem[]>([]);
  const [status, setStatus] = useState("加载生图工作台...");
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState(
    "一只可爱的柴犬在樱花树下奔跑，阳光透过花瓣洒落，柔和高清摄影风格"
  );
  const [model, setModel] = useState("");
  const [size, setSize] = useState("1024x1024");
  const [quality, setQuality] = useState("standard");
  const [count, setCount] = useState("1");
  const [apiKey, setApiKey] = useState("");
  const [refImage, setRefImage] = useState<string | null>(null);
  const [refImageName, setRefImageName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeModel = useMemo(
    () => catalog.find((item) => item.id === model),
    [catalog, model]
  );
  const showRefImage = isImageEditModel(model);
  const groupedCatalog = useMemo(() => {
    return {
      openai: catalog.filter((item) => /gpt|gemini/i.test(item.id)),
      domestic: catalog.filter((item) => /seedream|wanx|cogview|hy-image|hunyuan/i.test(item.id)),
    };
  }, [catalog]);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("qianxi_api_key");
      if (stored) setApiKey(stored);
    } catch {}
    setLibrary(loadLibrary());
  }, []);

  useEffect(() => {
    try {
      if (apiKey) {
        window.localStorage.setItem("qianxi_api_key", apiKey);
      }
    } catch {}
  }, [apiKey]);

  useEffect(() => {
    fetch("/api/cn-image/model-config")
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(
            (data as { error?: { message?: string }; message?: string }).error
              ?.message ||
              (data as { message?: string }).message ||
              `HTTP ${response.status}`
          );
        }
        return data;
      })
      .then((cfg) => {
        const rawModels = Array.isArray((cfg as { models?: unknown[] }).models)
          ? ((cfg as { models?: unknown[] }).models ?? [])
          : [];
        const models = rawModels
          .map(normalizeCatalogModel)
          .filter(
            (item): item is CatalogModel =>
              item !== null && item.enabled !== false
          );

        setCatalog(models);
        if (models.length) {
          setModel((current) =>
            current && models.some((item) => item.id === current)
              ? current
              : models[0].id
          );
          setStatus("工作台已就绪，选择模型并输入提示词开始生图。");
        } else {
          setModel("");
          setStatus("当前没有可用模型，请检查上游配置。");
        }
      })
      .catch((err) =>
        setStatus("加载模型目录失败：" + (err?.message || "unknown"))
      );
  }, []);

  useEffect(() => {
    if (!showRefImage && refImage) {
      setRefImage(null);
      setRefImageName("");
    }
  }, [showRefImage, refImage]);

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setStatus("图片不能超过 10MB");
      return;
    }

    setRefImageName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      const base64 = result.includes(",") ? result.split(",")[1] : result;
      setRefImage(base64);
      setStatus(`已加载参考图：${file.name}`);
    };
    reader.onerror = () => setStatus("读取图片失败");
    reader.readAsDataURL(file);
  }

  function clearRefImage() {
    setRefImage(null);
    setRefImageName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function saveToLibrary(image: string) {
    const item: LibraryItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      image,
      model,
      prompt: prompt.trim(),
      size,
      createdAt: new Date().toLocaleString(),
    };

    setLibrary((prev) => {
      const next = [item, ...prev].slice(0, 100);
      persistLibrary(next);
      return next;
    });
    setStatus("已保存到作品库");
  }

  function removeLibraryItem(id: string) {
    setLibrary((prev) => {
      const next = prev.filter((item) => item.id !== id);
      persistLibrary(next);
      return next;
    });
    setStatus("已从作品库删除");
  }

  function clearLibrary() {
    setLibrary([]);
    persistLibrary([]);
    setStatus("作品库已清空");
  }

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim()) return;
    if (!model) {
      setStatus("请先选择模型");
      return;
    }
    if (showRefImage && !refImage) {
      setStatus("图生图模型需要上传参考图");
      return;
    }

    setLoading(true);
    setStatus("正在生成图片...");

    try {
      const payload: Record<string, unknown> = {
        model,
        prompt: prompt.trim(),
        n: Number(count) || 1,
        size,
        quality,
      };
      if (refImage) payload.image = refImage;

      const endpoint = isCnImageModel(model)
        ? "/api/cn-image/generations"
        : "/v1/images/generations";

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (apiKey && !isCnImageModel(model)) {
        headers.Authorization = `Bearer ${apiKey}`;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(
          data?.error?.message || data?.message || `HTTP ${response.status}`
        );
      }

      const nextImages = extractImageUrls(data);
      if (!nextImages.length) {
        throw new Error("返回成功但没有图片数据");
      }

      setImages(nextImages);
      setSessionHistory((prev) => [
        {
          model,
          prompt: prompt.trim(),
          status: "success",
          time: new Date().toLocaleString(),
          hasRef: !!refImage,
        },
        ...prev.slice(0, 19),
      ]);
      setStatus(`生成完成：${nextImages.length} 张 · ${model}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "生图失败";
      setStatus(msg);
      setSessionHistory((prev) => [
        {
          model,
          prompt: prompt.trim(),
          status: "error",
          message: msg,
          time: new Date().toLocaleString(),
          hasRef: !!refImage,
        },
        ...prev.slice(0, 19),
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-1">
      <section className="border-b border-sky-100 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.16),_transparent_30%),linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(239,246,255,0.90))]">
        <div className="mx-auto max-w-7xl px-4 md:px-6 py-8 lg:py-10">
      <div className="max-w-3xl">
        <Badge className="mb-3 border border-sky-200 bg-white/85 text-sky-700 shadow-none">QIANXI IMAGE STUDIO</Badge>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 mb-3 lg:text-5xl">
          在线生图工作台
        </h1>
        <p className="text-base leading-7 text-slate-600 max-w-3xl">
          支持 GPT Image 2、Seedream、万相、CogView、混元等模型。国内模型走乾羲适配层，OpenAI 系模型需提供 API Key。
        </p>
      </div>

    </div>
  </section>
  <div className="mx-auto max-w-7xl px-4 md:px-6 py-6 lg:py-8">
      <section className="grid lg:grid-cols-[380px_minmax(0,1fr)] gap-6">
        <aside className="rounded-[24px] border border-slate-200/80 bg-[linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(248,250,252,0.98))] p-5 h-fit lg:sticky lg:top-20 space-y-4 shadow-[0_18px_48px_rgba(148,163,184,0.10)]">
          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="space-y-2">
              <Label>提示词模板</Label>
              <div className="flex flex-wrap gap-2">
                {PROMPT_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setPrompt(preset.prompt)}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-600 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
                  >
                    <Wand2 className="inline-block h-3 w-3 mr-1" />{preset.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="prompt">提示词</Label>
              <Textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-24 resize-none text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">模型</Label>
              <select
                id="model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full h-10 rounded-md border bg-background px-3 text-sm"
              >
                {catalog.length === 0 ? (
                  <option value="">加载中...</option>
                ) : (
                  catalog.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            {showRefImage && (
              <div className="space-y-2">
                <Label>参考图</Label>
                {refImage ? (
                  <div className="relative overflow-hidden rounded-lg border border-primary/15 bg-gradient-to-br from-primary/10 via-background to-accent/50">
                    <div className="aspect-video relative">
                      <Image
                        src={`data:image/png;base64,${refImage}`}
                        alt="参考图"
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                    <button
                      type="button"
                      onClick={clearRefImage}
                      className="absolute top-2 right-2 rounded-full border border-border/70 bg-background/90 p-1 shadow-sm transition-colors hover:border-primary/30 hover:bg-background"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <p className="text-xs text-muted-foreground px-3 pb-2 truncate">
                      {refImageName}
                    </p>
                  </div>
                ) : (
                  <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-primary/30 bg-primary/5 p-6 text-sm text-muted-foreground transition-colors hover:border-primary hover:bg-primary/10">
                    <Upload className="h-5 w-5" />
                    点击上传参考图
                    <span className="text-xs">
                      PNG / JPG / WebP，最大 10MB
                    </span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 rounded-xl border border-slate-200/80 bg-slate-50/80 px-3 py-2 text-[11px] text-slate-500">
                当前建议：先用 1 张 + standard 出草案，满意后再提高数量或质量。
              </div>
              <div className="space-y-2">
                <Label htmlFor="size">尺寸</Label>
                <select
                  id="size"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-full h-10 rounded-md border bg-background px-3 text-sm"
                >
                  <option value="1024x1024">1024x1024</option>
                  <option value="1536x1024">1536x1024</option>
                  <option value="1024x1536">1024x1536</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quality">质量</Label>
                <select
                  id="quality"
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  className="w-full h-10 rounded-md border bg-background px-3 text-sm"
                >
                  <option value="standard">standard</option>
                  <option value="high">high</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="count">数量</Label>
              <Input
                id="count"
                type="number"
                min="1"
                max="4"
                value={count}
                onChange={(e) => setCount(e.target.value)}
              />
            </div>

            {!isCnImageModel(model) && (
              <div className="space-y-2">
                <Label htmlFor="apikey">API Key</Label>
                <Input
                  id="apikey"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="text-sm"
                />
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading || !model}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              生成图片
            </Button>
          </form>

          <div className="rounded-xl border border-sky-200/70 bg-[linear-gradient(180deg,_rgba(239,246,255,0.95),_rgba(255,255,255,0.98))] p-3 text-xs text-slate-600 shadow-sm">
            {status}
          </div>
        </aside>

        <main className="space-y-6 min-w-0">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-extrabold">图片结果</h2>
              {activeModel && <Badge variant="secondary">{activeModel.name}</Badge>}
            </div>
            {images.length === 0 ? (
              <div className="flex min-h-[520px] items-center justify-center rounded-[24px] border border-slate-200/80 bg-[linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(248,250,252,0.98))] px-6 text-center text-sm text-slate-500 shadow-[0_18px_48px_rgba(148,163,184,0.10)]">
                还没有图片。输入提示词后点击生成。
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-2 gap-5">
                {images.map((src, i) => (
                  <article
                    key={`${src}-${i}`}
                    className="overflow-hidden rounded-[20px] border border-slate-200/80 bg-white shadow-[0_14px_36px_rgba(148,163,184,0.10)] overflow-hidden"
                  >
                    <div className="relative aspect-[4/4] bg-[linear-gradient(135deg,_rgba(239,246,255,0.95),_rgba(255,255,255,0.98))]">
                      <Image
                        src={src}
                        alt={`生成 ${i + 1}`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="space-y-3 p-4 border-t border-slate-100 text-xs text-slate-500">
                      <div className="flex items-center justify-between gap-3">
                        <span>{model} · {size}</span>
                        <a
                          href={src}
                          download={`qianxi-${Date.now()}-${i + 1}.png`}
                          className="inline-flex items-center gap-1 font-bold text-primary hover:underline"
                        >
                          <Download className="h-3.5 w-3.5" />下载
                        </a>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => saveToLibrary(src)}
                      >
                        <BookmarkPlus className="h-4 w-4 mr-2" />
                        存入作品库
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-3 gap-3">
              <div className="flex items-center gap-2">
                <Images className="h-4 w-4" />
                <h2 className="text-xl font-extrabold">作品库</h2>
                <Badge variant="secondary">{library.length}</Badge>
              </div>
              {library.length > 0 ? (
                <Button type="button" variant="outline" onClick={clearLibrary}>
                  <Trash2 className="h-4 w-4 mr-2" />清空作品库
                </Button>
              ) : null}
            </div>
            {library.length === 0 ? (
              <div className="flex min-h-[260px] items-center justify-center rounded-[20px] border border-slate-200/80 bg-white px-6 text-center text-sm text-slate-500 shadow-[0_14px_36px_rgba(148,163,184,0.08)]">
                作品库还是空的。生成后点击“存入作品库”，刷新页面也不会丢。
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {library.map((item) => (
                  <article
                    key={item.id}
                    className="overflow-hidden rounded-[20px] border border-slate-200/80 bg-white shadow-[0_14px_36px_rgba(148,163,184,0.10)] overflow-hidden"
                  >
                    <div className="relative aspect-[4/4] bg-[linear-gradient(135deg,_rgba(239,246,255,0.95),_rgba(255,255,255,0.98))]">
                      <Image
                        src={item.image}
                        alt={item.prompt}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="space-y-2 p-3 border-t text-xs text-muted-foreground">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-foreground truncate">
                          {item.model}
                        </span>
                        <span>{item.createdAt}</span>
                      </div>
                      <p className="line-clamp-2">{item.prompt}</p>
                      <div className="flex items-center justify-between gap-3">
                        <span>{item.size}</span>
                        <div className="flex items-center gap-3">
                          <a
                            href={item.image}
                            download={`qianxi-library-${item.id}.png`}
                            className="inline-flex items-center gap-1 font-bold text-primary hover:underline"
                          >
                            <Download className="h-3.5 w-3.5" />下载
                          </a>
                          <button
                            type="button"
                            onClick={() => removeLibraryItem(item.id)}
                            className="inline-flex items-center gap-1 font-bold text-red-600 hover:underline"
                          >
                            <Trash2 className="h-3.5 w-3.5" />删除
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

                    <div>
            <h2 className="text-xl font-extrabold mb-3">图片生成模型目录</h2>
            <div className="space-y-5">
              {[
                { key: "domestic", title: "国产模型", desc: "乾羲适配层直连，适合中文商业图与快速交付。", items: groupedCatalog.domestic },
                { key: "openai", title: "OpenAI / Google", desc: "需要上游 API Key，适合高质量创意与通用视觉生成。", items: groupedCatalog.openai },
              ].filter((group) => group.items.length > 0).map((group) => (
                <div key={group.key} className="rounded-[20px] border border-slate-200/80 bg-white p-4 shadow-[0_12px_28px_rgba(148,163,184,0.08)]">
                  <div className="mb-3">
                    <h3 className="text-sm font-extrabold text-slate-950">{group.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">{group.desc}</p>
                  </div>
                  <div className="grid sm:grid-cols-2 xl:grid-cols-2 gap-3">
                    {group.items.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setModel(item.id)}
                        className={`rounded-xl border p-4 text-left transition-colors ${item.id === model ? "border-primary bg-primary/10 ring-1 ring-primary/20 shadow-sm" : "border-border/70 bg-card/90 hover:border-primary/60 hover:bg-primary/5"}`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <strong className="text-sm">{item.name}</strong>
                          {item.badge ? (
                            <Badge
                              variant={item.id === model ? "default" : "secondary"}
                              className={`text-[10px] ${item.id === model ? "" : "bg-secondary text-secondary-foreground"}`}
                            >
                              {item.badge}
                            </Badge>
                          ) : null}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                          {item.description || item.provider}
                        </p>
                        <span className="text-[10px] text-muted-foreground">
                          {item.provider}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {sessionHistory.length > 0 ? (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-4 w-4" />
                <h2 className="text-lg font-extrabold">本次会话记录</h2>
              </div>
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {sessionHistory.slice(0, 20).map((rec, i) => (
                  <div
                    key={`${rec.time}-${i}`}
                    className="rounded-lg border border-border/70 bg-card/80 p-3 text-sm shadow-sm"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${rec.status === "success" ? "bg-primary text-primary-foreground" : "bg-red-100 text-red-700"}`}
                      >
                        {rec.status === "success" ? "成功" : "失败"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {rec.model} · {rec.time}
                      </span>
                      {rec.hasRef ? (
                        <span className="text-[10px] text-muted-foreground">
                          参考图
                        </span>
                      ) : null}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {rec.prompt}
                    </p>
                    {rec.message ? (
                      <p className="text-xs text-red-500 mt-1">{rec.message}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </main>
      </section>
      </div>
    </div>
  );
}




