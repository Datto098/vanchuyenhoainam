import type { AuthResponse, AuthUser, LoginRequest } from '@auto-tags/shared-types';
import { apiClient, publicApiClient } from '@/lib/api/api-client';

export const authApi = {
  async login(input: LoginRequest) {
    return (await publicApiClient.post<AuthResponse>('/auth/login', input)).data;
  },
  async me() {
    return (await apiClient.get<AuthUser>('/auth/me')).data;
  },
  async logout() {
    await apiClient.post('/auth/logout');
  },
};
