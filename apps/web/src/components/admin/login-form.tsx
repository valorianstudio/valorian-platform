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

export function LoginForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FieldErrors<LoginValues>>({});
  const [apiError, setApiError] = useState<ApiError | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    const form = new FormData(event.currentTarget);
    const parsed = loginSchema.safeParse({ email: form.get('email'), password: form.get('password') });
    if (!parsed.success) {
      setErrors(toFieldErrors<LoginValues>(parsed.error));
      return;
    }

    setErrors({});
    setApiError(null);
    setSubmitting(true);
    try {
      await apiRequest('POST', '/auth/login', parsed.data);
      router.replace('/admin');
      router.refresh();
    } catch (error) {
      setApiError(error instanceof ApiError ? error : new ApiError('Something went wrong.', 0));
      setSubmitting(false);
    }
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
