# 部署指南

本文档提供了 Better Auth 项目的详细部署说明，包括开发环境和生产环境的配置。

## 开发环境部署

### 系统要求
- Node.js 18.0.0 或更高版本
- Python 3.8 或更高版本
- npm 或 yarn 包管理器
- Git

### 快速开始

1. **克隆项目**
```bash
git clone <your-repository-url>
cd better-auth-starter
```

2. **安装依赖**
```bash
# 安装 Node.js 依赖
npm install

# 安装 Python 依赖
pip install "PyJWT[crypto]" fastapi uvicorn

# 安装前端依赖
cd ui-nextjs
npm install
cd ..
```

3. **环境配置**
```bash
# 复制环境变量模板
cp .env.example .env

# 编辑环境变量
nano .env
```

4. **数据库初始化**
```bash
# 运行数据库迁移
npx @better-auth/cli migrate
```

5. **启动服务**

在三个不同的终端中分别运行：

```bash
# 终端 1: Better Auth 服务
npm run dev

# 终端 2: FastAPI 服务
cd examples/fastapi
uvicorn main:app --reload --port 8080

# 终端 3: Next.js 前端
cd ui-nextjs
npm run dev
```

## 生产环境部署

### 环境要求
- Ubuntu 20.04+ 或 CentOS 8+
- Node.js 18+ (推荐使用 Node Version Manager)
- Python 3.8+
- PostgreSQL 13+ (推荐)
- Nginx (反向代理)
- SSL 证书

### 1. 服务器准备

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装必要软件
sudo apt install -y nginx postgresql postgresql-contrib python3-pip

# 安装 Node.js (使用 NodeSource)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. 数据库配置

```bash
# 创建 PostgreSQL 用户和数据库
sudo -u postgres psql
CREATE USER betterauth WITH PASSWORD 'your_secure_password';
CREATE DATABASE betterauth_prod OWNER betterauth;
GRANT ALL PRIVILEGES ON DATABASE betterauth_prod TO betterauth;
\q
```

### 3. 应用部署

```bash
# 创建应用目录
sudo mkdir -p /var/www/better-auth
sudo chown $USER:$USER /var/www/better-auth

# 克隆代码
cd /var/www/better-auth
git clone <your-repository-url> .

# 安装依赖
npm install --production
pip3 install "PyJWT[crypto]" fastapi uvicorn

# 构建前端
cd ui-nextjs
npm install
npm run build
cd ..
```

### 4. 环境变量配置

```bash
# 创建生产环境配置
cat > .env << EOF
PORT=4000
BETTER_AUTH_URL=https://your-domain.com
CLIENT_ORIGIN=https://your-frontend-domain.com
BETTER_AUTH_SECRET=$(openssl rand -base64 32)
DATABASE_URL=postgres://betterauth:your_secure_password@localhost:5432/betterauth_prod

# SMTP 配置 (可选)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EOF
```

### 5. 数据库迁移

```bash
# 运行生产环境迁移
npx @better-auth/cli migrate
```

### 6. 进程管理 (PM2)

```bash
# 安装 PM2
npm install -g pm2

# 创建 PM2 配置文件
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [
    {
      name: 'better-auth',
      script: 'npm',
      args: 'run dev',
      cwd: '/var/www/better-auth',
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'fastapi-backend',
      script: 'uvicorn',
      args: 'main:app --host 0.0.0.0 --port 8080',
      cwd: '/var/www/better-auth/examples/fastapi',
      interpreter: 'python3'
    },
    {
      name: 'nextjs-frontend',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/better-auth/ui-nextjs',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};
EOF

# 启动应用
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 7. Nginx 配置

```bash
# 创建 Nginx 配置
sudo cat > /etc/nginx/sites-available/better-auth << EOF
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;

    # Better Auth API
    location /api/ {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # FastAPI Backend
    location /agent/ {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Next.js Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# 启用站点
sudo ln -s /etc/nginx/sites-available/better-auth /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 8. SSL 证书 (Let's Encrypt)

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx

# 获取 SSL 证书
sudo certbot --nginx -d your-domain.com

# 设置自动续期
sudo crontab -e
# 添加以下行：
# 0 12 * * * /usr/bin/certbot renew --quiet
```

## Docker 部署 (可选)

### 1. 创建 Dockerfile

```dockerfile
# Better Auth Service
FROM node:18-alpine AS auth-service
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY src ./src
COPY tsconfig.json ./
EXPOSE 4000
CMD ["npm", "run", "dev"]

# FastAPI Service
FROM python:3.9-slim AS fastapi-service
WORKDIR /app
COPY examples/fastapi/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY examples/fastapi ./
EXPOSE 8080
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]

# Next.js Frontend
FROM node:18-alpine AS frontend
WORKDIR /app
COPY ui-nextjs/package*.json ./
RUN npm ci --only=production
COPY ui-nextjs ./
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### 2. Docker Compose

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:13
    environment:
      POSTGRES_DB: betterauth
      POSTGRES_USER: betterauth
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  auth-service:
    build:
      context: .
      target: auth-service
    ports:
      - "4000:4000"
    environment:
      DATABASE_URL: postgres://betterauth:password@postgres:5432/betterauth
      BETTER_AUTH_URL: http://localhost:4000
      CLIENT_ORIGIN: http://localhost:3000
    depends_on:
      - postgres

  fastapi-service:
    build:
      context: .
      target: fastapi-service
    ports:
      - "8080:8080"
    environment:
      BETTER_AUTH_URL: http://auth-service:4000
    depends_on:
      - auth-service

  frontend:
    build:
      context: .
      target: frontend
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_AUTH_BASE: http://localhost:4000
    depends_on:
      - auth-service

volumes:
  postgres_data:
```

## 监控和日志

### 1. 日志配置

```bash
# 创建日志目录
sudo mkdir -p /var/log/better-auth

# 配置 PM2 日志
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
```

### 2. 健康检查

```bash
# 创建健康检查脚本
cat > health-check.sh << EOF
#!/bin/bash
curl -f http://localhost:4000/healthz || exit 1
curl -f http://localhost:8080/ || exit 1
curl -f http://localhost:3000/ || exit 1
EOF

chmod +x health-check.sh

# 添加到 crontab
echo "*/5 * * * * /var/www/better-auth/health-check.sh" | crontab -
```

## 安全建议

1. **防火墙配置**
```bash
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

2. **数据库安全**
```bash
# 限制 PostgreSQL 访问
sudo nano /etc/postgresql/13/main/pg_hba.conf
# 确保只允许本地连接
```

3. **定期备份**
```bash
# 创建备份脚本
cat > backup.sh << EOF
#!/bin/bash
pg_dump -U betterauth betterauth_prod > /backup/betterauth_\$(date +%Y%m%d_%H%M%S).sql
find /backup -name "betterauth_*.sql" -mtime +7 -delete
EOF
```

4. **更新策略**
```bash
# 定期更新依赖
npm audit fix
pip list --outdated
```

## 故障排除

### 常见问题

1. **端口冲突**
```bash
# 检查端口占用
sudo netstat -tlnp | grep :4000
sudo lsof -i :4000
```

2. **数据库连接问题**
```bash
# 测试数据库连接
psql -h localhost -U betterauth -d betterauth_prod
```

3. **权限问题**
```bash
# 检查文件权限
ls -la /var/www/better-auth
sudo chown -R $USER:$USER /var/www/better-auth
```

4. **内存不足**
```bash
# 检查内存使用
free -h
pm2 monit
```

## 性能优化

1. **数据库优化**
```sql
-- 创建索引
CREATE INDEX idx_user_email ON user(email);
CREATE INDEX idx_session_token ON session(token);
```

2. **缓存配置**
```bash
# 安装 Redis (可选)
sudo apt install redis-server
```

3. **CDN 配置**
- 使用 CloudFlare 或 AWS CloudFront
- 配置静态资源缓存

## 维护计划

1. **日常维护**
   - 检查应用状态
   - 监控日志文件
   - 验证备份完整性

2. **周期性维护**
   - 更新依赖包
   - 清理日志文件
   - 性能监控分析

3. **安全维护**
   - 定期更新系统
   - 检查安全漏洞
   - 更新 SSL 证书

