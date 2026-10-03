'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Field, Input } from '@/components/ui/field';
import { useToast } from '@/components/ui/toast';
import { ApiError, apiRequest } from '@/lib/client-api';
import { FormAlert } from '../form-alert';

export interface SecurityValues {
  sessionHours: number;
  minPasswordLength: number;
  maxFailedLogins: number;
  lockoutMinutes: number;
  auditRetentionDays: number;
}

const FIELDS: { key: keyof SecurityValues; label: string; hint: string; min: number; max: number }[] = [
  { key: 'sessionHours', label: 'Session length (hours)', hint: 'How long a sign-in lasts before it expires.', min: 1, max: 720 },
  { key: 'minPasswordLength', label: 'Minimum password length', hint: 'Long passphrases are encouraged over complex rules.', min: 8, max: 64 },
  { key: 'maxFailedLogins', label: 'Failed sign-ins before lockout', hint: 'Consecutive failures that lock an account.', min: 3, max: 20 },
  { key: 'lockoutMinutes', label: 'Lockout duration (minutes)', hint: 'How long a locked account stays locked.', min: 1, max: 1440 },
  { key: 'auditRetentionDays', label: 'Audit retention (days)', hint: 'Recorded for reference. Entries are never edited.', min: 30, max: 3650 },
];

export function SecurityForm({ values }: { values: SecurityValues }) {
  const router = useRouter();
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    setBusy(true);
    setError(null);
    try {
      await apiRequest('PUT', '/admin/security', {
        ...Object.fromEntries(FIELDS.map(({ key }) => [key, Number(form.get(key))])),
        confirmPassword: String(form.get('confirmPassword') ?? ''),
      });
      toast.success('Security settings saved.');
      (formElement.elements.namedItem('confirmPassword') as HTMLInputElement).value = '';
      router.refresh();
    } catch (e) {
      setError(e instanceof ApiError ? e : null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="max-w-2xl p-6">
      <form onSubmit={onSubmit} className="space-y-5">
        <FormAlert error={error} />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {FIELDS.map((field) => (
            <Field key={field.key} label={field.label} hint={field.hint}>
              {(props) => <Input {...props} name={field.key} type="number" inputMode="numeric" min={field.min} max={field.max} defaultValue={values[field.key]} required />}
            </Field>
          ))}
        </div>
        <Field label="Your password" hint="Required to change security settings.">
          {(props) => <Input {...props} name="confirmPassword" type="password" autoComplete="current-password" required />}
        </Field>
        <Button type="submit" loading={busy}>
          Save settings
        </Button>
      </form>
    </Card>
  );
}
