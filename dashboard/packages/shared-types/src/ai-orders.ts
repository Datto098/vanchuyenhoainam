export type AiOrderTaskStatus =
  'queued' | 'processing' | 'needs_confirmation' | 'success' | 'failed';

export interface AiOrderUsage {
  inputTokens: number;
  cachedInputTokens: number;
  outputTokens: number;
  costUsd: number;
  latencyMs: number;
}

export interface AiOrderTask {
  id: string;
  userId: string;
  platform: '1688' | 'taobao' | 'tmall';
  pageUrl: string;
  status: AiOrderTaskStatus;
  stage: string;
  message: string;
  attemptCount: number;
  orderId: string | null;
  usage: AiOrderUsage[];
  createdAt: string;
  updatedAt: string;
}

export interface AiOrderOverview {
  totalTasks: number;
  counts: Record<AiOrderTaskStatus, number>;
  totalCost: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  usdToVndRate: number;
  exchangeRateUpdatedAt: string;
  exchangeRateSource: string;
}

export interface OpenAiKeyConfig {
  id: string;
  name: string;
  model: string;
  inputPricePerMillion: number;
  cachedInputPricePerMillion: number;
  outputPricePerMillion: number;
  apiKeyConfigured: boolean;
  keyLastFour: string | null;
  enabled: boolean;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export type SaveOpenAiKeyInput = Omit<
  OpenAiKeyConfig,
  'id' | 'apiKeyConfigured' | 'keyLastFour' | 'createdAt' | 'updatedAt'
> & { apiKey?: string };
