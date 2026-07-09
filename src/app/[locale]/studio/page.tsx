"use client";

import {
  useEffect, useMemo, useRef, useState } from "react";
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
  ArrowLeft,
  Wand2,
  ZoomIn,
  Filter,
  Globe,
  Minus,
  Plus,
  Maximize,
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

type LibraryMode = "local" | "cloud";

const IMAGE_EDIT_MODELS = new Set(["wanx2.1-imageedit"]);
const LIBRARY_STORAGE_KEY = "qianxi_image_library";
const PROMPT_PRESETS = [
  { label: "电商主图", prompt: "一款高端护肤品放在纯净浅色背景上，柔和棚拍光线，商业电商主图风格，真实质感，高清细节" },
  { label: "海报视觉", prompt: "未来感品牌海报，中心主体突出，强对比灯光，电影级构图，精致排版留白，商业广告风格" },
  { label: "国风插画", prompt: "中国传统审美国风插画，山水云雾，细腻笔触，雅致配色，高级感构图" },
  { label: "角色设定", prompt: "年轻女性角色设定图，完整半身，服装细节丰富，统一人物风格，高质量概念设计" },
];
const PROMPT_PRESETS_EN = [
  { label: "Product Shot", prompt: "A premium skincare product on clean light backdrop, soft studio lighting, e-commerce hero shot, photorealistic, high detail" },
  { label: "Poster", prompt: "Futuristic brand poster, strong central subject, dramatic lighting, cinematic composition, clean typography space, commercial ad style" },
  { label: "Illustration", prompt: "Traditional ink wash illustration style, misty mountains, delicate brushwork, elegant color palette, sophisticated composition" },
  { label: "Character", prompt: "Young female character design sheet, full half-body, detailed costume, consistent art style, high quality concept art" },
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

function mergeLibraryItem(items: LibraryItem[], incoming: LibraryItem[]) {
  return [...incoming, ...items].slice(0, 100);
}

function normalizeLibraryItem(input: unknown): LibraryItem | null {
  if (!input || typeof input !== "object") return null;

  const raw = input as Record<string, unknown>;
  if (
    typeof raw.id !== "string" ||
    typeof raw.image !== "string" ||
    typeof raw.model !== "string" ||
    typeof raw.prompt !== "string"
  ) {
    return null;
  }

  return {
    id: raw.id,
    image: raw.image,
    model: raw.model,
    prompt: raw.prompt,
    size: typeof raw.size === "string" ? raw.size : "",
    createdAt:
      typeof raw.createdAt === "string"
        ? raw.createdAt
        : new Date().toISOString(),
  };
}

function mapLibraryItems(raw: unknown): LibraryItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(normalizeLibraryItem).filter((item: unknown): item is LibraryItem => item !== null);
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
  const [libraryMode, setLibraryMode] = useState<LibraryMode>("local");
  const [libraryBusy, setLibraryBusy] = useState(false);
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [libraryFilter, setLibraryFilter] = useState<string>("all");
  const [librarySort, setLibrarySort] = useState<"newest" | "oldest" | "model">("newest");
  const [selectedLibraryItems, setSelectedLibraryItems] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);
  const [promptLang, setPromptLang] = useState<"zh" | "en">("zh");
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
  const libraryModels = useMemo(
    () => Array.from(new Set(library.map((item) => item.model))),
    [library]
  );
  const filteredLibrary = useMemo(() => {
    if (libraryFilter === "all") return library;
    return library.filter((item) => item.model === libraryFilter);
  }, [library, libraryFilter]);

  function getBadgeClass(badge?: string) {
    if (!badge) return "bg-slate-100 text-slate-600 border-slate-200";
    if (/稳定|available/i.test(badge)) return "border-emerald-200 bg-emerald-50 text-emerald-700";
    if (/mvp/i.test(badge)) return "border-violet-200 bg-violet-50 text-violet-700";
    if (/未开通|占位|暂不/i.test(badge)) return "border-amber-200 bg-amber-50 text-amber-700";
    return "border-sky-200 bg-sky-50 text-sky-700";
  }

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("qianxi_api_key");
      if (stored) setApiKey(stored);
    } catch {}
    setLibrary(loadLibrary());
  }, []);

  async function loadCloudLibrary(key: string) {
    const response = await fetch("/api/studio-assets", {
      headers: { Authorization: `Bearer ${key}` },
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(
        data?.error?.message || data?.error || data?.message || `HTTP ${response.status}`
      );
    }
    const next = Array.isArray(data?.data)
      ? mapLibraryItems(data.data)
      : [];
    setLibrary(next);
    persistLibrary(next);
    setLibraryMode("cloud");
  }

  useEffect(() => {
    try {
      if (apiKey) {
        window.localStorage.setItem("qianxi_api_key", apiKey);
      }
    } catch {}
  }, [apiKey]);

  useEffect(() => {
    if (!apiKey) {
      setLibrary(loadLibrary());
      setLibraryMode("local");
      return;
    }

    let cancelled = false;
    setLibraryBusy(true);

    loadCloudLibrary(apiKey)
      .then(() => {
        if (!cancelled) {
          setStatus("已连接云端作品库。生成结果可跨设备保留。");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLibrary(loadLibrary());
          setLibraryMode("local");
          setStatus("云端作品库不可用，已回退到本地作品库。");
        }
      })
      .finally(() => {
        if (!cancelled) setLibraryBusy(false);
      });

    return () => {
      cancelled = true;
    };
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

  async function saveToLibrary(image: string) {
    const item: LibraryItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      image,
      model,
      prompt: prompt.trim(),
      size,
      createdAt: new Date().toISOString(),
    };

    function saveLocally(message: string) {
      setLibrary((prev) => {
        const next = mergeLibraryItem(prev, [item]);
        persistLibrary(next);
        return next;
      });
      setLibraryMode("local");
      setStatus(message);
    }

    if (!apiKey || libraryMode === "local") {
      saveLocally("已保存到本地作品库");
      return;
    }

    setLibraryBusy(true);
    try {
      const response = await fetch("/api/studio-assets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(item),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(
          data?.error?.message || data?.error || data?.message || `HTTP ${response.status}`
        );
      }
      const next = Array.isArray(data?.data)
        ? mapLibraryItems(data.data)
        : [item, ...library].slice(0, 100);
      setLibrary(next);
      persistLibrary(next);
      setLibraryMode("cloud");
      setStatus("已保存到云端作品库");
    } catch (error) {
      const reason = error instanceof Error ? error.message : "unknown";
      saveLocally(`保存到云端失败，已转存到本地作品库：${reason}`);
    } finally {
      setLibraryBusy(false);
    }
  }

  async function removeLibraryItem(id: string) {
    if (!apiKey || libraryMode === "local") {
      setLibrary((prev) => {
        const next = prev.filter((item) => item.id !== id);
        persistLibrary(next);
        return next;
      });
      setStatus("已从本地作品库删除");
      return;
    }

    setLibraryBusy(true);
    try {
      const response = await fetch(`/api/studio-assets/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(
          data?.error?.message || data?.error || data?.message || `HTTP ${response.status}`
        );
      }
      const next = Array.isArray(data?.data)
        ? mapLibraryItems(data.data)
        : library.filter((item) => item.id !== id);
      setLibrary(next);
      persistLibrary(next);
      setStatus("已从云端作品库删除");
    } catch (error) {
      setStatus(`删除失败：${error instanceof Error ? error.message : "unknown"}`);
    } finally {
      setLibraryBusy(false);
    }
  }

  function toggleLibrarySelect(id: string) {
    const next = new Set(selectedLibraryItems);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedLibraryItems(next);
  }
  function selectAllLibrary() {
    if (selectedLibraryItems.size === filteredLibrary.length) {
      setSelectedLibraryItems(new Set());
    } else {
      setSelectedLibraryItems(new Set(filteredLibrary.map((i) => i.id)));
    }
  }
  async function batchDeleteSelected() {
    const ids = selectedLibraryItems;
    if (!ids.size) return;

    if (!apiKey || libraryMode === "local") {
      setLibrary((prev) => {
        const next = prev.filter((item) => !ids.has(item.id));
        persistLibrary(next);
        return next;
      });
      setSelectedLibraryItems(new Set());
      setStatus("已批量删除本地作品");
      return;
    }

    setLibraryBusy(true);
    try {
      for (const id of ids) {
        await fetch(`/api/studio-assets/${encodeURIComponent(id)}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${apiKey}` },
        });
      }
      await loadCloudLibrary(apiKey);
      setSelectedLibraryItems(new Set());
      setStatus("已批量删除云端作品");
    } catch (error) {
      setStatus(`批量删除失败：${error instanceof Error ? error.message : "unknown"}`);
    } finally {
      setLibraryBusy(false);
    }
  }

  async function clearLibrary() {
    if (!apiKey || libraryMode === "local") {
      setLibrary([]);
      persistLibrary([]);
      setStatus("本地作品库已清空");
      return;
    }

    setLibraryBusy(true);
    try {
      const response = await fetch("/api/studio-assets", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(
          data?.error?.message || data?.error || data?.message || `HTTP ${response.status}`
        );
      }
      setLibrary([]);
      persistLibrary([]);
      setStatus("云端作品库已清空");
    } catch (error) {
      setStatus(`清空失败：${error instanceof Error ? error.message : "unknown"}`);
    } finally {
      setLibraryBusy(false);
    }
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
    <div className="flex flex-1 flex-col overflow-hidden">
      <header className="flex items-center justify-between border-b border-sky-200/70 bg-[linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(239,246,255,0.78))] px-6 py-3 backdrop-blur shadow-[0_6px_18px_rgba(59,130,246,0.06)]">
        <a href="/zh" className="flex items-center gap-3 rounded-full bg-white/60 px-3 py-1.5 text-xs font-bold text-slate-600 shadow-sm transition hover:bg-sky-50 hover:text-sky-700">
          <ArrowLeft className="h-3.5 w-3.5" />返回乾羲主站
        </a>
        <div className="flex items-center gap-3">
          <div className="h-5 w-px bg-sky-200" />
          <Image src="/logo.png" alt="乾羲" width={28} height={28} className="rounded-md" />
          <span className="text-sm font-extrabold text-slate-900">乾羲生图</span>
          <Badge className="border border-sky-200 bg-sky-50 text-[10px] text-sky-700 shadow-none">V2.0</Badge>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-slate-500">{activeModel ? activeModel.name : "选择模型开始创作"}</span>
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        </div>
      </header>

      <div className="flex-1 overflow-auto bg-[linear-gradient(180deg,_rgba(248,250,252,0.98),_rgba(239,246,255,0.68))]">
        <div className="mx-auto max-w-7xl px-4 py-4 md:px-6 lg:py-6">
        <section className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
          <aside className="h-fit space-y-4 rounded-[28px] border border-white/70 bg-[linear-gradient(160deg,_rgba(255,255,255,0.98),_rgba(224,242,254,0.96)_28%,_rgba(237,233,254,0.96)_62%,_rgba(254,249,195,0.78))] p-5 shadow-[0_28px_70px_rgba(59,130,246,0.16)] lg:sticky lg:top-20">
            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,_rgba(14,165,233,0.14),_rgba(168,85,247,0.12))] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-sky-700">模板工具</div>
                  <div className="inline-flex rounded-full border border-white/80 bg-white/70 p-1 shadow-[0_8px_20px_rgba(59,130,246,0.10)] backdrop-blur">
                    <button
                      type="button"
                      onClick={() => setPromptLang("zh")}
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold transition ${promptLang === "zh" ? "bg-sky-600 text-white" : "text-slate-500 hover:text-sky-700"}`}
                    >
                      <Globe className="h-3 w-3" />中文
                    </button>
                    <button
                      type="button"
                      onClick={() => setPromptLang("en")}
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold transition ${promptLang === "en" ? "bg-sky-600 text-white" : "text-slate-500 hover:text-sky-700"}`}
                    >
                      <Globe className="h-3 w-3" />EN
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(promptLang === "zh" ? PROMPT_PRESETS : PROMPT_PRESETS_EN).map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setPrompt(preset.prompt)}
                      className="rounded-full border border-white/80 bg-white/85 px-3 py-1.5 text-[11px] font-bold text-slate-600 shadow-sm transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700"
                    >
                      <Wand2 className="mr-1 inline-block h-3 w-3" />
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,_rgba(59,130,246,0.12),_rgba(245,158,11,0.12))] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-sky-700">Prompt</div>
                <Textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-24 resize-none rounded-2xl border-white/70 bg-white/72 text-sm shadow-[0_10px_24px_rgba(59,130,246,0.08)] backdrop-blur placeholder:text-slate-400 focus-visible:ring-sky-300"
                />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,_rgba(168,85,247,0.12),_rgba(59,130,246,0.12))] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-violet-700">Model</div>
                <select
                  id="model"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="h-11 w-full rounded-2xl border border-white/70 bg-white/78 px-3 text-sm shadow-[0_10px_24px_rgba(59,130,246,0.08)] backdrop-blur"
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
                  <div className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,_rgba(168,85,247,0.12),_rgba(59,130,246,0.10))] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-violet-700">参考图</div>
                  {refImage ? (
                    <div className="relative overflow-hidden rounded-2xl border border-white/70 bg-[linear-gradient(135deg,_rgba(255,255,255,0.88),_rgba(224,242,254,0.74),_rgba(237,233,254,0.66))] shadow-[0_12px_28px_rgba(59,130,246,0.10)] backdrop-blur">
                      <div className="relative aspect-video">
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
                        className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/60 bg-black/35 text-white backdrop-blur transition hover:bg-black/50"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <div className="border-t border-white/60 px-3 py-2">
                        <p className="truncate text-xs font-medium text-slate-500">{refImageName}</p>
                      </div>
                    </div>
                  ) : (
                    <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-violet-200/80 bg-[linear-gradient(135deg,_rgba(245,243,255,0.9),_rgba(255,255,255,0.98),_rgba(224,242,254,0.78))] p-6 text-sm text-slate-500 shadow-[0_10px_24px_rgba(139,92,246,0.08)] transition hover:border-violet-300 hover:text-violet-700">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-sm">
                        <Upload className="h-5 w-5 text-violet-600" />
                      </div>
                      <span className="font-bold text-slate-700">点击上传参考图</span>
                      <span className="text-xs text-slate-400">PNG / JPG / WebP，最大 10MB</span>
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

              <div className="space-y-3">
                <div className="rounded-2xl border border-white/70 bg-[linear-gradient(135deg,_rgba(255,255,255,0.72),_rgba(254,249,195,0.72),_rgba(219,234,254,0.72))] px-3 py-2 text-[11px] text-slate-700 shadow-[0_10px_24px_rgba(245,158,11,0.10)] backdrop-blur">
                  当前建议：先用 1 张 + standard 出草案，满意后再提高数量或质量。
                </div>

                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,_rgba(59,130,246,0.12),_rgba(45,212,191,0.12))] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-sky-700">Size</div>
                  <div className="grid grid-cols-3 gap-2">
                    {["1024x1024", "1536x1024", "1024x1536"].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setSize(option)}
                        className={
                          size === option
                            ? "rounded-xl border border-sky-300 bg-sky-600 px-3 py-2 text-xs font-extrabold text-white shadow-[0_10px_24px_rgba(59,130,246,0.20)]"
                            : "rounded-xl border border-white/70 bg-white/78 px-3 py-2 text-xs font-bold text-slate-600 shadow-[0_10px_24px_rgba(59,130,246,0.08)] hover:border-sky-200 hover:text-sky-700 transition"
                        }
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,_rgba(245,158,11,0.12),_rgba(236,72,153,0.10))] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-amber-700">Quality</div>
                  <div className="grid grid-cols-2 gap-2">
                    {["standard", "high"].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setQuality(option)}
                        className={
                          quality === option
                            ? "rounded-xl border border-amber-300 bg-amber-500 px-3 py-2 text-xs font-extrabold text-white shadow-[0_10px_24px_rgba(245,158,11,0.18)]"
                            : "rounded-xl border border-white/70 bg-white/78 px-3 py-2 text-xs font-bold text-slate-600 shadow-[0_10px_24px_rgba(59,130,246,0.08)] hover:border-amber-200 hover:text-amber-700 transition"
                        }
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,_rgba(34,197,94,0.12),_rgba(59,130,246,0.10))] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-700">Count</div>
                  <div className="flex items-center justify-between rounded-2xl border border-white/70 bg-white/78 px-3 py-2 shadow-[0_10px_24px_rgba(59,130,246,0.08)] backdrop-blur">
                    <button
                      type="button"
                      onClick={() => setCount(String(Math.max(1, (Number(count) || 1) - 1)))}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-emerald-200 hover:text-emerald-700"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <div className="text-center">
                      <div className="text-lg font-extrabold text-slate-950">{count}</div>
                      <div className="text-[10px] text-slate-400">1 - 4 张</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCount(String(Math.min(4, (Number(count) || 1) + 1)))}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-emerald-200 hover:text-emerald-700"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {!isCnImageModel(model) && (
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,_rgba(168,85,247,0.12),_rgba(245,158,11,0.12))] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-violet-700">API Key</div>
                  <Input
                    id="apikey"
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-..."
                    className="rounded-2xl border-white/70 bg-white/78 text-sm shadow-[0_10px_24px_rgba(59,130,246,0.08)] backdrop-blur"
                  />
                </div>
              )}

              <Button type="submit" className="w-full rounded-2xl bg-[linear-gradient(135deg,_#3b82f6,_#8b5cf6)] py-5 text-sm font-extrabold text-white shadow-[0_14px_32px_rgba(59,130,246,0.32)] hover:shadow-[0_18px_38px_rgba(59,130,246,0.42)] hover:brightness-110 transition-all" disabled={loading || !model}>
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                生成图片
              </Button>
            </form>

            <div className="rounded-2xl border border-white/75 bg-[linear-gradient(135deg,_rgba(191,219,254,0.75),_rgba(255,255,255,0.96),_rgba(233,213,255,0.66))] p-3 text-xs text-slate-700 shadow-[0_14px_32px_rgba(59,130,246,0.14)] backdrop-blur">
              {status}
            </div>
          </aside>

          <main className="min-w-0 space-y-6">
            <div>
              <div className="mb-3 flex items-center justify-between rounded-[20px] border border-sky-100/70 bg-[linear-gradient(180deg,_rgba(239,246,255,0.8),_rgba(255,255,255,0.96))] px-4 py-2 shadow-[0_8px_20px_rgba(59,130,246,0.06)]">
                <div className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,_rgba(59,130,246,0.12),_rgba(168,85,247,0.12))] px-3 py-1.5 text-sm font-extrabold text-slate-900"><Sparkles className="h-4 w-4 text-sky-600" />图片结果</div>
                {activeModel && <Badge variant="secondary">{activeModel.name}</Badge>}
              </div>
              {images.length === 0 ? (
                <div className="flex min-h-[520px] items-center justify-center rounded-[28px] border border-sky-200/70 bg-[linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(224,242,254,0.78),_rgba(237,233,254,0.68))] px-6 text-center text-sm text-slate-500 shadow-[0_22px_56px_rgba(59,130,246,0.10)]">
                  在左侧选择模型、输入提示词，点击「生成图片」即可开始创作。
                </div>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-2">
                  {images.map((src, i) => (
                    <article
                      key={`${src}-${i}`}
                      className="overflow-hidden rounded-[24px] border border-sky-200/70 bg-white shadow-[0_18px_42px_rgba(59,130,246,0.10)]"
                    >
                      <div className="relative aspect-[4/4] bg-[linear-gradient(135deg,_rgba(239,246,255,0.95),_rgba(255,255,255,0.98))]"><div className="absolute inset-x-0 top-0 z-10 h-1 bg-[linear-gradient(90deg,_#3b82f6,_#8b5cf6,_#f59e0b)]" />
                        <button
                          type="button"
                          onClick={() => setZoomImage(src)}
                          className="absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-full border border-white/60 bg-black/35 px-2.5 py-1.5 text-[11px] font-bold text-white backdrop-blur hover:bg-black/50"
                        >
                          <ZoomIn className="h-3.5 w-3.5" />预览
                        </button>
                        <Image
                          src={src}
                          alt={`生成 ${i + 1}`}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="space-y-3 border-t border-slate-100 p-4 text-xs text-slate-500">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-violet-500/10 to-purple-500/10 px-2.5 py-1 text-[11px] font-semibold text-violet-700 ring-1 ring-violet-200/50">
                              <Sparkles className="h-3 w-3 text-violet-500" />
                              {model}
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-sky-500/10 to-teal-500/10 px-2.5 py-1 text-[11px] font-semibold text-sky-700 ring-1 ring-sky-200/50">
                              <Maximize className="h-3 w-3 text-sky-500" />
                              {size}
                            </span>
                          </div>
                          <a
                            href={src}
                            download={`qianxi-${Date.now()}-${i + 1}.png`}
                            className="inline-flex items-center gap-1 font-bold text-sky-600 hover:text-sky-700 hover:underline transition-colors"
                          >
                            <Download className="h-3.5 w-3.5" />下载
                          </a>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full rounded-xl border-sky-200/70 bg-[linear-gradient(180deg,_rgba(239,246,255,0.9),_rgba(255,255,255,0.96))] py-2.5 text-xs font-bold text-sky-700 shadow-sm hover:bg-sky-50 hover:text-sky-800 transition"
                          onClick={() => saveToLibrary(src)}
                        >
                          <BookmarkPlus className="mr-2 h-4 w-4" />
                          存入作品库
                        </Button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between gap-3 rounded-[20px] border border-violet-100/70 bg-[linear-gradient(180deg,_rgba(245,243,255,0.8),_rgba(255,255,255,0.96))] px-4 py-2 shadow-[0_8px_20px_rgba(139,92,246,0.06)]">
                <div className="flex items-center gap-2">
                  <Images className="h-4 w-4" />
                  <div className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,_rgba(168,85,247,0.12),_rgba(236,72,153,0.10))] px-3 py-1.5 text-sm font-extrabold text-slate-900"><Images className="h-4 w-4 text-violet-600" />作品库</div>
                  <Badge variant="secondary">{library.length}</Badge>
                  <Badge variant="outline" className="border-slate-200 bg-white/80 text-slate-600">
                    {libraryBusy ? "同步中" : libraryMode === "cloud" ? "云端" : "本地"}
                  </Badge>
                </div>
                {library.length > 0 ? (
                  <Button type="button" variant="outline" onClick={clearLibrary} disabled={libraryBusy}>
                    <Trash2 className="mr-2 h-4 w-4" /><span className="text-[11px] font-bold">清空作品库</span>
                  </Button>
                ) : null}
              </div>

              {library.length > 0 ? (
                <div className="mb-4 flex items-center justify-between gap-3 rounded-[24px] border border-violet-200/70 bg-[linear-gradient(135deg,_rgba(245,243,255,0.95),_rgba(255,255,255,0.96),_rgba(224,242,254,0.84))] px-4 py-3 shadow-[0_16px_30px_rgba(139,92,246,0.12)]">
                  <div className="text-xs text-slate-500">
                    按模型快速筛选作品，方便复盘不同上游的出图风格。
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-slate-400" />
                    <select
                      value={libraryFilter}
                      onChange={(e) => setLibraryFilter(e.target.value)}
                      className="h-10 rounded-full border border-violet-200/70 bg-white/90 px-4 text-sm text-slate-700 shadow-sm"
                    >
                      <option value="all">全部模型</option>
                      {libraryModels.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : null}

              {library.length === 0 ? (
                <div className="flex min-h-[260px] items-center justify-center rounded-[24px] border border-sky-200/70 bg-[linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(224,242,254,0.84),_rgba(237,233,254,0.58))] px-6 text-center text-sm text-slate-500 shadow-[0_18px_42px_rgba(59,130,246,0.08)]">
                  作品库还是空的。生成后点击“存入作品库”，{libraryMode === "cloud" ? "会同步到云端。" : "刷新页面也不会丢。"}
                </div>
              ) : filteredLibrary.length === 0 ? (
                <div className="flex min-h-[220px] items-center justify-center rounded-[24px] border border-amber-200/70 bg-[linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(255,251,235,0.92),_rgba(254,242,242,0.52))] px-6 text-center text-sm text-slate-500 shadow-[0_18px_42px_rgba(245,158,11,0.08)]">
                  当前筛选条件下还没有作品，切换模型筛选试试。
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredLibrary.map((item) => (
                    <article
                      key={item.id}
                      className="overflow-hidden rounded-[24px] border border-sky-200/70 bg-white shadow-[0_18px_42px_rgba(59,130,246,0.10)]"
                    >
                      <div className="relative aspect-[4/4] bg-[linear-gradient(135deg,_rgba(239,246,255,0.95),_rgba(255,255,255,0.98))]"><div className="absolute inset-x-0 top-0 z-10 h-1 bg-[linear-gradient(90deg,_#3b82f6,_#8b5cf6,_#f59e0b)]" />
                        <button
                          type="button"
                          onClick={() => setZoomImage(item.image)}
                          className="absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-full border border-white/60 bg-black/35 px-2.5 py-1.5 text-[11px] font-bold text-white backdrop-blur hover:bg-black/50"
                        >
                          <ZoomIn className="h-3.5 w-3.5" />查看
                        </button>
                        <Image
                          src={item.image}
                          alt={item.prompt}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="space-y-2 border-t p-3 text-xs text-muted-foreground">
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate font-semibold text-foreground">
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
                              className="inline-flex items-center gap-1 font-bold text-sky-600 hover:text-sky-700 hover:underline transition-colors"
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
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,_rgba(14,165,233,0.12),_rgba(245,158,11,0.12))] px-3 py-1.5 text-sm font-extrabold text-slate-900"><Sparkles className="h-4 w-4 text-sky-600" />图片生成模型目录</div>
              <div className="space-y-5">
                {[
                  {
                    key: "domestic",
                    title: "国产模型",
                    desc: "乾羲适配层直连，适合中文商业图与快速交付。",
                    items: groupedCatalog.domestic,
                    panelClass:
                      "border-sky-200/70 bg-[linear-gradient(180deg,_rgba(255,255,255,0.99),_rgba(224,242,254,0.72),_rgba(237,233,254,0.46))] shadow-[0_18px_34px_rgba(59,130,246,0.10)]",
                  },
                  {
                    key: "openai",
                    title: "OpenAI / Google",
                    desc: "需要上游 API Key，适合高质量创意与通用视觉生成。",
                    items: groupedCatalog.openai,
                    panelClass:
                      "border-amber-200/70 bg-[linear-gradient(180deg,_rgba(255,255,255,0.99),_rgba(255,251,235,0.86),_rgba(254,242,242,0.42))] shadow-[0_18px_34px_rgba(245,158,11,0.10)]",
                  },
                ]
                  .filter((group) => group.items.length > 0)
                  .map((group) => (
                    <div
                      key={group.key}
                      className={`rounded-[24px] border p-4 ${group.panelClass}`}
                    >
                      <div className="mb-3">
                        <div className="flex items-center justify-between gap-3"><h3 className="text-sm font-extrabold text-slate-950">{group.title}</h3><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${group.key === "domestic" ? "bg-sky-100 text-sky-700" : "bg-amber-100 text-amber-700"}`}>{group.key === "domestic" ? "CN MODELS" : "GLOBAL MODELS"}</span></div>
                        <p className="mt-1 text-xs text-slate-500">{group.desc}</p>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-2">
                        {group.items.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setModel(item.id)}
                            className={
                              item.id === model
                                ? "rounded-[20px] border border-sky-400 bg-[linear-gradient(135deg,_rgba(191,219,254,0.95),_rgba(255,255,255,0.98),_rgba(233,213,255,0.76),_rgba(254,249,195,0.70))] p-4 text-left ring-1 ring-sky-200 shadow-[0_16px_32px_rgba(59,130,246,0.14)] transition-colors"
                                : "rounded-[20px] border border-slate-200/80 bg-[linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(248,250,252,0.96))] p-4 text-left transition-colors hover:border-sky-300 hover:bg-[linear-gradient(180deg,_rgba(240,249,255,0.95),_rgba(255,255,255,0.98))]"
                            }
                          >
                            <div className="mb-2 flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <strong className="block text-sm font-extrabold text-slate-950">{item.name}</strong>
                                <span className="mt-0.5 block text-[10px] font-mono text-slate-400">{item.id}</span>
                              </div>
                              {item.badge ? (
                                <Badge
                                  variant={item.id === model ? "default" : "secondary"}
                                  className={`border text-[10px] ${item.id === model ? "border-white/70 bg-white/85 text-slate-700" : getBadgeClass(item.badge)}` }
                                >
                                  {item.badge}
                                </Badge>
                              ) : null}
                            </div>
                            <p className="mb-2 line-clamp-2 text-xs leading-6 text-slate-500">
                              {item.description || item.provider}
                            </p>
                            <span className="text-[10px] font-medium text-slate-400">{item.provider}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {sessionHistory.length > 0 ? (
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <div className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,_rgba(14,165,233,0.12),_rgba(34,197,94,0.12))] px-3 py-1.5 text-sm font-extrabold text-slate-900"><Clock className="h-4 w-4 text-emerald-600" />本次会话记录</div>
                </div>
                <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
                  {sessionHistory.slice(0, 20).map((rec, i) => (
                    <div
                      key={`${rec.time}-${i}`}
                      className="rounded-xl border border-slate-200/80 bg-[linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(248,250,252,0.96))] p-3 text-sm shadow-sm"
                    >
                      <div className="mb-1 flex items-center gap-2">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-extrabold ${rec.status === "success" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
                        >
                          {rec.status === "success" ? "成功" : "失败"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {rec.model} · {rec.time}
                        </span>
                        {rec.hasRef ? (
                          <span className="text-[10px] text-slate-300">参考图</span>
                        ) : null}
                      </div>
                      <p className="line-clamp-2 text-xs text-slate-500">{rec.prompt}</p>
                      {rec.message ? (
                        <p className="mt-1 text-xs text-red-500">{rec.message}</p>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </main>
        </section>

        {zoomImage && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm"
            onClick={() => setZoomImage(null)}
          >
            <button
              onClick={() => setZoomImage(null)}
              className="absolute right-6 top-6 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            >
              <X className="h-6 w-6" />
            </button>
            <div
              className="relative max-h-[90vh] max-w-[90vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={zoomImage}
                alt="预览"
                width={1024}
                height={1024}
                className="max-h-[85vh] max-w-[85vw] rounded-2xl object-contain shadow-2xl"
                unoptimized
              />
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                <a
                  href={zoomImage}
                  download
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-4 py-2 text-xs font-bold text-slate-800 hover:bg-white"
                >
                  <Download className="h-3.5 w-3.5" />下载原图
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}












