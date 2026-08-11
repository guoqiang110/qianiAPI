#!/usr/bin/env node
/**
 * 百度搜索资源平台 · 主动推送（API 推送）脚本
 *
 * 官方文档：https://ziyuan.baidu.com/college/courseinfo?id=267&page=2
 * 接口：    POST http://data.zz.baidu.com/urls?site=<站点>&token=<密钥>
 * 正文：    text/plain，每行一个 URL（最多 2000 条/次，受当日配额限制）
 *
 * 用法：
 *   node scripts/baidu-push.mjs                  # 抓取线上 sitemap.xml，推送全部 <loc>
 *   node scripts/baidu-push.mjs --file urls.txt  # 从本地文件推送（每行一个 URL）
 *   node scripts/baidu-push.mjs --dry-run        # 只打印待推送 URL，不发送
 *   node scripts/baidu-push.mjs --limit 10       # 只推送前 N 条（先验证用）
 *   node scripts/baidu-push.mjs --site https://www.qianxi-api.com --token xxxx
 *
 * 凭据（不要写进代码 / 仓库）：
 *   BAIDU_PUSH_TOKEN  必填，站点在百度搜索资源平台「数据引入 → 链接提交 → 主动推送」处的 token
 *   BAIDU_SITE        可选，默认 https://www.qianxi-api.com
 *
 * 退出码：0=成功；1=参数/网络/推送失败；2=未知参数。
 */

import { readFileSync } from "node:fs";

const API = "http://data.zz.baidu.com/urls";

/** 解析命令行参数 */
function parseArgs(argv) {
  const args = {
    file: null,
    dryRun: false,
    limit: 0,
    site: process.env.BAIDU_SITE || "https://www.qianxi-api.com",
    token: process.env.BAIDU_PUSH_TOKEN || "",
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--file") args.file = argv[++i];
    else if (a === "--dry-run") args.dryRun = true;
    else if (a === "--limit") args.limit = Number.parseInt(argv[++i], 10) || 0;
    else if (a === "--site") args.site = argv[++i];
    else if (a === "--token") args.token = argv[++i];
    else if (a === "--help" || a === "-h") {
      printHelp();
      process.exit(0);
    } else {
      console.error(`未知参数: ${a}`);
      process.exit(2);
    }
  }
  return args;
}

function printHelp() {
  console.log(`
百度主动推送脚本

  node scripts/baidu-push.mjs [选项]

选项：
  --file <path>    从本地文件读取 URL（每行一个），代替抓取 sitemap
  --site <url>     站点地址（默认取 BAIDU_SITE 或 https://www.qianxi-api.com）
  --token <token>  推送 token（默认取 BAIDU_PUSH_TOKEN 环境变量）
  --limit <n>      只推送前 n 条 URL
  --dry-run        只打印待推送 URL，不实际发送
  -h, --help       显示本帮助
`);
}

/** 抓取线上 sitemap.xml 并提取全部 <loc> */
async function fetchSitemapUrls(site) {
  const url = `${site.replace(/\/+$/, "")}/sitemap.xml`;
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) {
    throw new Error(`抓取 sitemap 失败：HTTP ${res.status} (${url})`);
  }
  const xml = await res.text();
  const locs = [...xml.matchAll(/<loc>([\s\S]*?)<\/loc>/g)].map((m) =>
    m[1].trim()
  );
  return locs;
}

/** 从本地文件读取 URL（每行一个） */
function readFileUrls(file) {
  return readFileSync(file, "utf8")
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** 调用百度推送接口 */
async function push(urls, { site, token }) {
  // Baidu's endpoint rejects URL-encoded site parameter (returns "site init fail"),
  // so pass site and token literally.
  const endpoint = `${API}?site=${site}&token=${token}`;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: urls.join("\n"),
  });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }
  return { status: res.status, data };
}

async function main() {
  const args = parseArgs(process.argv);

  if (!args.token && !args.dryRun) {
    console.error(
      "错误：缺少百度推送 token。请设置环境变量 BAIDU_PUSH_TOKEN 或用 --token 传入。"
    );
    process.exit(1);
  }

  let urls = args.file
    ? readFileUrls(args.file)
    : await fetchSitemapUrls(args.site);

  if (args.limit > 0) urls = urls.slice(0, args.limit);
  if (urls.length === 0) {
    console.error("没有可推送的 URL。");
    process.exit(1);
  }

  console.log(`待推送 URL 数量：${urls.length}`);
  if (args.dryRun) {
    console.log("（dry-run，未发送）");
    urls.forEach((u, i) => console.log(`  ${i + 1}. ${u}`));
    return;
  }

  const { status, data } = await push(urls, args);
  console.log(`HTTP ${status}`);
  if (data && typeof data === "object") {
    console.log(
      `成功：${data.success ?? "?"}  剩余配额：${data.remain ?? "?"}`
    );
    if (Array.isArray(data.not_valid) && data.not_valid.length) {
      console.log(`无效 URL：${data.not_valid.join(", ")}`);
    }
    if (Array.isArray(data.not_same_site) && data.not_same_site.length) {
      console.log(`非同站 URL：${data.not_same_site.join(", ")}`);
    }
  } else {
    console.log(data.raw);
  }

  if (status !== 200 || (data && data.success === 0)) process.exit(1);
}

main().catch((e) => {
  console.error("推送失败：", e.message);
  process.exit(1);
});
