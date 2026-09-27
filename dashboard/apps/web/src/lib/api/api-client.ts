import type { ApiErrorResponse, AuthResponse } from '@auto-tags/shared-types';
import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/features/auth/stores/auth-store';
import { ApiRequestError } from '@/lib/errors/api-request-error';
import { getErrorMessage } from '@/lib/errors/error-messages';

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';
export const publicApiClient = axios.create({ baseURL, withCredentials: true, timeout: 15_000 });
export const apiClient = axios.create({ baseURL, withCredentials: true, timeout: 15_000 });
let refreshRequest: Promise<AuthResponse> | null = null;

export async function refreshSession() {
  refreshRequest ??= publicApiClient
    .post<AuthResponse>('/auth/refresh')
    .then(({ data }) => {
      useAuthStore.getState().setSession(data.accessToken, data.user);
      return data;
    })
    .finally(() => {
      refreshRequest = null;
    });
  return refreshRequest;
}

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.set('Authorization', `Bearer ${token}`);
  return config;
});

type RetryableConfig = InternalAxiosRequestConfig & { _retry?: boolean };
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const request = error.config as RetryableConfig | undefined;
    if (error.response?.status === 401 && request && !request._retry) {
      request._retry = true;
      try {
        const session = await refreshSession();
        request.headers.set('Authorization', `Bearer ${session.accessToken}`);
        return await apiClient(request);
      } catch {
        useAuthStore.getState().clearSession();
      }
    }
    return Promise.reject(normalizeError(error));
  },
);
publicApiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => Promise.reject(normalizeError(error)),
);

function normalizeError(error: AxiosError) {
  const body = error.response?.data as Partial<ApiErrorResponse> | undefined;
  if (error.response) {
    const code = body?.errorCode ?? `HTTP_${error.response.status}`;
    const message = Array.isArray(body?.message) ? body.message.join(' ') : body?.message;
    return new ApiRequestError(getErrorMessage(code, message), code, error.response.status, body);
  }
  return new ApiRequestError(getErrorMessage('NETWORK_ERROR'), 'NETWORK_ERROR', null);
}
