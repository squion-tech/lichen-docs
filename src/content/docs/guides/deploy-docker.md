---
title: Docker 自托管
description: 使用 Docker 或 docker-compose 在自己的服务器上部署 Lichen。
---

Docker 自托管是最推荐的部署方式，单容器包含 API 服务 + 前端 Dashboard + SQLite 数据库。

## 前置条件

- Docker 20.10+
- 至少 256MB 内存
- 端口 8787（可自定义）

## docker-compose 部署（推荐）

创建 `docker-compose.yml`：

```yaml
services:
  lichen:
    image: ghcr.io/squion/lichen:latest
    container_name: lichen
    restart: unless-stopped
    ports:
      - "8787:8787"
    volumes:
      - lichen-data:/data
    environment:
      - JWT_SECRET=${JWT_SECRET}
      - PORT=8787
      - DB_PATH=/data/lichen.db

volumes:
  lichen-data:
```

创建 `.env` 文件：

```bash
JWT_SECRET=$(openssl rand -hex 32)
```

启动：

```bash
docker compose up -d
```

访问 `http://your-server:8787` 即可打开 Dashboard。

## 单命令部署

```bash
docker run -d \
  --name lichen \
  --restart unless-stopped \
  -p 8787:8787 \
  -v lichen-data:/data \
  -e JWT_SECRET=$(openssl rand -hex 32) \
  ghcr.io/squion/lichen:latest
```

## 环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `JWT_SECRET` | JWT 签名密钥（必填，建议 32 字节随机） | — |
| `PORT` | 监听端口 | `8787` |
| `DB_PATH` | SQLite 数据库路径 | `/data/lichen.db` |
| `LICENSE_PATH` | Pro 许可证文件路径 | `/data/license.lic` |

:::danger
`JWT_SECRET` 必须设置且妥善保管，泄露后所有 JWT Token 将全部失效。
:::

## 配置反向代理（推荐）

生产环境建议在 Nginx 或 Caddy 前面做 HTTPS 终结：

### Caddy（最简单，自动申请证书）

```caddyfile
lichen.yourdomain.com {
    reverse_proxy localhost:8787
}
```

### Nginx

```nginx
server {
    listen 443 ssl;
    server_name lichen.yourdomain.com;

    ssl_certificate     /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:8787;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 数据持久化

所有数据存储在 Docker volume `lichen-data` 中，挂载到容器的 `/data` 目录。

**手动备份：**

```bash
docker exec lichen sqlite3 /data/lichen.db ".backup '/data/backup.db'"
docker cp lichen:/data/backup.db ./lichen-backup-$(date +%Y%m%d).db
```

**定时备份（crontab）：**

```bash
0 2 * * * docker exec lichen sqlite3 /data/lichen.db ".backup '/data/backup.db'" && docker cp lichen:/data/backup.db /backup/lichen-$(date +\%Y\%m\%d).db
```

## 升级

```bash
docker compose pull
docker compose up -d
```

新版本会自动运行数据库迁移，无需手动操作。

## 健康检查

Lichen 内置健康检查端点：

```bash
curl http://localhost:8787/health
# → {"status":"ok"}
```

Docker 也配置了自动健康检查，30 秒一次，可通过 `docker ps` 查看状态。
