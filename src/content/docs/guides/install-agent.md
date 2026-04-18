---
title: 安装 Agent
description: 在 Linux 和 macOS 上安装、配置和管理 Lichen Agent。
---

Lichen Agent 是一个 Go 编写的单二进制程序，负责采集系统指标、tail 日志文件并定期上报到 Lichen 服务端。

## 一键安装

```bash
curl -sSL https://lichen.squion.com/install.sh | \
  LICHEN_SERVER_URL=https://your-server.example \
  LICHEN_API_TOKEN=tok_xxxxxxxxxx \
  LICHEN_HOST_ID=your-host-uuid \
  bash
```

安装后 Agent 会自动注册为系统服务：
- **Linux**：systemd 服务 `lichen-agent`
- **macOS**：launchd 服务 `com.lichen.agent`

## 手动配置

配置文件默认路径：`/etc/lichen/config.yaml`

```yaml
# 必填
server_url: "https://your-server.example"
api_token: "tok_xxxxxxxxxx"

# 可选：自定义主机名，默认使用系统 hostname
host_name: "web-server-1"

# 采集间隔（秒），默认 30
collect_interval: 30

# 心跳间隔（秒），默认 60
heartbeat_interval: 60

# 监控日志文件
log_files:
  - path: "/var/log/nginx/error.log"
    tag: "nginx-error"
  - path: "/app/logs/app.log"
    tag: "app"

# Docker 容器监控（Pro 专属）
docker_enabled: false
docker_socket: "/var/run/docker.sock"

# 跳过某些采集项（可选）
skip_network: false
skip_temperature: false
skip_disk_io: false
```

## 环境变量

所有配置均可通过环境变量覆盖，优先级高于配置文件：

| 环境变量 | 说明 | 默认值 |
|----------|------|--------|
| `SERVER_URL` | 服务端地址 | **必填** |
| `API_TOKEN` | API Token | **必填** |
| `HOST_NAME` | 主机名称 | 系统 hostname |
| `AGENT_CONFIG` | 配置文件路径 | `config.yaml` |
| `DOCKER_ENABLED` | 启用 Docker 监控 | `false` |
| `DOCKER_SOCKET` | Docker socket 路径 | `/var/run/docker.sock` |
| `BUFFER_FILE` | 离线缓冲文件路径 | `/tmp/lichen-buffer.json` |

## 采集的指标

| 指标 | 说明 |
|------|------|
| CPU % | CPU 总使用率 |
| Memory % / MB | 内存使用率和绝对值 |
| Disk % / GB | 磁盘使用率（取使用率最高的分区） |
| Network Recv/Sent | 网络收发字节数（增量，bytes/s） |
| Disk Read/Write | 磁盘读写字节数（增量） |
| Load Average 1/5/15 | 系统负载 |
| Temperature | CPU 温度（支持时） |

## 服务管理

```bash
# Linux (systemd)
systemctl status lichen-agent    # 查看状态
systemctl restart lichen-agent   # 重启
systemctl stop lichen-agent      # 停止
journalctl -u lichen-agent -f    # 实时日志

# macOS (launchd)
launchctl list | grep lichen              # 查看状态
launchctl stop com.lichen.agent           # 停止
launchctl start com.lichen.agent          # 启动
tail -f /var/log/lichen-agent.log         # 日志
```

## 离线缓冲机制

Agent 内置 ~24 小时的本地缓冲（2880 条指标）。当服务端不可达时：

1. 新数据写入内存 buffer
2. Agent 正常关闭时自动持久化到本地 JSON 文件
3. 重启后读取文件，过滤超过 24h 的旧数据
4. 服务端恢复后自动批量补传

缓冲文件路径默认为 `/tmp/lichen-buffer.json`，可通过 `BUFFER_FILE` 环境变量自定义。

## 卸载 Agent

```bash
# Linux
systemctl stop lichen-agent
systemctl disable lichen-agent
rm /etc/systemd/system/lichen-agent.service
rm -rf /usr/local/bin/lichen-agent /etc/lichen

# macOS
launchctl unload ~/Library/LaunchAgents/com.lichen.agent.plist
rm ~/Library/LaunchAgents/com.lichen.agent.plist
rm -rf /usr/local/bin/lichen-agent /etc/lichen
```
