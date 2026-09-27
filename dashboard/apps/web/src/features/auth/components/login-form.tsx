'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { ApiRequestError } from '@/lib/errors/api-request-error';
import { Alert } from '@/components/ui/feedback';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/form-control';
import { useTranslation } from '@/lib/i18n';
import { LanguageSwitcher } from '@/lib/i18n';
import { ThemeToggle } from '@/lib/theme';
import { useLoginMutation } from '../hooks/use-auth';
import { loginSchema } from '../schemas/login-schema';

export function LoginForm() {
  const { t } = useTranslation();
  const search = useSearchParams();
  const router = useRouter();
  const login = useLoginMutation();
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const form = new FormData(event.currentTarget);
    const parsed = loginSchema.safeParse({
      email: String(form.get('email') ?? ''),
      password: String(form.get('password') ?? ''),
    });
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      const field = issue?.path[0];
      const message =
        field === 'email'
          ? t('auth.invalidEmail')
          : field === 'password'
            ? t('auth.passwordMinLength')
            : t('common.feedback.error');
      setError(message);
      return;
    }
    try {
      await login.mutateAsync(parsed.data);
      router.replace(search.get('from') ?? '/ai-orders');
    } catch (cause) {
      setError(cause instanceof ApiRequestError ? cause.message : t('common.feedback.error'));
    }
  }

  return (
    <form
      className="relative w-full max-w-[400px] rounded-2xl border border-neutral-200/90 bg-white p-7 shadow-2xl dark:border-neutral-800 dark:bg-[#1c1c1c]"
      onSubmit={submit}
    >
      <div className="absolute right-6 top-6 flex items-center gap-2">
        <ThemeToggle />
        <LanguageSwitcher />
      </div>
      <h1 className="m-0 text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
        {t('auth.loginTitle')}
      </h1>
      <p className="mb-5 mt-1 text-xs text-neutral-500 dark:text-neutral-400">
        {t('auth.loginSubtitle')}
      </p>
      <label className="mt-4 grid gap-1.5 text-[13px] font-semibold text-neutral-700 dark:text-neutral-300">
        {t('auth.email')}
        <Input
          name="email"
          type="email"
          autoComplete="email"
          placeholder={t('auth.emailPlaceholder')}
          required
        />
      </label>
      <label className="mt-4 grid gap-1.5 text-[13px] font-semibold text-neutral-700 dark:text-neutral-300">
        {t('auth.password')}
        <Input
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder={t('auth.passwordPlaceholder')}
          required
          minLength={8}
        />
      </label>
      {error ? (
        <div className="mt-4">
          <Alert>{error}</Alert>
        </div>
      ) : null}
      <Button className="mt-5 w-full" type="submit" variant="primary" disabled={login.isPending}>
        {login.isPending ? t('auth.submitting') : t('auth.submit')}
      </Button>
    </form>
  );
}
