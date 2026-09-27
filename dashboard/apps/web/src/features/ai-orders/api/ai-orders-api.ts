import type {
  AiOrderOverview,
  AiOrderTask,
  OpenAiKeyConfig,
  PaginatedResponse,
  SaveOpenAiKeyInput,
} from '@auto-tags/shared-types';
import { apiClient } from '@/lib/api/api-client';

export const aiOrdersApi = {
  overview: async () => (await apiClient.get<AiOrderOverview>('/ai-orders/overview')).data,
  list: async ({ page, pageSize }: { page: number; pageSize: number }) =>
    (
      await apiClient.get<PaginatedResponse<AiOrderTask>>('/ai-orders', {
        params: { page, pageSize },
      })
    ).data,
  keys: async () => (await apiClient.get<OpenAiKeyConfig[]>('/ai-orders/keys')).data,
  createKey: async (input: SaveOpenAiKeyInput & { apiKey: string }) =>
    (await apiClient.post<OpenAiKeyConfig>('/ai-orders/keys', input)).data,
  updateKey: async ({ id, input }: { id: string; input: SaveOpenAiKeyInput }) =>
    (await apiClient.patch<OpenAiKeyConfig>(`/ai-orders/keys/${id}`, input)).data,
};
