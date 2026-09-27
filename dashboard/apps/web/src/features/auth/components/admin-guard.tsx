'use client';

import { useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { UserRole } from '@auto-tags/shared-types';
import { LoadingState } from '@/components/ui/feedback';
import { useTranslation } from '@/lib/i18n';
import { useAuthStore } from '../stores/auth-store';

export function AdminGuard({ children }: Readonly<{ children: ReactNode }>) {
  const { t } = useTranslation();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  useEffect(() => {
    if (user && user.role !== UserRole.ADMIN) router.replace('/ai-orders');
  }, [router, user]);
  if (!user || user.role !== UserRole.ADMIN) {
    return <LoadingState contained={false} label={t('auth.checkingPermission')} />;
  }
  return children;
}
