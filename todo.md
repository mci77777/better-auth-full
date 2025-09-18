## TODO 任务清单

### A. 初始化
- [x] 新建工程目录，初始化 `package.json`、`tsconfig.json`
- [x] 写入 `.env.example` 并复制 `.env`
- [x] 安装依赖：`npm i better-auth pg express cors && npm i -D typescript tsx`

### B. Auth 服务代码
- [x] 完成 `src/auth.ts`（启用 Email & Password、Email OTP、JWT）
- [x] 完成 `src/server.ts`（Express + CORS + /healthz）
- [ ] `npx @better-auth/cli generate && npx @better-auth/cli migrate` (此步骤将在 Docker 容器内部执行)

### C. 本地运行 Auth 服务与 PostgreSQL
- [x] 确保本地 PostgreSQL 数据库运行并可访问
- [x] 运行 `npm run generate && npm run migrate`
- [x] 运行 `npm run dev` 启动 Auth 服务
- [x] 验证 `GET /healthz`

### D. FastAPI 集成
- [x] `pip install "PyJWT[crypto]" fastapi uvicorn`
- [x] 编写 `examples/fastapi/main.py`（JWKS 验证）
- [x] `uvicorn examples.fastapi.main:app --reload --port 8080` 验证

### E. 社区 UI
- [x] `npm create next-app ui-nextjs -- --typescript`
- [x] 实现 `/login` 与 `/register` 页
- [x] `.env.local` 配置 `NEXT_PUBLIC_AUTH_BASE`
- [x] `npm run dev` 启动 Next.js UI
- [x] 验证注册、登录、仪表盘功能

### F. 验收与文档
- [x] 创建 `docs/VALIDATION.md`
- [x] 补齐 README/部署说明/环境变量注释
- [x] 预留生产域名/CORS 白名单/日志与监控方案


