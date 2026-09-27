import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';
import { Select } from './form-control';
import { useTranslation } from '@/lib/i18n';

type PaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  itemLabel?: string;
};

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  itemLabel,
}: PaginationProps) {
  const { t } = useTranslation();
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = total ? (page - 1) * pageSize + 1 : 0;
  const end = Math.min(page * pageSize, total);
  const displayItemLabel = itemLabel ?? t('common.pagination.items');

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200/80 px-4 py-2.5 dark:border-neutral-800">
      <span className="text-xs text-neutral-500 dark:text-neutral-400">
        {t('common.pagination.showing')}{' '}
        <strong className="font-semibold text-neutral-700 dark:text-neutral-300">
          {start}–{end}
        </strong>{' '}
        {t('common.pagination.of')}{' '}
        <strong className="font-semibold text-neutral-700 dark:text-neutral-300">{total}</strong>{' '}
        {displayItemLabel}
      </span>
      <div className="flex items-center gap-2">
        <label className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
          {t('common.pagination.perPage')}
          <Select
            className="h-7 w-18 py-0 px-2 text-xs"
            value={pageSize}
            aria-label={`${displayItemLabel} ${t('common.pagination.perPage')}`}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
          >
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </Select>
        </label>
        <span className="text-xs text-neutral-600 dark:text-neutral-300 min-w-16 text-center">
          {page} / {totalPages}
        </span>
        <div className="inline-flex items-center gap-1">
          <Button
            size="xs"
            className="px-1.5"
            aria-label={t('common.pagination.previous')}
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft size={14} />
          </Button>
          <Button
            size="xs"
            className="px-1.5"
            aria-label={t('common.pagination.next')}
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            <ChevronRight size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
}
