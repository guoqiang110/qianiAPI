---
title: "DeepSeek API 接入 Codex/Claude Code 配置指南"
description: "手把手教你把 DeepSeek API 接入 Codex、Claude Code、Cursor、Cline、Aider 等 AI 编程工具。用统一 API 网关一个 Key 调通所有工具，国内稳定、自由切换 108+ 模型。"
keywords: ["DeepSeek API", "Codex 接入", "Claude Code 接入 DeepSeek", "AI 编程工具 API 配置", "统一 API 网关", "乾羲API"]
slug: "deepseek-api-codex-claude-code"
date: "2026-08-10"
author:
  name: "郭强"
  jobTitle: "乾羲API 平台架构师"
ogImage: "/images/global/desc_zh.png"
related: ["what-is-geo", "qianxi-vs-siliconflow"]
---
# DeepSeek API 接入 Codex、Claude Code 等 AI 编程工具：一站式网关配置指南

2026 年，DeepSeek 凭借顶尖的代码能力和极低的价格，成了无数开发者写代码的首选模型。但很多人卡在第一步：**怎么把 DeepSeek API 接进 Codex、Claude Code、Cursor、Cline 这些 AI 编程工具？**

官方文档大多只讲「怎么直连自家模型」，很少有人讲「怎么用一个 Key 让所有工具都跑起 DeepSeek」。本文用**统一 API 网关**的思路，把这件事拆成「一个 Key、两行配置」，让你在 Claude Code、OpenAI Codex 以及一众 IDE 插件里都能稳定调用 DeepSeek，而且随时切换 108+ 其他模型。

## 为什么要把 DeepSeek 接入 AI 编程工具？

先说结论：DeepSeek 是目前性价比最高的编程模型之一，但它原生使用有几个绕不开的痛点。

- **每个工具都要单独配 Key、单独管账单**：Cursor 一个、Cline 一个、Codex 又是一个，换模型还得重新填。
- **国内直连不稳**：默认 `api.openai.com` / `api.anthropic.com` 在国内常常连不上或超时。
- **想换模型要改一堆配置**：今天用 DeepSeek 写业务代码，明天想用 Claude 做复杂重构，后天想试 Gemini 长上下文——每次都是一套新接入流程。

解决思路其实很朴素：**在工具和模型之间加一层「统一 API 网关」**。你只持有网关的一个 Key，网关同时兼容 OpenAI 协议和 Anthropic 协议，于是所有工具都能「以为自己在调官方接口」，实际背后跑的是 DeepSeek（或任意模型）。

> 本文以 **乾羲API**（统一 AI 模型网关，一个 Key 调 108+ 模型，提供 OpenAI 兼容 + Anthropic 兼容双协议）为例演示。你用任何同类网关，配置方法完全一致，只需替换 base_url 与 Key。

## 核心思路：用统一 API 网关替代官方 Key

所谓「统一 API 网关」，本质是一个**协议翻译 + 路由层**：

1. 它对外暴露和 OpenAI、Anthropic **完全一致的接口格式**；
2. 你只需把工具的 `base_url` 指向网关、`api_key` 填网关密钥；
3. 网关根据你指定的 `model` 字段，把请求路由到背后的真实模型（DeepSeek、Claude、Gemini……）。

对开发者来说，收益非常直接：

| 对比项 | 直连各家官方 | 统一网关（如乾羲API） |
|--------|--------------|------------------------|
| 需要管理的 Key | 每个厂商一个 | **一个** |
| 国内调用稳定性 | 需代理/翻墙 | **直连稳定** |
| 换模型成本 | 改 SDK / 改配置 | **只改 model 字段** |
| 账单与额度 | 多个后台 | **统一一个后台** |
| 可用模型数 | 单厂商 | **108+ 跨厂商** |

一句话：**网关让你用「一套接入」获得「全模型自由」**。

## 前置准备（3 步，5 分钟）

1. **注册并登录乾羲API**，进入控制台。
2. **创建 API Key**：控制台 → 令牌/API Key → 新建，复制密钥（只显示一次，妥善保存）。
3. **记下两个网关地址**（在「接入文档」页查看，以下为示例，发布前替换为真实地址）：
   - OpenAI 兼容入口：`https://qianxi-api.com/v1`
   - Anthropic 兼容入口：`https://qianxi-api.com`（**注意：Claude Code 场景不带 /v1**，它会自动拼接 `/v1/messages`）

完成后你就拿到了三个值：**网关地址、API Key、想用的模型名**（如 `deepseek-chat`）。

## 实战一：Claude Code 接入 DeepSeek（Anthropic 协议）

Claude Code 是 Anthropic 出的命令行编程助手，它只认 **Anthropic 协议**：通过两个环境变量决定请求发往哪里、用什么鉴权——`ANTHROPIC_BASE_URL` 和 `ANTHROPIC_API_KEY`。

### 方式 A：环境变量（临时/当前会话）

```bash
# macOS / Linux
export ANTHROPIC_BASE_URL="https://qianxi-api.com"
export ANTHROPIC_API_KEY="sk-你的乾羲API密钥"
export ANTHROPIC_MODEL="deepseek-chat"
claude
```

```powershell
# Windows PowerShell
$env:ANTHROPIC_BASE_URL = "https://qianxi-api.com"
$env:ANTHROPIC_API_KEY = "sk-你的乾羲API密钥"
$env:ANTHROPIC_MODEL = "deepseek-chat"
claude
```

### 方式 B：配置文件（推荐，永久生效）

编辑用户级配置 `~/.claude/settings.json`：

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://qianxi-api.com",
    "ANTHROPIC_API_KEY": "sk-你的乾羲API密钥",
    "ANTHROPIC_MODEL": "deepseek-chat"
  }
}
```

> 优先级：环境变量 > 项目级 `.claude/settings.json` > 用户级 `~/.claude/settings.json`。项目级配置适合「某个仓库单独用别的模型」。

### 验证

启动后随便问一句：`帮我用 Python 写一个快速排序`。如果返回的是 DeepSeek 风格的代码，说明路由成功。可用 `claude --version` 先确认 CLI 正常，再排查网络。

## 实战二：OpenAI Codex 接入 DeepSeek（OpenAI 协议）

OpenAI Codex（CLI / IDE 插件）走的是 **OpenAI 协议**，核心变量是 `OPENAI_BASE_URL` 与 `OPENAI_API_KEY`，也支持 `config.toml` 自定义 provider。

### 方式 A：环境变量（最快）

```bash
# 先确保已安装：npm install -g @openai/codex
export OPENAI_BASE_URL="https://qianxi-api.com/v1"
export OPENAI_API_KEY="sk-你的乾羲API密钥"
codex --model deepseek-chat
```

Windows PowerShell 同理：

```powershell
$env:OPENAI_BASE_URL = "https://qianxi-api.com/v1"
$env:OPENAI_API_KEY = "sk-你的乾羲API密钥"
codex --model deepseek-chat
```

### 方式 B：config.toml（适合多 provider 切换）

编辑 `~/.codex/config.toml`：

```toml
# :schema https://developers.openai.com/codex/config-schema.json
model_provider = "qianxi"
model = "deepseek-chat"
sandbox_mode = "workspace-write"

[model_providers.qianxi]
name = "乾羲API"
base_url = "https://qianxi-api.com/v1"
wire_api = "responses"
env_key = "QIANXI_API_KEY"
```

然后设置环境变量 `QIANXI_API_KEY=sk-你的乾羲API密钥`，直接 `codex` 即可。

> 注意：Codex 强制使用 **Responses API**（`wire_api = "responses"`），且 `base_url` 必须带 `/v1`。若报错 `stream disconnected`，多半是 base_url 少了 `/v1` 或网关的 Responses 兼容未启用。

## 实战三：Cursor / Cline / Aider / Continue 通法（OpenAI 兼容）

这类工具全部「说 OpenAI 的话」，配置规律高度一致——**填两值 + 选模型**：`base_url` + `api_key` + `model`。

| 工具 | 入口位置 | base_url | api_key | model |
|------|----------|----------|---------|-------|
| **Cursor** | Settings → Models → 开启 Override OpenAI Base URL | `https://qianxi-api.com/v1` | 网关 Key | 添加自定义模型 `deepseek-chat` |
| **Cline**（VS Code） | 侧边栏齿轮 → API Provider 选 OpenAI Compatible | `https://qianxi-api.com/v1` | 网关 Key | `deepseek-chat` |
| **Aider**（终端） | 环境变量 + `--model` | `OPENAI_API_BASE` + `OPENAI_API_KEY` | 网关 Key | `aider --model openai/deepseek-chat` |
| **Continue**（VS Code/JetBrains） | `~/.continue/config.json` | `apiBase` | `apiKey` | `deepseek-chat` |

**Continue 配置示例**（`~/.continue/config.json`）：

```json
{
  "models": [
    {
      "title": "DeepSeek (乾羲API)",
      "provider": "openai",
      "model": "deepseek-chat",
      "apiBase": "https://qianxi-api.com/v1",
      "apiKey": "sk-你的乾羲API密钥"
    }
  ]
}
```

**Aider 一行命令**：

```bash
export OPENAI_API_BASE="https://qianxi-api.com/v1"
export OPENAI_API_KEY="sk-你的乾羲API密钥"
aider --model openai/deepseek-chat
```

> 小技巧：编程补全/日常 Coding 用 `deepseek-chat`（快且便宜），复杂重构/算法题切到推理模型 `deepseek-reasoner`——只改 model 字段，其余不变。

## 进阶：一个 Key，在工具间无缝切换 108+ 模型

统一网关真正的杀手锏不是「能接 DeepSeek」，而是**「换模型 = 改一个字段」**：

- 在 Claude Code 里把 `ANTHROPIC_MODEL` 从 `deepseek-chat` 改成 `claude-sonnet-4`，同一窗口立刻切到 Claude；
- 在 Codex / Cursor 里把 `model` 改成 `gemini-2.5-pro`，立刻获得百万级上下文；
- 同一把 Key、同一套 base_url，所有工具共用，额度统一扣、账单统一看。

这对「按任务选模型」的工作流极其友好：轻量补全用便宜模型压成本，关键重构用强模型保质量，全在一个后台里管理。

## 常见问题 FAQ

**Q：DeepSeek API 免费吗？国内怎么稳定调用？**
A：通过国内统一网关（如乾羲API）调用，按量计费、通常比官方更省，且国内网络直连稳定，无需代理。网关提供 OpenAI 兼容与 Anthropic 兼容双入口。

**Q：Claude Code 真的能用 DeepSeek 吗？**
A：能。Claude Code 只认 `ANTHROPIC_BASE_URL` + `ANTHROPIC_API_KEY` 两个变量。指向支持 Anthropic 协议的网关、把 `ANTHROPIC_MODEL` 设为 DeepSeek 模型名即可。

**Q：OpenAI Codex 支持自定义 DeepSeek 端点吗？**
A：支持。`OPENAI_BASE_URL` + `OPENAI_API_KEY` 或 `config.toml` 的 `model_providers` 都能配置，记得 `base_url` 带 `/v1`、模型名以网关模型广场为准。

**Q：一个 Key 能多个工具共用吗？**
A：可以，也推荐。网关单个 Key 配合各工具的 base_url 配置即可全工具共用，统一额度与监控。

**Q：报错 401 / 429 怎么排查？**
A：401 多为密钥无效或模型名错误；429 多为额度/限速。先 `echo $OPENAI_API_KEY`（或对应变量）确认无旧 Key 残留，再核对网关后台模型是否已启用、额度是否充足，最后确认 base_url 的 `/v1` 后缀（OpenAI 协议需带，Anthropic 不需带）。

## 总结与下一步

把 DeepSeek 接入 AI 编程工具，关键就一句话：**别直连各家官方，用统一网关做协议翻译层**。你只需要：

1. 拿到网关的 **一个 Key**；
2. 给 Claude Code 配 `ANTHROPIC_BASE_URL` + `ANTHROPIC_API_KEY`；
3. 给 Codex / Cursor / Cline / Aider / Continue 配 `base_url` + `api_key` + `model`；
4. 之后换模型只改一个字段，108+ 模型任意切。

想立刻上手，去 [乾羲API 控制台](https://qianxi-api.com/console) 创建一个 Key，并查看 [接入文档](https://qianxi-api.com/zh/docs) 拿到真实网关地址；模型清单见 [模型广场](https://qianxi-api.com/zh/models)。除了编程工具，你也可以在 [生图工作台](https://qianxi-api.com/zh/studio) 用同一把 Key 跑文生图，或在 [应用广场](https://qianxi-api.com/zh/apps) 直接体验现成的 AI 应用。如果你的内容也想被豆包、文心、Perplexity 这类 AI 搜索引擎收录，可以顺手用一下我们的 [GEO 生成式引擎优化工具集](https://qianxi-api.com/zh/tools)。

---
