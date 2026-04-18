---
title: 5 分钟快速上手
description: 从零开始，部署 Lichen，安装 Agent，配置第一条告警规则。
---

本指南带你在 5 分钟内完成：部署服务 → 注册账号 → 安装 Agent → 配置告警。

## 前置条件

- 一台安装了 Docker 的服务器（或本机）
- 一台需要被监控的 Linux/macOS 服务器

## 步骤 1：启动 Lichen 服务

```bash
docker run -d \
  --name lichen \
  --restart unless-stopped \
  -p 8787:8787 \
  -v lichen-data:/data \
  -e JWT_SECRET=$(openssl rand -hex 32) \
  ghcr.io/squion/lichen:latest
```

服务启动后，打开浏览器访问 `http://your-server-ip:8787`。

:::tip
推荐使用 docker-compose，方便管理环境变量和升级。参考 [Docker 自托管指南](/guides/deploy-docker/)。
:::

## 步骤 2：注册账号

首次访问 Dashboard 会进入初始化页面，创建管理员账号后即可登录。

## 步骤 3：添加主机并获取 API Token

1. 进入 Dashboard，点击「添加主机」
2. 填写主机名称（如 `web-server-1`）
3. 复制生成的 **API Token**（格式：`tok_xxxxxxxxxx`）和 **Host ID**

## 步骤 4：在目标服务器上安装 Agent

```bash
curl -sSL https://lichen.squion.com/install.sh | \
  LICHEN_SERVER_URL=http://your-lichen-server:8787 \
  LICHEN_API_TOKEN=tok_xxxxxxxxxx \
  LICHEN_HOST_ID=your-host-uuid \
  bash
```

安装脚本会自动：
- 下载适合当前系统的 Agent 二进制
- 创建配置文件 `/etc/lichen/config.yaml`
- 注册为 systemd（Linux）或 launchd（macOS）服务并启动

**验证 Agent 运行状态：**

```bash
# Linux
systemctl status lichen-agent

# macOS
launchctl list | grep lichen
```

Agent 启动后约 30-60 秒，Dashboard 中的主机状态会变为「在线」。

## 步骤 5：配置第一条告警规则

1. 进入「告警」→「告警规则」→「新建规则」
2. 选择类型：**CPU 使用率**，阈值：**85%**
3. 保存规则

然后配置通知渠道：

1. 进入「Webhook / 通知」→「添加渠道」
2. 选择你偏好的渠道（如 Telegram 或 飞书）
3. 填入 Bot Token / Webhook URL
4. 点击「测试」验证连通性

## 完成！

你的第一个监控主机已经上线。接下来可以：

- [安装更多 Agent](/guides/install-agent/) — 监控多台服务器
- [配置日志告警](/guides/alerts/) — 监控应用日志关键词
- [配置 Docker 监控](/guides/alerts/#docker-监控) — 监控容器资源用量
