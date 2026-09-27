'use client';

import { useTranslation } from '@/lib/i18n';

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  const { t } = useTranslation();

  return (
    <div className="route-error">
      <h2>{t('common.errorTitle')}</h2>
      <p>{t('common.errorDesc')}</p>
      <button onClick={reset}>{t('common.retry')}</button>
    </div>
  );
}
