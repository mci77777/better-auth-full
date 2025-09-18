## Better Auth 项目验收清单

### 1. Auth 服务健康检查
- [ ] 访问 `http://localhost:4000/healthz`，应返回 `{"status":"ok"}`。

### 2. Auth 服务 JWKS 验证
- [ ] 访问 `http://localhost:4000/api/auth/jwks`，应返回 JWKS 密钥。

### 3. Next.js UI 注册功能
- [ ] 访问 `http://localhost:3000/register`，填写邮箱、密码和名称进行注册。
- [ ] 注册成功后应自动跳转到 `/dashboard` 页面。

### 4. Next.js UI 登录功能
- [ ] 访问 `http://localhost:3000/login`，使用已注册的账号进行登录。
- [ ] 登录成功后应自动跳转到 `/dashboard` 页面。

### 5. Next.js UI 仪表盘显示
- [ ] 登录后，`/dashboard` 页面应显示欢迎信息和用户邮箱。
- [ ] 仪表盘页面应有“Logout”按钮，点击后应能成功登出并跳转到 `/login` 页面。

### 6. FastAPI Agent 服务 JWT 验证
- [ ] 在 Next.js UI 登录后，获取 JWT Token。
- [ ] 使用获取到的 JWT Token 访问 `http://localhost:8080/agent/chat`，应返回 `{"hello":"user_email"}`。


