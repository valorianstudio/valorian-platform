'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/field';
import { ApiError, apiRequest } from '@/lib/client-api';
import { FormAlert } from '@/components/admin/form-alert';

export function ClientLoginForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [forgot, setForgot] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    const form = new FormData(event.currentTarget);
    setSubmitting(true);
    setError(null);
    try {
      await apiRequest('POST', '/client-auth/login', { email: String(form.get('email') ?? ''), password: String(form.get('password') ?? '') });
      router.replace('/client/dashboard');
      router.refresh();
    } catch (e) {
      setError(e instanceof ApiError ? e : new ApiError('Something went wrong.', 0));
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <FormAlert error={error} />
      <Field label="Email">{(props) => <Input {...props} name="email" type="email" autoComplete="username" inputMode="email" required />}</Field>
      <Field label="Password">{(props) => <Input {...props} name="password" type="password" autoComplete="current-password" required />}</Field>
      <Button type="submit" loading={submitting} className="w-full">
        {submitting ? 'Signing in…' : 'Sign in'}
      </Button>
      <button type="button" onClick={() => setForgot((v) => !v)} className="block w-full py-2.5 text-center text-sm text-muted transition-colors hover:text-foreground">
        Forgot your password?
      </button>
      {forgot && <p className="rounded-lg bg-surface-strong p-3 text-sm text-muted">Contact your Valorian project lead and we will reset your access.</p>}
    </form>
  );
}
