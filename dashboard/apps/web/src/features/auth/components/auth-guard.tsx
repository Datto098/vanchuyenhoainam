'use client';

import { useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { LoadingState } from '@/components/ui/feedback';
import { useTranslation } from '@/lib/i18n';
import { useAuthStore } from '../stores/auth-store';

export function AuthGuard({ children }: Readonly<{ children: ReactNode }>) {
  const { t } = useTranslation();
  const router = useRouter();
  const initialized = useAuthStore((state) => state.initialized);
  const accessToken = useAuthStore((state) => state.accessToken);
  useEffect(() => {
    if (initialized && !accessToken) router.replace('/login');
  }, [accessToken, initialized, router]);
  if (!initialized || !accessToken)
    return <LoadingState contained={false} label={t('auth.authenticating')} />;
  return children;
}
