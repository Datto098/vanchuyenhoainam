# Feature conventions

Mỗi business feature dùng vertical slice:

```text
features/<feature>/
├── api/          # typed HTTP functions only
├── components/   # feature-specific UI
├── hooks/        # React Query queries and mutations
├── schemas/      # form/input validation (Zod)
├── stores/       # Zustand only for client UI state when needed
└── utils/        # pure domain presentation helpers
```

Quy ước:

- Server-state thuộc React Query, không copy vào Zustand.
- Zustand chỉ giữ ephemeral UI state như selected store, filters draft hoặc drawer state.
- API clients chỉ được tạo tại `src/lib/api`.
- Query keys tập trung tại `src/lib/query/query-keys.ts`.
- Mutation phải invalidate hoặc update đúng query cache.
- Shared API/domain contracts thuộc `packages/shared-types`.
- Route files trong `src/app` chỉ compose feature components; không chứa business fetching logic lớn.
- Tailwind dùng cho component layout/state; global CSS giữ reset, tokens và application shell primitives.
