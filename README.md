# Better Auth 完整实现项目

一个基于 Better Auth 的完整认证系统实现，包含 Express.js 认证服务、FastAPI 后端集成和 Next.js 前端界面。

## 🚀 功能特性

- ✅ **用户注册与登录** - 基于邮箱和密码的认证
- ✅ **JWT 令牌管理** - 安全的令牌生成和验证
- ✅ **FastAPI 集成** - 受保护的 API 端点
- ✅ **Next.js 前端** - 现代化的用户界面
- ✅ **数据库支持** - SQLite（可扩展到 PostgreSQL）
- ✅ **CORS 支持** - 跨域请求处理
- ✅ **TypeScript** - 类型安全的开发体验

## 🏗️ 技术栈

### 后端
- **Better Auth** - 现代认证框架
- **Express.js** - Web 服务器
- **FastAPI** - Python API 框架
- **SQLite** - 数据库
- **JWT** - 令牌认证

### 前端
- **Next.js 14** - React 框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架

## 📦 项目结构

```
better-auth-starter/
├── src/                    # Better Auth 服务
│   ├── auth.ts            # 认证配置
│   └── server.ts          # Express 服务器
├── examples/fastapi/       # FastAPI 集成
│   └── main.py            # FastAPI 应用
├── ui-nextjs/             # Next.js 前端
│   ├── src/app/           # 应用页面
│   │   ├── login/         # 登录页面
│   │   ├── register/      # 注册页面
│   │   └── dashboard/     # 仪表盘
│   └── src/lib/           # 工具库
├── docs/                  # 项目文档
├── package.json           # Node.js 依赖
├── .env.example          # 环境变量模板
└── README.md             # 项目说明
```

## 🚀 快速开始

### 环境要求
- Node.js 18+
- Python 3.8+
- npm 或 yarn

### 安装步骤

1. **克隆项目**
```bash
git clone <repository-url>
cd better-auth-starter
```

2. **安装 Node.js 依赖**
```bash
npm install
```

3. **安装 Python 依赖**
```bash
pip install "PyJWT[crypto]" fastapi uvicorn
```

4. **配置环境变量**
```bash
cp .env.example .env
# 编辑 .env 文件，设置必要的环境变量
```

5. **运行数据库迁移**
```bash
npx @better-auth/cli migrate
```

6. **安装前端依赖**
```bash
cd ui-nextjs
npm install
cd ..
```

### 启动服务

**终端 1: 启动 Better Auth 服务**
```bash
npm run dev
# 服务运行在 http://localhost:4000
```

**终端 2: 启动 FastAPI 服务**
```bash
cd examples/fastapi
uvicorn main:app --reload --port 8080
# 服务运行在 http://localhost:8080
```

**终端 3: 启动 Next.js 前端**
```bash
cd ui-nextjs
npm run dev
# 前端运行在 http://localhost:3000
```

## 🔧 API 端点

### Better Auth 服务 (http://localhost:4000)
- `GET /healthz` - 健康检查
- `POST /api/auth/sign-up/email` - 用户注册
- `POST /api/auth/sign-in/email` - 用户登录
- `GET /api/auth/get-session` - 获取会话信息
- `GET /api/auth/jwks` - 获取 JWKS 密钥

### FastAPI 服务 (http://localhost:8080)
- `GET /` - 服务信息
- `GET /agent/chat` - 受保护的聊天端点
- `GET /agent/profile` - 受保护的用户资料端点

### Next.js 前端 (http://localhost:3000)
- `/` - 首页（重定向到登录）
- `/login` - 登录页面
- `/register` - 注册页面
- `/dashboard` - 用户仪表盘

## 🧪 测试

### 用户注册测试
```bash
curl -X POST http://localhost:4000/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
```

### 用户登录测试
```bash
curl -X POST http://localhost:4000/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### JWT 验证测试
```bash
# 首先获取 JWT 令牌
curl -X GET http://localhost:4000/api/auth/get-session -b cookies.txt

# 使用令牌访问受保护的端点
curl -H "Authorization: Bearer <JWT_TOKEN>" http://localhost:8080/agent/chat
```

## 🔒 安全特性

- **密码哈希** - 使用安全算法存储密码
- **JWT 签名** - EdDSA 算法签名令牌
- **CORS 配置** - 跨域访问控制
- **环境变量** - 敏感信息保护
- **令牌过期** - 自动令牌失效机制

## 📝 环境变量

创建 `.env` 文件并配置以下变量：

```env
PORT=4000
BETTER_AUTH_URL=http://localhost:4000
CLIENT_ORIGIN=http://localhost:3000
BETTER_AUTH_SECRET=your-secret-key-here
DATABASE_URL=sqlite://./auth.db
```

## 🚀 生产部署

### 数据库配置
生产环境建议使用 PostgreSQL：
```env
DATABASE_URL=postgres://user:password@host:5432/database
```

### 安全建议
1. 使用 HTTPS
2. 设置强密码策略
3. 配置速率限制
4. 启用日志监控
5. 使用环境特定的密钥

## 📚 文档

- [验收文档](./docs/VALIDATION.md) - 详细的测试和验收说明
- [Better Auth 官方文档](https://better-auth.com) - 官方文档
- [FastAPI 文档](https://fastapi.tiangolo.com) - FastAPI 官方文档
- [Next.js 文档](https://nextjs.org/docs) - Next.js 官方文档

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🙏 致谢

- [Better Auth](https://better-auth.com) - 优秀的认证框架
- [FastAPI](https://fastapi.tiangolo.com) - 现代 Python API 框架
- [Next.js](https://nextjs.org) - React 生产框架

