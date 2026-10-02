'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { FormAlert } from '@/components/admin/form-alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Field, Input } from '@/components/ui/field';
import { useToast } from '@/components/ui/toast';
import { ApiError, apiRequest } from '@/lib/client-api';
import type { ClientSession } from '@/lib/portal';

export function ClientProfileForm({ client }: { client: ClientSession }) {
  const router = useRouter();
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const isOwner = client.role === 'OWNER';

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = new FormData(event.currentTarget);
    const text = (key: string) => String(form.get(key) ?? '');
    setBusy(true);
    setError(null);
    try {
      await apiRequest('PATCH', '/client-auth/profile', {
        name: text('name'),
        phone: text('phone'),
        ...(isOwner ? { company: { contactPhone: text('contactPhone'), website: text('website'), industry: text('industry') } } : {}),
      });
      toast.success('Profile updated.');
      router.refresh();
    } catch (e) {
      setError(e instanceof ApiError ? e : null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="p-5 sm:p-6">
      <h2 className="font-semibold">Your details</h2>
      <form onSubmit={onSubmit} className="mt-5 space-y-5">
        <FormAlert error={error} />
        <Field label="Name">{(props) => <Input {...props} name="name" defaultValue={client.name} required maxLength={80} />}</Field>
        <Field label="Email" hint="Contact Valorian to change your sign-in email.">
          {(props) => <Input {...props} value={client.email} disabled readOnly />}
        </Field>
        <Field label="Phone">{(props) => <Input {...props} name="phone" defaultValue={client.phone ?? ''} maxLength={30} autoComplete="tel" />}</Field>
        <div className="border-t border-border pt-5">
          <h3 className="font-medium">{client.company?.companyName ?? client.companyName}</h3>
          {!isOwner && <p className="mt-1 text-sm text-muted">Only the account owner can edit company details.</p>}
          <div className="mt-4 space-y-5">
            <Field label="Industry">{(props) => <Input {...props} name="industry" defaultValue={client.company?.industry ?? ''} disabled={!isOwner} maxLength={80} />}</Field>
            <Field label="Website">{(props) => <Input {...props} name="website" defaultValue={client.company?.website ?? ''} disabled={!isOwner} placeholder="https://" />}</Field>
            <Field label="Company phone">{(props) => <Input {...props} name="contactPhone" defaultValue={client.company?.contactPhone ?? ''} disabled={!isOwner} maxLength={30} />}</Field>
          </div>
        </div>
        <Button type="submit" loading={busy}>
          Save changes
        </Button>
      </form>
    </Card>
  );
}

export function ClientPasswordForm() {
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    if (data.get('newPassword') !== data.get('confirmPassword')) return setError(new ApiError('Passwords do not match.', 400));
    setBusy(true);
    setError(null);
    try {
      await apiRequest('POST', '/client-auth/password', { currentPassword: String(data.get('currentPassword') ?? ''), newPassword: String(data.get('newPassword') ?? '') });
      form.reset();
      toast.success('Password changed. Other devices were signed out.');
    } catch (e) {
      setError(e instanceof ApiError ? e : null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="p-5 sm:p-6">
      <h2 className="font-semibold">Change password</h2>
      <form onSubmit={onSubmit} className="mt-5 space-y-5">
        <FormAlert error={error} />
        <Field label="Current password">{(props) => <Input {...props} name="currentPassword" type="password" autoComplete="current-password" required />}</Field>
        <Field label="New password" hint="Use a long passphrase.">{(props) => <Input {...props} name="newPassword" type="password" autoComplete="new-password" required />}</Field>
        <Field label="Confirm new password">{(props) => <Input {...props} name="confirmPassword" type="password" autoComplete="new-password" required />}</Field>
        <Button type="submit" loading={busy}>
          Update password
        </Button>
      </form>
    </Card>
  );
}
