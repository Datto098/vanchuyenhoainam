'use client';

import { useEffect } from 'react';
import { refreshSession } from '@/lib/api/api-client';
import { useAuthStore } from '../stores/auth-store';

export function AuthBootstrap() {
  const initialized = useAuthStore((state) => state.initialized);
  const setInitialized = useAuthStore((state) => state.setInitialized);
  useEffect(() => {
    if (!initialized) void refreshSession().catch(setInitialized);
  }, [initialized, setInitialized]);
  return null;
}
