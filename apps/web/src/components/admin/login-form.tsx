'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/field';
import { ApiError, apiRequest } from '@/lib/client-api';
import { loginSchema, toFieldErrors } from '@/lib/schemas';
import type { FieldErrors, LoginValues } from '@/lib/schemas';
import { FormAlert } from './form-alert';

interface LoginResponse {
  requiresTwoFactor?: boolean;
  challenge?: string;
}

export function LoginForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FieldErrors<LoginValues>>({});
  const [apiError, setApiError] = useState<ApiError | null>(null);
  const [challenge, setChallenge] = useState<string | null>(null);

  function finish() {
    router.replace('/admin');
    router.refresh();
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    const form = new FormData(event.currentTarget);

    if (challenge) {
      const code = String(form.get('code') ?? '').trim();
      if (!code) return setErrors({ password: 'Enter your verification code' });
      setErrors({});
      setApiError(null);
      setSubmitting(true);
      try {
        await apiRequest('POST', '/auth/login/2fa', { challenge, code });
        finish();
      } catch (error) {
        setApiError(error instanceof ApiError ? error : new ApiError('Something went wrong.', 0));
        setSubmitting(false);
      }
      return;
    }

    const parsed = loginSchema.safeParse({ email: form.get('email'), password: form.get('password') });
    if (!parsed.success) {
      setErrors(toFieldErrors<LoginValues>(parsed.error));
      return;
    }
    setErrors({});
    setApiError(null);
    setSubmitting(true);
    try {
      const result = await apiRequest<LoginResponse>('POST', '/auth/login', parsed.data);
      if (result.requiresTwoFactor && result.challenge) {
        setChallenge(result.challenge);
        setSubmitting(false);
        return;
      }
      finish();
    } catch (error) {
      setApiError(error instanceof ApiError ? error : new ApiError('Something went wrong.', 0));
      setSubmitting(false);
    }
  }

  if (challenge) {
    return (
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <FormAlert error={apiError} />
        <p className="text-sm text-muted">Enter the 6-digit code from your authenticator app, or one of your backup codes.</p>
        <Field label="Verification code" error={errors.password}>
          {(props) => <Input {...props} name="code" inputMode="numeric" autoComplete="one-time-code" autoFocus required />}
        </Field>
        <Button type="submit" loading={submitting} className="w-full">
          {submitting ? 'Verifying…' : 'Verify and sign in'}
        </Button>
        <Button variant="ghost" className="w-full" onClick={() => { setChallenge(null); setApiError(null); }}>
          Back
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <FormAlert error={apiError} />
      <Field label="Email" error={errors.email}>
        {(props) => <Input {...props} name="email" type="email" autoComplete="username" inputMode="email" required />}
      </Field>
      <Field label="Password" error={errors.password}>
        {(props) => <Input {...props} name="password" type="password" autoComplete="current-password" required />}
      </Field>
      <Button type="submit" loading={submitting} className="w-full">
        {submitting ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  );
}
