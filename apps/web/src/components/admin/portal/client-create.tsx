'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Copy, Plus } from 'lucide-react';
import { FormAlert } from '@/components/admin/form-alert';
import { Modal } from '@/components/admin/team/modal';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/field';
import { useToast } from '@/components/ui/toast';
import { ApiError, apiRequest } from '@/lib/client-api';

export interface ClientPrefill {
  companyName?: string;
  contactEmail?: string;
  contactPhone?: string;
  ownerName?: string;
}

export function ClientCreate({ prefill, defaultOpen = false, leadId }: { prefill?: ClientPrefill; defaultOpen?: boolean; leadId?: string }) {
  const router = useRouter();
  const toast = useToast();
  const [open, setOpen] = useState(defaultOpen);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [created, setCreated] = useState<{ id: string; email: string; temporaryPassword: string | null } | null>(null);

  function close() {
    setOpen(false);
    if (created) router.push(leadId ? `/admin/projects/new?lead=${encodeURIComponent(leadId)}&client=${created.id}` : `/admin/clients/${created.id}`);
    else router.refresh();
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const f = new FormData(event.currentTarget);
    const text = (key: string) => String(f.get(key) ?? '');
    setBusy(true);
    setError(null);
    try {
      const result = await apiRequest<{ id: string; owner: { email: string; temporaryPassword: string | null } | null }>('POST', '/admin/clients', {
        companyName: text('companyName'),
        industry: text('industry'),
        website: text('website'),
        contactEmail: text('contactEmail'),
        contactPhone: text('contactPhone'),
        internalNotes: text('internalNotes'),
        owner: { name: text('ownerName'), email: text('ownerEmail'), phone: text('ownerPhone'), password: text('password') || undefined, role: 'OWNER' },
      });
      setCreated({ id: result.id, email: result.owner?.email ?? '', temporaryPassword: result.owner?.temporaryPassword ?? null });
    } catch (e) {
      setError(e instanceof ApiError ? e : null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="size-4" aria-hidden /> New client
      </Button>
      <Modal open={open} title={created ? 'Client created' : 'New client'} onClose={busy ? () => undefined : close}>
        {created ? (
          <div className="space-y-4">
            <p className="text-sm text-muted">
              {created.temporaryPassword ? (
                <>Share these sign-in details with <strong className="text-foreground">{created.email}</strong> securely. The temporary password is shown only once, and they must change it at first sign-in.</>
              ) : (
                <>The portal account for <strong className="text-foreground">{created.email}</strong> uses the password you entered and must be changed at first sign-in.</>
              )}
            </p>
            {created.temporaryPassword && (
              <div className="flex items-center gap-2 rounded-lg border border-border bg-surface-strong p-3">
                <code className="min-w-0 flex-1 break-all font-mono text-sm">{created.temporaryPassword}</code>
                <Button variant="secondary" size="sm" onClick={() => void navigator.clipboard?.writeText(created.temporaryPassword ?? '').then(() => toast.success('Copied.'))}>
                  <Copy className="size-4" aria-hidden /> Copy
                </Button>
              </div>
            )}
            <div className="flex justify-end">
              <Button onClick={close}>{leadId ? 'Continue to project' : 'Open client'}</Button>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <FormAlert error={error} />
            <Field label="Company name">{(props) => <Input {...props} name="companyName" defaultValue={prefill?.companyName} required maxLength={120} />}</Field>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Industry">{(props) => <Input {...props} name="industry" maxLength={80} />}</Field>
              <Field label="Website">{(props) => <Input {...props} name="website" placeholder="https://" />}</Field>
              <Field label="Company email">{(props) => <Input {...props} name="contactEmail" type="email" defaultValue={prefill?.contactEmail} required />}</Field>
              <Field label="Company phone">{(props) => <Input {...props} name="contactPhone" defaultValue={prefill?.contactPhone} maxLength={30} />}</Field>
            </div>
            <fieldset className="space-y-4 rounded-xl border border-border p-4">
              <legend className="px-1 text-sm font-medium">Portal owner</legend>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Name">{(props) => <Input {...props} name="ownerName" defaultValue={prefill?.ownerName} required maxLength={80} />}</Field>
                <Field label="Sign-in email">{(props) => <Input {...props} name="ownerEmail" type="email" defaultValue={prefill?.contactEmail} required autoComplete="off" />}</Field>
                <Field label="Phone">{(props) => <Input {...props} name="ownerPhone" defaultValue={prefill?.contactPhone} maxLength={30} />}</Field>
                <Field label="Temporary password" hint="Leave blank to generate one.">{(props) => <Input {...props} name="password" autoComplete="off" />}</Field>
              </div>
            </fieldset>
            <Field label="Internal notes" hint="Never visible to the client.">{(props) => <Input {...props} name="internalNotes" maxLength={4000} />}</Field>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={close} disabled={busy}>
                Cancel
              </Button>
              <Button type="submit" loading={busy}>
                Create client
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
