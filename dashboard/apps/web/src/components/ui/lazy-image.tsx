'use client';

import { memo, useState, type ImgHTMLAttributes, type ReactNode } from 'react';
import { ImageOff, LoaderCircle } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { cn } from '@/lib/styles/cn';

export interface LazyImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> {
  src: string;
  alt: string;
  containerClassName?: string;
  showSpinner?: boolean;
  spinnerSize?: number;
  fallback?: ReactNode;
}

const globalLoadedImageCache = new Set<string>();

export function isImageCached(url?: string): boolean {
  return Boolean(url && globalLoadedImageCache.has(url));
}

export const LazyImage = memo(function LazyImage(props: LazyImageProps) {
  // A new URL gets an isolated loading/error lifecycle without setting state during render.
  return <LazyImageSource key={props.src} {...props} />;
});

function LazyImageSource({
  src,
  alt,
  className,
  containerClassName,
  showSpinner = false,
  spinnerSize = 24,
  fallback,
  loading = 'lazy',
  decoding = 'async',
  onLoad,
  onError,
  ...props
}: LazyImageProps) {
  const { t } = useTranslation();
  const [loaded, setLoaded] = useState(() => isImageCached(src));
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  return (
    <div className={cn('relative overflow-hidden', containerClassName)}>
      {/* Skeleton / Spinner Placeholder - only visible when not yet loaded */}
      {!loaded && !error && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center bg-neutral-100/90 dark:bg-neutral-800/90"
        >
          {showSpinner && (
            <LoaderCircle
              size={spinnerSize}
              className="animate-spin text-neutral-600/80 dark:text-neutral-400/80"
            />
          )}
        </div>
      )}

      {/* Error Fallback */}
      {error && !loaded && (
        <button
          type="button"
          aria-label={t('common.actions.retryLoading', { alt })}
          onClick={(event) => {
            event.stopPropagation();
            setError(false);
            setLoaded(false);
            setRetryCount((current) => current + 1);
          }}
          className="absolute inset-0 z-10 flex size-full flex-col items-center justify-center gap-1.5 border-0 bg-neutral-50/95 p-2 text-center text-neutral-400 dark:bg-neutral-900/95 dark:text-neutral-500 cursor-pointer"
        >
          {fallback ?? (
            <>
              <ImageOff
                size={Math.min(spinnerSize, 22)}
                className="text-neutral-400 dark:text-neutral-500"
              />
              <span className="text-[10px] font-medium text-neutral-500 dark:text-neutral-400">
                {t('common.feedback.failedToLoad')}
              </span>
            </>
          )}
        </button>
      )}

      {/* Image Element */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={retryCount}
        src={src}
        alt={alt}
        loading={loading}
        decoding={decoding}
        onLoad={(e) => {
          if (src) globalLoadedImageCache.add(src);
          setLoaded(true);
          setError(false);
          onLoad?.(e);
        }}
        onError={(e) => {
          globalLoadedImageCache.delete(src);
          setLoaded(false);
          setError(true);
          onError?.(e);
        }}
        className={cn(
          'transition-opacity duration-200',
          loaded ? 'opacity-100' : 'opacity-0',
          className,
        )}
        {...props}
      />
    </div>
  );
}
