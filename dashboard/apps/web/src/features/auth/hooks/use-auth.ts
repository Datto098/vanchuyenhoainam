'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/auth-api';
import { useAuthStore } from '../stores/auth-store';

export function useLoginMutation() {
  const setSession = useAuthStore((state) => state.setSession);
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: ({ accessToken, user }) => setSession(accessToken, user),
  });
}

export function useLogoutMutation() {
  const clearSession = useAuthStore((state) => state.clearSession);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      clearSession();
      queryClient.clear();
    },
  });
}
