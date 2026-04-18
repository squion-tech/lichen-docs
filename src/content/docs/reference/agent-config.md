---
title: Agent 配置参考
description: Lichen Agent 所有配置项的完整参考文档。
---

## 配置文件格式

Agent 读取 YAML 格式配置文件，默认路径 `/etc/lichen/config.yaml`，可通过 `AGENT_CONFIG` 环境变量覆盖。

```yaml
server_url: "https://your-server.example"
api_token: "tok_xxxxxxxxxx"
host_id: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
host_name: "web-server-1"
collect_interval: 30
heartbeat_interval: 60
buffer_size: 2880
buffer_file: "/tmp/lichen-buffer.json"
log_files:
  - path: "/var/log/nginx/error.log"
    tag: "nginx-error"
docker_enabled: false
docker_socket: "/var/run/docker.sock"
skip_network: false
skip_temperature: false
skip_disk_io: false
```

## 配置项说明

### 连接配置

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `server_url` | string | ✅ | Lichen 服务端地址，不带末尾斜杠 |
| `api_token` | string | ✅ | API Token，在 Dashboard 账户页获取 |
| `host_id` | string | ✅ | 主机唯一 ID（UUID），在 Dashboard 添加主机时生成 |
| `host_name` | string | | 显示名称，默认使用系统 hostname |

### 采集配置

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `collect_interval` | int | `30` | 指标采集间隔（秒），范围 10-300 |
| `heartbeat_interval` | int | `60` | 心跳上报间隔（秒） |
| `skip_network` | bool | `false` | 跳过网络 I/O 统计 |
| `skip_temperature` | bool | `false` | 跳过 CPU 温度采集 |
| `skip_disk_io` | bool | `false` | 跳过磁盘 I/O 统计 |

### 缓冲配置

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `buffer_size` | int | `2880` | 内存缓冲最大条数（~24h @30s） |
| `buffer_file` | string | `/tmp/lichen-buffer.json` | 持久化缓冲文件路径 |

### 日志监控

```yaml
log_files:
  - path: "/var/log/app/error.log"    # 日志文件绝对路径
    tag: "app-error"                   # 标签（用于 Dashboard 区分来源）
```

支持 glob 路径：

```yaml
log_files:
  - path: "/var/log/nginx/*.log"
    tag: "nginx"
```

### Docker 监控（Pro）

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `docker_enabled` | bool | `false` | 启用 Docker 容器监控 |
| `docker_socket` | string | `/var/run/docker.sock` | Docker socket 路径 |

启用 Docker 监控时，Agent 需要有权限读取 Docker socket：

```bash
# 将 lichen 用户加入 docker 组（推荐）
usermod -aG docker lichen-agent

# 或直接使用 root 运行（不推荐）
```

## 环境变量

所有字段均可通过环境变量覆盖（优先级 > 配置文件）：

| 环境变量 | 对应字段 |
|----------|---------|
| `SERVER_URL` | `server_url` |
| `API_TOKEN` | `api_token` |
| `HOST_ID` | `host_id` |
| `HOST_NAME` | `host_name` |
| `COLLECT_INTERVAL` | `collect_interval` |
| `HEARTBEAT_INTERVAL` | `heartbeat_interval` |
| `BUFFER_SIZE` | `buffer_size` |
| `BUFFER_FILE` | `buffer_file` |
| `DOCKER_ENABLED` | `docker_enabled` |
| `DOCKER_SOCKET` | `docker_socket` |
| `SKIP_NETWORK` | `skip_network` |
| `SKIP_TEMPERATURE` | `skip_temperature` |
| `SKIP_DISK_IO` | `skip_disk_io` |
| `AGENT_CONFIG` | 配置文件路径 |
