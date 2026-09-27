import {
  forwardRef,
  type InputHTMLAttributes,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react';
import { ChevronDown, ChevronsUpDown, Check } from 'lucide-react';
import { cn } from '@/lib/styles/cn';

const controlBase =
  'w-full rounded-lg border border-neutral-300 bg-white px-3 text-[13px] text-neutral-900 placeholder:text-neutral-400 outline-none transition shadow-2xs hover:border-neutral-400 focus:border-[#8a8a8a] focus:ring-1 focus:ring-[#8a8a8a]/30 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400 dark:border-neutral-700 dark:bg-[#1a1a1a] dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:hover:border-neutral-600 dark:focus:border-neutral-500 dark:focus:ring-1 dark:focus:ring-neutral-500/30 dark:disabled:bg-neutral-850 dark:disabled:text-neutral-500';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return <input ref={ref} className={cn(controlBase, 'h-8', className)} {...props} />;
  },
);

export const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement> & { variant?: 'single' | 'double' }
>(function Select({ className, children, variant = 'single', ...props }, ref) {
  return (
    <div className="relative inline-flex w-full items-center">
      <select
        ref={ref}
        className={cn(controlBase, 'h-8 appearance-none pr-8 cursor-pointer', className)}
        {...props}
      >
        {children}
      </select>
      <span className="pointer-events-none absolute right-2.5 flex items-center text-neutral-500 dark:text-neutral-400">
        {variant === 'double' ? <ChevronsUpDown size={13} /> : <ChevronDown size={14} />}
      </span>
    </div>
  );
});

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(controlBase, 'min-h-20 py-2 leading-relaxed', className)}
      {...props}
    />
  );
});

export const Checkbox = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Checkbox({ className, id, ...props }, ref) {
    return (
      <span className="relative inline-flex size-4 shrink-0 items-center justify-center">
        <input
          type="checkbox"
          id={id}
          ref={ref}
          className={cn(
            'peer size-4 cursor-pointer appearance-none rounded-[5.5px] border border-neutral-300 bg-white shadow-2xs transition hover:border-neutral-400 focus:outline-none focus:ring-1 focus:ring-[#8a8a8a]/40 checked:border-[#1a1a1a] checked:bg-[#1a1a1a] dark:border-neutral-700 dark:bg-[#1a1a1a] dark:hover:border-neutral-600 dark:checked:border-white dark:checked:bg-white',
            className,
          )}
          {...props}
        />
        <Check
          size={10}
          strokeWidth={3.5}
          className="pointer-events-none absolute text-white opacity-0 transition-opacity peer-checked:opacity-100 dark:text-neutral-900"
        />
      </span>
    );
  },
);

export function Field({
  label,
  hint,
  required,
  className,
  children,
}: Readonly<{
  label: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}>) {
  return (
    <label
      className={cn(
        'grid gap-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300',
        className,
      )}
    >
      <span className="flex items-center gap-1">
        {label}
        {required && <span className="text-red-500 font-semibold">*</span>}
      </span>
      {children}
      {hint ? (
        <small className="font-normal text-[11px] leading-tight text-neutral-500 dark:text-neutral-400">
          {hint}
        </small>
      ) : null}
    </label>
  );
}
