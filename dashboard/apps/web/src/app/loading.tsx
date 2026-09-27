'use client';

import { LoadingState } from '@/components/ui/feedback';
import { useTranslation } from '@/lib/i18n';

export default function Loading() {
  const { t } = useTranslation();
  return <LoadingState contained={false} label={t('common.loading')} />;
}
