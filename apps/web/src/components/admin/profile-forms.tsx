'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Field, Input } from '@/components/ui/field';
import { useToast } from '@/components/ui/toast';
import { ApiError, apiRequest } from '@/lib/client-api';
import { passwordSchema, profileSchema, toFieldErrors } from '@/lib/schemas';
import type { FieldErrors, PasswordValues, ProfileValues } from '@/lib/schemas';
import type { AdminProfile } from '@/lib/types';
import { FormAlert } from './form-alert';

export function ProfileForm({ admin }: { admin: AdminProfile }) {
  const router = useRouter();
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FieldErrors<ProfileValues>>({});
  const [apiError, setApiError] = useState<ApiError | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    const form = new FormData(event.currentTarget);
    const parsed = profileSchema.safeParse({ name: form.get('name'), email: form.get('email') });
    if (!parsed.success) {
      setErrors(toFieldErrors<ProfileValues>(parsed.error));
      return;
    }
    setErrors({});
    setApiError(null);
    setSubmitting(true);
    try {
      await apiRequest('PATCH', '/admin/profile', parsed.data);
      toast.success('Profile updated.');
      router.refresh();
    } catch (error) {
      setApiError(error instanceof ApiError ? error : null);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold">Account details</h2>
      <form onSubmit={onSubmit} noValidate className="mt-5 space-y-5">
        <FormAlert error={apiError} />
        <Field label="Name" error={errors.name}>
          {(props) => <Input {...props} name="name" defaultValue={admin.name} autoComplete="name" required />}
        </Field>
        <Field label="Email" error={errors.email}>
          {(props) => <Input {...props} name="email" type="email" defaultValue={admin.email} autoComplete="email" required />}
        </Field>
        <Button type="submit" loading={submitting}>
          Save changes
        </Button>
      </form>
    </Card>
  );
}

export function PasswordForm() {
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FieldErrors<PasswordValues>>({});
  const [apiError, setApiError] = useState<ApiError | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const parsed = passwordSchema.safeParse({
      currentPassword: form.get('currentPassword'),
      newPassword: form.get('newPassword'),
      confirmPassword: form.get('confirmPassword'),
    });
    if (!parsed.success) {
      setErrors(toFieldErrors<PasswordValues>(parsed.error));
      return;
    }
    setErrors({});
    setApiError(null);
    setSubmitting(true);
    try {
      await apiRequest('POST', '/admin/profile/password', {
        currentPassword: parsed.data.currentPassword,
        newPassword: parsed.data.newPassword,
      });
      formElement.reset();
      toast.success('Password changed.');
    } catch (error) {
      setApiError(error instanceof ApiError ? error : null);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold">Change password</h2>
      <form onSubmit={onSubmit} noValidate className="mt-5 space-y-5">
        <FormAlert error={apiError} />
        <Field label="Current password" error={errors.currentPassword}>
          {(props) => <Input {...props} name="currentPassword" type="password" autoComplete="current-password" required />}
        </Field>
        <Field label="New password" error={errors.newPassword} hint="At least 10 characters.">
          {(props) => <Input {...props} name="newPassword" type="password" autoComplete="new-password" required />}
        </Field>
        <Field label="Confirm new password" error={errors.confirmPassword}>
          {(props) => <Input {...props} name="confirmPassword" type="password" autoComplete="new-password" required />}
        </Field>
        <Button type="submit" loading={submitting}>
          Update password
        </Button>
      </form>
    </Card>
  );
}
