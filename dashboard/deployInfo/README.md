# Deploy bằng PM2 và Nginx

Các script build API/Web tại local, đóng gói artifact, truyền lên VPS bằng SCP và reload PM2.

## Cấu hình

Tạo runtime environment cho API:

```bash
cp deployInfo/api/test/api.env.example .env.deploy
```

Khai báo thông tin server trong shell hiện tại:

```bash
export DEPLOY_HOST=server.example.com
export DEPLOY_USER=deploy
export DEPLOY_BASE_DIR=/var/www
export DEPLOY_SSH_PORT=22
export DEPLOY_API_APP_NAME=auto_tags_api
export DEPLOY_WEB_APP_NAME=auto_tags_web
export NEXT_PUBLIC_API_URL=https://api.example.com/api
```

Nếu dùng SSH key riêng, đặt `DEPLOY_KEY_FILE`. Không lưu password hoặc private key trong repository.

## Deploy ứng dụng

```bash
pnpm deploy:test
```

Hoặc deploy riêng:

```bash
pnpm deploy:api
pnpm deploy:web
```

## Nginx và HTTPS

```bash
export DEPLOY_WEB_DOMAIN=app.example.com
export DEPLOY_API_DOMAIN=api.example.com
export DEPLOY_WEB_PORT=3004
export DEPLOY_API_PORT=3006
pnpm deploy:nginx -- admin@example.com
```

Server cần Node.js 22+, PM2, `rsync`, `tar`, Nginx và Certbot. Production secrets nên được cung cấp ở runtime hoặc qua secret manager; không commit `.env.deploy`.
