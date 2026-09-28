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
export NEXT_PUBLIC_API_URL=https://api-agent.dttech.site/api
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

Trước khi chạy, tạo hai bản ghi DNS `A` (hoặc `AAAA`) cùng trỏ tới VPS:

- `agent.dttech.site`: dashboard Next.js.
- `api-agent.dttech.site`: NestJS API.

```bash
export DEPLOY_WEB_DOMAIN=agent.dttech.site
export DEPLOY_API_DOMAIN=api-agent.dttech.site
export DEPLOY_WEB_PORT=3014
export DEPLOY_API_PORT=3016
pnpm deploy:nginx -- admin@example.com
```

Các URL production phải đồng bộ như sau:

```dotenv
# .env.deploy (API runtime)
WEB_ORIGIN=https://agent.dttech.site
API_PUBLIC_URL=https://api-agent.dttech.site

# shell dùng lúc build web
NEXT_PUBLIC_API_URL=https://api-agent.dttech.site/api
```

Server cần Node.js 22+, PM2, `rsync`, `tar`, Nginx và Certbot. Production secrets nên được cung cấp ở runtime hoặc qua secret manager; không commit `.env.deploy`.

## Deploy lên VPS datto

Profile `datto` sử dụng SSH alias đã cấu hình trong `~/.ssh/config`:

```text
Host datto
  HostName 103.74.100.65
  User root
```

File `dashboard/.env.deploy` đã được chuẩn bị với MongoDB local trên VPS, domain production, JWT/encryption secrets và tài khoản admin. Nếu cần tạo lại từ mẫu:

```bash
cd dashboard
cp deployInfo/api/test/api.env.example .env.deploy
# Thay các secret trước khi deploy.
```

Các lệnh deploy:

```bash
# API + dashboard
pnpm deploy:datto

# Deploy từng dịch vụ
pnpm deploy:datto:api
pnpm deploy:datto:web

# Cài/cập nhật Nginx và Let's Encrypt
pnpm deploy:datto:nginx -- admin@example.com

# Deploy app rồi cài/cập nhật Nginx
pnpm deploy:datto:full -- admin@example.com
```

Profile mặc định dùng `/var/www/auto_tags_api`, `/var/www/auto_tags_web`, cổng nội bộ `3016`/`3014` và hai domain `api-agent.dttech.site`/`agent.dttech.site`. Có thể ghi đè bằng các biến `DEPLOY_*` hiện có. Hai cổng này được tách khỏi dịch vụ `agent_relay` cũ trên VPS.

Mỗi lần deploy API, script dùng `MONGODB_URI` trong `.env.deploy`, sau đó tự chạy database migration và tạo tài khoản admin nếu chưa tồn tại. `OPENAI_API_KEY` có thể để trống trong environment và cấu hình sau tại trang AI Settings; key được mã hóa trước khi lưu vào MongoDB.
