---
title: Cloudflare Workers 部署
description: 将 Lichen 部署到 Cloudflare Workers + D1 + Pages，实现零运维的全球 SaaS 模式。
---

Cloudflare Workers 模式利用 D1（数据库）、KV（缓存）、Queues（消息队列）和 Pages（前端）实现无服务器架构，全球边缘节点低延迟响应。

## 前置条件

- Cloudflare 账号
- Node.js 20+
- Wrangler CLI：`npm install -g wrangler`

## 步骤 1：克隆项目

```bash
git clone https://github.com/squion/lichen.git
cd lichen
```

## 步骤 2：创建 Cloudflare 资源

```bash
cd server

# 创建 D1 数据库
wrangler d1 create lichen
# 输出：database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"

# 创建 KV 命名空间
wrangler kv namespace create KV
# 输出：id = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

## 步骤 3：配置 wrangler.toml

编辑 `server/wrangler.toml`，填入上一步的 ID：

```toml
[[d1_databases]]
binding = "DB"
database_name = "lichen"
database_id = "你的-database-id"   # 填入实际值

[[kv_namespaces]]
binding = "KV"
id = "你的-kv-id"                  # 填入实际值
```

## 步骤 4：设置 Secrets

```bash
wrangler secret put JWT_SECRET
# 输入一个随机字符串（推荐 openssl rand -hex 32 生成）

# 可选：OAuth 登录
wrangler secret put GITHUB_CLIENT_ID
wrangler secret put GITHUB_CLIENT_SECRET
wrangler secret put GOOGLE_CLIENT_ID
wrangler secret put GOOGLE_CLIENT_SECRET

# 可选：Stripe 计费
wrangler secret put STRIPE_SECRET_KEY
wrangler secret put STRIPE_WEBHOOK_SECRET
```

## 步骤 5：初始化数据库

```bash
wrangler d1 migrations apply lichen
```

## 步骤 6：部署 API

```bash
npm install
npm run deploy
# → https://lichen.your-subdomain.workers.dev
```

## 步骤 7：部署前端 Dashboard

```bash
cd ../ui
npm install
npm run build
wrangler pages deploy dist --project-name=lichen
```

## 步骤 8：配置 Service Binding

在 Cloudflare Dashboard 中：
1. Pages 项目 → Settings → Functions → Service bindings
2. 添加绑定：变量名 `API`，Service 选 `lichen`

这样前端的 `/api/*` 请求会通过 Cloudflare 内网直接转发给 Workers，无需 CORS，无额外延迟。

## 绑定自定义域名

1. Cloudflare Dashboard → Workers & Pages → lichen
2. 「Custom Domains」→ 添加 `lichen.yourdomain.com`

Cloudflare 自动申请并续期 SSL 证书。

## 费用参考

Cloudflare 免费套餐对个人项目通常足够：

| 资源 | 免费额度 | Lichen 典型用量 |
|------|---------|----------------|
| Workers 请求 | 10万次/天 | ~1000次/天（10台主机） |
| D1 读取 | 500万次/天 | 低 |
| D1 写入 | 10万次/天 | ~2880次/天（每30s一条） |
| KV 读取 | 10万次/天 | 低 |
