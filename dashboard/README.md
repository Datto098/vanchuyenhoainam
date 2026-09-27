# AI Order Dashboard

Monorepo cho hệ thống nhận dữ liệu sản phẩm từ Chrome extension, dùng OpenAI chuẩn hóa thông tin và gọi API tạo order.

## Workspace

- `apps/web`: Next.js dashboard tại `http://localhost:3000`.
- `apps/api`: NestJS API tại `http://localhost:3001/api`.
- `packages/shared-types`: contracts dùng chung giữa web và API.

## Chạy local

Yêu cầu Node.js 22+, pnpm 11.8+ và MongoDB.

```bash
cp apps/web/.env.example apps/web/.env.local
pnpm install
pnpm seed:admin
pnpm dev:api
pnpm dev:web
```

## Chức năng

- `/ai-orders`: theo dõi task, trạng thái order, token usage và fee.
- `/ai-settings`: quản lý model `gpt-6-luna`, OpenAI API key mã hóa và pricing.
- `POST /api/extension/tasks`: nhận task từ extension.
- `GET /api/extension/tasks/:id`: extension theo dõi kết quả.
- Backend gọi API order tại `https://vanchuyenhoainam.vn/src/api/cart/add`.

## Kiểm tra

```bash
pnpm typecheck
pnpm lint
pnpm build
```
