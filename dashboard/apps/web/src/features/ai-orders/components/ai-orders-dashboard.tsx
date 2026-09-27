'use client';

import { AlertTriangle, Bot, CheckCircle2, Coins, Eye, ListTodo, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import type { AiOrderTask, AiOrderTaskStatus } from '@auto-tags/shared-types';
import { Badge, type BadgeTone } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable, TableScroll } from '@/components/ui/data-table';
import { ContentState, LoadingState } from '@/components/ui/feedback';
import { StatCard } from '@/components/ui/stat-card';
import { Pagination } from '@/components/ui/pagination';
import { AnimatePresence, Modal } from '@/components/ui/modal';
import { PageHeader } from '@/components/layout/page-header';
import { useTranslation } from '@/lib/i18n';
import { useAiOrderOverview, useAiOrderTasks } from '../hooks/use-ai-orders';

const statusTone: Record<AiOrderTaskStatus, BadgeTone> = {
  queued: 'warning',
  processing: 'info',
  needs_confirmation: 'purple',
  success: 'success',
  failed: 'danger',
};

export function AiOrdersDashboard() {
  const overview = useAiOrderOverview();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [reasonTask, setReasonTask] = useState<AiOrderTask | null>(null);
  const tasks = useAiOrderTasks(page, pageSize);
  const { t, locale, formatDateTime } = useTranslation();

  if (overview.isPending || tasks.isPending) return <LoadingState label={t('aiOrders.loading')} />;
  if (overview.isError || tasks.isError)
    return <ContentState title={t('aiOrders.loadError')} description={t('common.errorDesc')} />;

  const stats = overview.data;
  const numberLocale = locale === 'vi' ? 'vi-VN' : 'en-US';
  const formatUsd = (value: number, digits = 4) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    }).format(value);
  const formatVnd = (value: number) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(value * stats.usdToVndRate);
  return (
    <div className="max-w-7xl space-y-4">
      <PageHeader
        title={t('aiOrders.title')}
        description={t('aiOrders.description')}
        action={
          <Button size="sm" onClick={() => void Promise.all([overview.refetch(), tasks.refetch()])}>
            <RefreshCw size={13} /> {t('aiOrders.refresh')}
          </Button>
        }
      />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={ListTodo}
          label={t('aiOrders.totalTasks')}
          value={stats.totalTasks}
          detail={t('aiOrders.totalTasksDetail')}
        />
        <StatCard
          icon={CheckCircle2}
          tone="success"
          label={t('aiOrders.success')}
          value={stats.counts.success}
          detail={t('aiOrders.successDetail')}
        />
        <StatCard
          icon={AlertTriangle}
          tone="warning"
          label={t('aiOrders.attention')}
          value={stats.counts.failed + stats.counts.needs_confirmation}
          detail={t('aiOrders.attentionDetail')}
        />
        <StatCard
          icon={Coins}
          tone="purple"
          label={t('aiOrders.aiCost')}
          value={formatVnd(stats.totalCost)}
          detail={`${formatUsd(stats.totalCost)} · ${(stats.totalInputTokens + stats.totalOutputTokens).toLocaleString(numberLocale)} tokens`}
        />
      </section>

      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-neutral-500">
        <span>
          {t('aiOrders.exchangeRate', {
            rate: stats.usdToVndRate.toLocaleString('vi-VN'),
            time: formatDateTime(stats.exchangeRateUpdatedAt),
          })}
        </span>
        {stats.exchangeRateSource === 'ExchangeRate-API' ? (
          <a
            className="hover:text-neutral-800 hover:underline dark:hover:text-neutral-200"
            href="https://www.exchangerate-api.com"
            target="_blank"
            rel="noreferrer"
          >
            Rates by Exchange Rate API
          </a>
        ) : (
          <span>{t('aiOrders.exchangeFallback')}</span>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle title={t('aiOrders.recentTasks')} description={t('aiOrders.autoRefresh')} />
        </CardHeader>
        <TableScroll>
          <DataTable>
            <thead>
              <tr>
                <th>{t('aiOrders.columns.status')}</th>
                <th>{t('aiOrders.columns.product')}</th>
                <th>{t('aiOrders.columns.user')}</th>
                <th>{t('aiOrders.columns.usage')}</th>
                <th>{t('aiOrders.columns.time')}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {tasks.data.items.map((task) => {
                const tokens = task.usage.reduce(
                  (sum, item) => sum + item.inputTokens + item.outputTokens,
                  0,
                );
                const cost = task.usage.reduce((sum, item) => sum + item.costUsd, 0);
                return (
                  <tr key={task.id}>
                    <td>
                      <Badge tone={statusTone[task.status]}>
                        {t(`aiOrders.statuses.${task.status}`)}
                      </Badge>
                      <div className="mt-1 text-[11px] text-neutral-500">{task.stage}</div>
                    </td>
                    <td className="max-w-sm">
                      <a
                        className="block truncate font-medium hover:underline"
                        href={task.pageUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {task.platform} · {task.pageUrl}
                      </a>
                      <div
                        className="mt-1 max-w-sm truncate text-[11px] text-neutral-500"
                        title={task.message}
                      >
                        {task.message}
                      </div>
                    </td>
                    <td>{task.userId}</td>
                    <td>
                      {tokens.toLocaleString(numberLocale)} tokens
                      <div className="text-[11px] text-neutral-500">
                        {formatVnd(cost)} · {formatUsd(cost, 6)}
                      </div>
                    </td>
                    <td className="whitespace-nowrap">{formatDateTime(task.updatedAt)}</td>
                    <td>
                      {['failed', 'needs_confirmation'].includes(task.status) ? (
                        <Button size="xs" onClick={() => setReasonTask(task)}>
                          <Eye size={12} /> {t('aiOrders.viewReason')}
                        </Button>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
              {!tasks.data.items.length ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-neutral-500">
                    <Bot className="mx-auto mb-2" size={20} />
                    {t('aiOrders.empty')}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </DataTable>
        </TableScroll>
        <Pagination
          page={tasks.data.page}
          pageSize={tasks.data.pageSize}
          total={tasks.data.total}
          itemLabel={t('aiOrders.paginationItem')}
          onPageChange={setPage}
          onPageSizeChange={(value) => {
            setPageSize(value);
            setPage(1);
          }}
        />
      </Card>
      <AnimatePresence>
        {reasonTask ? (
          <Modal
            title={t('aiOrders.reasonTitle')}
            description={`${reasonTask.platform} · ${formatDateTime(reasonTask.updatedAt)}`}
            onClose={() => setReasonTask(null)}
            size="lg"
          >
            <div className="space-y-4 p-5">
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-900 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-200">
                {reasonTask.message}
              </div>
              <a
                className="block break-all text-xs text-neutral-500 hover:underline"
                href={reasonTask.pageUrl}
                target="_blank"
                rel="noreferrer"
              >
                {reasonTask.pageUrl}
              </a>
            </div>
          </Modal>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
