'use client';

import { Construction } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { PageHeader } from './page-header';

export function PagePlaceholder({
  title,
  description,
}: Readonly<{ title: string; description: string }>) {
  const { t } = useTranslation();

  return (
    <>
      <PageHeader title={title} description={description} />
      <section className="surface placeholder">
        <Construction size={28} />
        <h2>{t('common.placeholder.title')}</h2>
        <p>{t('common.placeholder.description')}</p>
      </section>
    </>
  );
}
