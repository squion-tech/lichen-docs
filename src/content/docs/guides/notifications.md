---
title: 通知渠道配置
description: 配置 Telegram、飞书、钉钉、企业微信、Slack、Discord、邮件等 8 种通知渠道。
---

Lichen 支持 8 种通知渠道，在「Webhook / 通知」页面统一管理。每个渠道支持发送测试消息验证连通性。

## Telegram

1. 在 Telegram 中搜索 `@BotFather`，发送 `/newbot` 创建机器人，获取 **Bot Token**
2. 将机器人加入目标群组，或直接对话获取 **Chat ID**
   - 获取 Chat ID：发送消息后访问 `https://api.telegram.org/bot<TOKEN>/getUpdates`
3. 在 Lichen 填入 Bot Token 和 Chat ID

## 飞书

1. 在飞书群组中，点击右上角「设置」→「机器人」→「添加机器人」→「自定义机器人」
2. 复制生成的 **Webhook URL**
3. 在 Lichen 填入 Webhook URL

## 钉钉

1. 在钉钉群组中，「智能群助手」→「添加机器人」→「自定义」
2. 复制 **Webhook URL**（格式：`https://oapi.dingtalk.com/robot/send?access_token=...`）
3. 在 Lichen 填入 Webhook URL

:::note
钉钉自定义机器人需要配置安全设置，推荐选择「自定义关键词」，添加 `Lichen` 作为关键词。
:::

## 企业微信

1. 在企业微信群中，右键群名 →「添加群机器人」→「新创建一个机器人」
2. 复制 **Webhook URL**
3. 在 Lichen 填入 Webhook URL

## Slack

1. 在 Slack 工作区中，进入 `api.slack.com/apps` 创建 App
2. 开启「Incoming Webhooks」功能，添加到目标频道
3. 复制 **Webhook URL**（格式：`https://hooks.slack.com/services/...`）
4. 在 Lichen 填入 Webhook URL 和可选的频道名

## Discord

1. 在 Discord 频道设置中，「整合」→「Webhook」→「新建 Webhook」
2. 复制 **Webhook URL**
3. 在 Lichen 填入 Webhook URL

## 邮件（SMTP API）

通过邮件 API 发送告警邮件，支持 SendGrid、Resend 等服务：

| 字段 | 说明 |
|------|------|
| API URL | 邮件服务 API 端点 |
| API Key | 服务商 API 密钥 |
| 收件人 | 告警邮件接收地址 |

## 通用 Webhook

适用于自定义集成，可以发送到任意 HTTP 端点：

| 字段 | 说明 |
|------|------|
| URL | 接收告警的 HTTP 端点 |
| Method | HTTP 方法（POST / PUT） |
| Headers | 自定义请求头（JSON 格式） |
| Body Template | 请求体模板，支持变量替换 |

**可用变量：**

```
{{host_name}}     主机名称
{{alert_type}}    告警类型
{{message}}       告警消息
{{severity}}      严重程度 (warning/critical)
{{timestamp}}     触发时间 (ISO 8601)
```

## 投递日志

每次通知发送后，Lichen 记录：
- 发送结果（成功/失败）
- HTTP 状态码
- 响应耗时
- 错误信息（失败时）

在「通知渠道」页面点击渠道名称可查看最近 50 条投递记录，方便排查通知失败原因。

## 失败重试

发送失败时自动重试 3 次，间隔采用指数退避：1s → 2s → 4s。
