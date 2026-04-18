---
name: Lichen Docs 概览
description: lichen-docs 官网文档站的定位、已完成页面、技术栈、部署流程、待办
type: project
---

## 定位

`lichen-docs` 是 Lichen 产品的**公开官网 + 文档站**，基于 Astro v6 + Starlight 构建，输出纯静态网站。
仓库**公开**（不含商业逻辑），部署到 Cloudflare Pages，域名 `lichen.squion.com`。

---

## 技术栈

- **框架**：Astro 6.0.1 + Starlight（文档站主题）
- **本地预览**：`npm run dev` → `http://localhost:4321`
- **构建**：`npm run build`，输出目录 `dist/`

---

## 已完成页面（12 个）

| 页面 | 路径 |
|------|------|
| 首页 Landing | `/` |
| 5分钟快速上手 | `/guides/quickstart/` |
| 安装 Agent | `/guides/install-agent/` |
| Docker 自托管 | `/guides/deploy-docker/` |
| Cloudflare 部署 | `/guides/deploy-cloudflare/` |
| 告警配置 | `/guides/alerts/` |
| 通知渠道 | `/guides/notifications/` |
| 团队协作 | `/guides/teams/` |
| Agent 配置参考 | `/reference/agent-config/` |
| API 文档 | `/reference/api/` |
| 更新日志 | `/changelog/` |

---

## 待替换占位符

- Docker 镜像：`ghcr.io/squion/lichen:latest` → 真实镜像地址
- GitHub 链接：`https://github.com/squion/lichen` → 真实仓库地址
- `install.sh` 已有真实地址：`https://lichen.squion.com/install.sh` ✅

---

## 部署流程

1. 推送到 GitHub（公开仓库）
2. Cloudflare Pages 连接仓库，构建命令 `npm run build`，输出 `dist`
3. DNS：`lichen.squion.com` CNAME → Cloudflare Pages 域名

---

## 推广路线图

| 阶段 | 状态 | 内容 |
|------|------|------|
| 阶段 1 | ✅ 完成 | lichen-docs 官网 + 文档站 |
| 阶段 2 | ✅ 完成 | Landing Page（已集成在首页）|
| 阶段 3 | 🔲 待开发 | HTTP Uptime Monitor 功能 |
| 阶段 4 | 🔲 待开发 | Status Page 功能（病毒传播）|
| 阶段 5 | 🔲 待执行 | V2EX / 少数派 / 掘金发布 |

---

## 关键文件

| 路径 | 说明 |
|------|------|
| `src/content/docs/` | 所有文档 Markdown 内容 |
| `astro.config.mjs` | Starlight 主题配置、侧边栏结构 |
| `package.json` | 构建脚本 |

---

## 更新记忆

用户说"更新记忆"时：检查 `src/content/docs/` 新增的页面，更新已完成页面表格；检查推广路线图进度，更新状态。

**Why:** 了解文档站当前状态，新增功能时同步更新对应文档，推广时知道哪些渠道待执行
**How to apply:** 修改 lichen 功能后检查文档是否需要同步；执行推广前读取路线图状态
