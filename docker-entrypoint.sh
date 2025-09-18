#!/usr/bin/env sh
set -eu

echo "[entrypoint] running migrations..."
npm run generate --yes || { echo "generate failed"; exit 1; }
npm run migrate --yes || { echo "migrate failed"; exit 1; }

echo "[entrypoint] starting server..."
# 开发：直接 tsx 运行（省编译）
exec npx tsx src/server.ts
# 生产：编译后运行
# npm run build
# exec npm run start


