---
title: API 文档
description: Lichen REST API 完整参考，包含所有端点、认证方式和请求/响应示例。
---

> Base URL：`https://your-domain.com` 或 `http://localhost:8787`

## 认证

除 `auth/*` 和 `billing/webhook` 外，所有 API 需要 JWT 或 API Token 认证：

```http
Authorization: Bearer <jwt_token>
Authorization: Bearer tok_<api_token>
```

JWT Token 通过登录接口获取；API Token 在 Dashboard「账户」页面管理，用于 Agent 上报数据。

## Auth — 认证

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/v1/auth/status` | 系统状态（是否初始化、注册开关） |
| POST | `/api/v1/auth/setup` | Self-Hosted 首次创建管理员 |
| POST | `/api/v1/auth/register` | 注册新账号 |
| POST | `/api/v1/auth/login` | 登录，返回 JWT |
| POST | `/api/v1/auth/logout` | 登出 |
| POST | `/api/v1/auth/forgot-password` | 发送密码重置邮件 |
| POST | `/api/v1/auth/reset-password` | 使用 Token 重置密码 |

```json
// POST /api/v1/auth/login
// Request
{ "email": "user@example.com", "password": "your-password" }

// Response 200
{ "token": "eyJ..." }
```

## Account — 账户

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/v1/account/profile` | 获取个人信息 |
| POST | `/api/v1/account/reset-token` | 重置 API Token |
| POST | `/api/v1/account/password` | 修改密码 |
| GET | `/api/v1/account/subscription` | 获取订阅信息 |
| DELETE | `/api/v1/account/` | 注销账户 |

## Hosts — 主机

| 方法 | 路径 | 权限 | 说明 |
|------|------|------|------|
| GET | `/api/v1/hosts/` | viewer+ | 主机列表 |
| POST | `/api/v1/hosts/` | admin+ | 创建主机 |
| GET | `/api/v1/hosts/:id` | viewer+ | 主机详情 |
| PUT | `/api/v1/hosts/:id` | admin+ | 修改主机名 |
| DELETE | `/api/v1/hosts/:id` | admin+ | 删除主机 |

## Metrics — 指标

```http
GET /api/v1/metrics/:host_id?range=24h
```

`range` 参数：`1h` · `6h` · `24h` · `7d` · `30d`

响应自动降采样：>24h 按 5min/桶，>7d 按 1h/桶。

## Logs — 日志

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/v1/logs/:host_id` | 按主机查询日志，支持 `?keyword=&limit=&offset=` |
| GET | `/api/v1/logs/search` | 跨主机搜索，支持 `?keyword=&limit=&offset=` |

## Alerts — 告警

| 方法 | 路径 | 权限 | 说明 |
|------|------|------|------|
| GET | `/api/v1/alerts/rules` | viewer+ | 告警规则列表（含 `is_firing` 状态） |
| POST | `/api/v1/alerts/rules` | admin+ | 创建规则 |
| PUT | `/api/v1/alerts/rules/:id` | admin+ | 更新规则 |
| DELETE | `/api/v1/alerts/rules/:id` | admin+ | 删除规则 |
| GET | `/api/v1/alerts/history` | viewer+ | 告警历史，支持 `?host_id=&from=&to=&limit=` |

```json
// POST /api/v1/alerts/rules
{
  "host_id": null,              // null = 适用所有主机
  "type": "cpu_percent",
  "threshold": 85,
  "severity": "warning",
  "cooldown_minutes": 30,
  "enabled": true,
  "note": "生产环境 CPU 告警"
}
```

告警类型：`cpu_percent` · `mem_percent` · `disk_percent` · `offline` · `log_keyword`

## Webhooks — 通知渠道

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/v1/webhooks/` | 渠道列表 |
| POST | `/api/v1/webhooks/` | 创建渠道 |
| PUT | `/api/v1/webhooks/:id` | 更新渠道 |
| DELETE | `/api/v1/webhooks/:id` | 删除渠道 |
| POST | `/api/v1/webhooks/:id/test` | 发送测试通知 |

渠道类型：`telegram` · `wecom` · `feishu` · `dingtalk` · `slack` · `discord` · `smtp` · `generic`

## Containers — 容器 (Pro)

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/v1/containers/:host_id` | 最新容器列表 |
| GET | `/api/v1/containers/:host_id/:name` | 容器历史指标，支持 `?range=` |

## Teams — 工作区

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/v1/teams/` | 我的工作区列表 |
| POST | `/api/v1/teams/` | 创建团队 |
| PUT | `/api/v1/teams/:id` | 更新名称 |
| GET | `/api/v1/teams/:id/members` | 成员列表 |
| POST | `/api/v1/teams/:id/invite` | 生成邀请码（Pro） |
| POST | `/api/v1/teams/:id/join` | 使用邀请码加入 |
| PUT | `/api/v1/teams/:id/members/:memberId` | 修改成员角色 |
| DELETE | `/api/v1/teams/:id/members/:memberId` | 移除成员 |
| POST | `/api/v1/teams/:id/leave` | 离开团队 |

## Agent 上报

Agent 专用，使用 API Token 认证：

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/v1/agent/heartbeat` | 心跳 |
| POST | `/api/v1/agent/metrics` | 上报单条指标 |
| POST | `/api/v1/agent/metrics/batch` | 批量上报（≤100条） |
| POST | `/api/v1/agent/logs` | 上报日志 |
| POST | `/api/v1/agent/containers` | 上报容器指标（Pro） |

## 通用错误格式

```json
{
  "error": "error_code",
  "message": "人类可读的描述",
  "fields": { "field_name": "具体错误" }
}
```

| 错误码 | HTTP 状态 | 说明 |
|--------|---------|------|
| `validation_error` | 422 | 参数校验失败，详见 `fields` |
| `unauthorized` | 401 | 未认证或 Token 过期 |
| `forbidden` | 403 | 权限不足 |
| `not_found` | 404 | 资源不存在 |
| `tier_limit_exceeded` | 403 | 超出套餐限额 |
| `rate_limited` | 429 | 请求频率超限 |
