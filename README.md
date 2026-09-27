# Vận Chuyển Hoài Nam — AI Order

Chrome extension thu thập dữ liệu sản phẩm từ Taobao, Tmall và 1688. NestJS API trong `dashboard/` dùng OpenAI để chuẩn hóa dữ liệu rồi gọi API order hiện tại:

```text
POST https://vanchuyenhoainam.vn/src/api/cart/add
```

## Kiến trúc

```text
Chrome extension
  → POST http://localhost:3001/api/extension/tasks
  → NestJS + MongoDB + OpenAI Responses API
  → POST https://vanchuyenhoainam.vn/src/api/cart/add

Next.js dashboard: http://localhost:3000/ai-orders
AI settings:       http://localhost:3000/ai-settings
```

## Chạy local

Yêu cầu Node.js 22+, pnpm 11.8+ và Docker. File `dashboard/.env` đã được tạo cho local; điền `OPENAI_API_KEY` vào đó hoặc nhập key trong trang AI Settings.

```bash
cd dashboard
cp apps/web/.env.example apps/web/.env.local
docker compose up -d
pnpm install
pnpm seed:admin
pnpm dev:api
# terminal khác
pnpm dev:web
```

Sau đó reload extension trong `chrome://extensions`. Extension hiện gọi:

```js
const DASHBOARD_API_BASE = 'http://localhost:3001/api';
```

Đổi URL này và host permission trong `manifest.json` khi deploy production.

## Biến môi trường

- `OPENAI_API_KEY`: ưu tiên hơn key mã hóa lưu trong MongoDB.
- `TOKEN_ENCRYPTION_KEY`: mã hóa OpenAI key nhập từ dashboard.
- `EXTENSION_API_TOKEN`: tùy chọn, bảo vệ extension API bằng header `X-Extension-Token`.
- `ORDER_API_URL`: API order cũ.
- `MIN_AI_CONFIDENCE`: ngưỡng tự động tạo order, mặc định `0.7`.

Local đang để trống extension token. Trước production cần cấp token ngắn hạn hoặc xác thực user; không hard-code secret dài hạn trong extension.

## Luồng task

```text
queued → processing/ai_extraction → creating_order → success
                                  ↘ needs_confirmation
                                  ↘ failed
```

Model mặc định là `gpt-4o-mini` và sử dụng Structured Outputs. Pricing cấu hình mặc định: $0.15 input, $0.075 cached input và $0.60 output trên 1 triệu token; có thể chỉnh trong AI Settings.

Mỗi lần gọi OpenAI lưu input/output/cached tokens, latency và estimated USD cost. Task retry tạo thêm usage record để chi phí phản ánh đúng tổng số request.

## Kiểm tra cú pháp

```bash
pnpm --dir dashboard typecheck
pnpm --dir dashboard lint
```
