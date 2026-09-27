'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { aiOrdersApi } from '../api/ai-orders-api';

const keys = {
  list: (page: number, pageSize: number) => ['ai-orders', 'list', page, pageSize] as const,
  overview: ['ai-orders', 'overview'] as const,
  openAiKeys: ['ai-orders', 'keys'] as const,
};

export function useAiOrderOverview() {
  return useQuery({
    queryKey: keys.overview,
    queryFn: aiOrdersApi.overview,
    refetchInterval: 5000,
  });
}

export function useAiOrderTasks(page: number, pageSize: number) {
  return useQuery({
    queryKey: keys.list(page, pageSize),
    queryFn: () => aiOrdersApi.list({ page, pageSize }),
    refetchInterval: 5000,
  });
}

export function useOpenAiKeys() {
  return useQuery({ queryKey: keys.openAiKeys, queryFn: aiOrdersApi.keys });
}

export function useCreateOpenAiKey() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: aiOrdersApi.createKey,
    onSuccess: async () => client.invalidateQueries({ queryKey: keys.openAiKeys }),
  });
}

export function useUpdateOpenAiKey() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: aiOrdersApi.updateKey,
    onSuccess: async () => client.invalidateQueries({ queryKey: keys.openAiKeys }),
  });
}
