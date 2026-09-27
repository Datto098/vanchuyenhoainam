# Architecture
This a pnpm monorepo with a Next.js dashboard, NestJS API, Shopify CLI workspace and shared TypeScript contracts.

Each Shopify store is a tenant. Business documents added later must contain `shopId`, and every store-scoped API must verify `ShopMembership`.

Store credentials and tokens are encrypted with AES-256-GCM. The initial connection strategy is `client_credentials`; OAuth authorization-code support should be added as a second strategy for stores outside the app organization.

Domain modules belong under `apps/api/src/modules` and matching frontend features under `apps/web/src/features` without coupling them to platform authentication or credential storage.
