'use client';

import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from '@/lib/i18n';
import { cn } from '@/lib/styles/cn';
import { IconButton } from './button';

export function Modal({
  title,
  description,
  onClose,
  children,
  className,
  size = 'md',
  closeAriaLabel,
}: Readonly<{
  title: string;
  description?: ReactNode;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeAriaLabel?: string;
}>) {
  const { t } = useTranslation();
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-50 grid place-items-center bg-black/45 backdrop-blur-[2px] p-4"
      role="presentation"
      onMouseDown={onClose}
    >
      <motion.section
        initial={{ opacity: 0, scale: 0.96, y: 6 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 6 }}
        transition={{ type: 'spring', damping: 26, stiffness: 360 }}
        className={cn(
          'max-h-[calc(100vh-2rem)] w-full overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-2xl dark:border-neutral-800 dark:bg-[#1a1a1a]',
          sizeClasses[size],
          className,
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="flex items-center justify-between gap-3 border-b border-neutral-200/80 px-4 py-3 dark:border-neutral-800">
          <div>
            <h2
              id="modal-title"
              className="m-0 text-[14px] font-semibold text-neutral-900 dark:text-neutral-100"
            >
              {title}
            </h2>
            {description ? (
              <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">{description}</p>
            ) : null}
          </div>
          <IconButton
            aria-label={closeAriaLabel ?? t('common.actions.close')}
            size="sm"
            onClick={onClose}
          >
            <X size={16} />
          </IconButton>
        </header>
        <div className="overflow-y-auto max-h-[calc(100vh-7rem)]">{children}</div>
      </motion.section>
    </motion.div>
  );
}

export { AnimatePresence };
