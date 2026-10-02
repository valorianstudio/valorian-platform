'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/field';
import { ApiError, apiRequest } from '@/lib/client-api';
import { passwordSchema, toFieldErrors } from '@/lib/schemas';
import type { FieldErrors, PasswordValues } from '@/lib/schemas';
import { FormAlert } from './form-alert';

export function ForcedPasswordForm({ endpoint = '/admin/profile/password', redirectTo = '/admin' }: { endpoint?: string; redirectTo?: string }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FieldErrors<PasswordValues>>({});
  const [apiError, setApiError] = useState<ApiError | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    const form = new FormData(event.currentTarget);
    const parsed = passwordSchema.safeParse({ currentPassword: form.get('currentPassword'), newPassword: form.get('newPassword'), confirmPassword: form.get('confirmPassword') });
    if (!parsed.success) return setErrors(toFieldErrors<PasswordValues>(parsed.error));
    setErrors({});
    setApiError(null);
    setSubmitting(true);
    try {
      await apiRequest('POST', endpoint, { currentPassword: parsed.data.currentPassword, newPassword: parsed.data.newPassword });
      router.replace(redirectTo);
      router.refresh();
    } catch (error) {
      setApiError(error instanceof ApiError ? error : null);
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <FormAlert error={apiError} />
      <Field label="Temporary password" error={errors.currentPassword}>
        {(props) => <Input {...props} name="currentPassword" type="password" autoComplete="current-password" required />}
      </Field>
      <Field label="New password" error={errors.newPassword} hint="Use a long passphrase. Avoid your name or email.">
        {(props) => <Input {...props} name="newPassword" type="password" autoComplete="new-password" required />}
      </Field>
      <Field label="Confirm new password" error={errors.confirmPassword}>
        {(props) => <Input {...props} name="confirmPassword" type="password" autoComplete="new-password" required />}
      </Field>
      <Button type="submit" loading={submitting} className="w-full">
        {submitting ? 'Saving…' : 'Set password and continue'}
      </Button>
    </form>
  );
}
