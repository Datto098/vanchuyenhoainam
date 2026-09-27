'use client';

import { Suspense } from 'react';
import { LoadingState } from '@/components/ui/feedback';
import { LoginForm } from '@/features/auth/components/login-form';
import { useTranslation } from '@/lib/i18n';

function LoginFallback() {
  const { t } = useTranslation();
  return <LoadingState contained={false} label={t('common.loading')} />;
}

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-neutral-100 dark:bg-[#0f0f0f] p-6">
      <Suspense fallback={<LoginFallback />}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
