'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Copy, Plus } from 'lucide-react';
import { FormAlert } from '@/components/admin/form-alert';
import { Modal } from '@/components/admin/team/modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Field, Input, Select, Switch, Textarea } from '@/components/ui/field';
import { useToast } from '@/components/ui/toast';
import { ApiError, apiRequest } from '@/lib/client-api';
import { formatDateTime } from '@/lib/portal';

export interface OrgData {
  id: string;
  companyName: string;
  industry: string | null;
  website: string | null;
  logo: string | null;
  contactEmail: string;
  contactPhone: string | null;
  internalNotes: string | null;
  active: boolean;
}

export interface OrgUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: 'OWNER' | 'MEMBER';
  active: boolean;
  mustChangePassword: boolean;
  lastLoginAt: string | null;
}

export function ClientEditor({ org, canManage }: { org: OrgData; canManage: boolean }) {
  const router = useRouter();
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [active, setActive] = useState(org.active);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || !canManage) return;
    const f = new FormData(event.currentTarget);
    const text = (key: string) => String(f.get(key) ?? '');
    setBusy(true);
    setError(null);
    try {
      await apiRequest('PATCH', `/admin/clients/${org.id}`, {
        companyName: text('companyName'),
        industry: text('industry'),
        website: text('website'),
        contactEmail: text('contactEmail'),
        contactPhone: text('contactPhone'),
        internalNotes: text('internalNotes'),
        active,
      });
      toast.success('Client saved.');
      router.refresh();
    } catch (e) {
      setError(e instanceof ApiError ? e : null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="p-5 sm:p-6">
      <h2 className="text-lg font-semibold">Company</h2>
      <form onSubmit={onSubmit} className="mt-5 space-y-5">
        <FormAlert error={error} />
        <fieldset disabled={!canManage || busy} className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Company name">{(props) => <Input {...props} name="companyName" defaultValue={org.companyName} required maxLength={120} />}</Field>
            <Field label="Industry">{(props) => <Input {...props} name="industry" defaultValue={org.industry ?? ''} maxLength={80} />}</Field>
            <Field label="Website">{(props) => <Input {...props} name="website" defaultValue={org.website ?? ''} placeholder="https://" />}</Field>
            <Field label="Company email">{(props) => <Input {...props} name="contactEmail" type="email" defaultValue={org.contactEmail} required />}</Field>
            <Field label="Company phone">{(props) => <Input {...props} name="contactPhone" defaultValue={org.contactPhone ?? ''} maxLength={30} />}</Field>
          </div>
          <Field label="Internal notes" hint="Only the Valorian team can see these. They never appear in the client portal.">
            {(props) => <Textarea {...props} name="internalNotes" defaultValue={org.internalNotes ?? ''} maxLength={4000} />}
          </Field>
          <Switch label="Portal access active" description="Turn off to block every user of this company from signing in." checked={active} onChange={setActive} />
        </fieldset>
        {canManage && (
          <Button type="submit" loading={busy}>
            Save changes
          </Button>
        )}
      </form>
    </Card>
  );
}

export function ClientUsers({ orgId, users, canManage }: { orgId: string; users: OrgUser[]; canManage: boolean }) {
  const router = useRouter();
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [secret, setSecret] = useState<{ email: string; password: string } | null>(null);

  async function run(task: () => Promise<void>) {
    setBusy(true);
    setError(null);
    try {
      await task();
      router.refresh();
    } catch (e) {
      const apiError = e instanceof ApiError ? e : null;
      setError(apiError);
      if (apiError) toast.error(apiError.message);
    } finally {
      setBusy(false);
    }
  }

  function add(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const f = new FormData(event.currentTarget);
    void run(async () => {
      const result = await apiRequest<{ email: string; temporaryPassword: string | null }>('POST', `/admin/clients/${orgId}/users`, {
        name: String(f.get('name') ?? ''),
        email: String(f.get('email') ?? ''),
        phone: String(f.get('phone') ?? ''),
        role: String(f.get('role') ?? 'MEMBER'),
        password: String(f.get('password') ?? '') || undefined,
      });
      setAdding(false);
      if (result.temporaryPassword) setSecret({ email: result.email, password: result.temporaryPassword });
      else toast.success('User added.');
    });
  }

  const patch = (user: OrgUser, body: object, message: string) => run(async () => {
    await apiRequest('PATCH', `/admin/clients/${orgId}/users/${user.id}`, body);
    toast.success(message);
  });
  const reset = (user: OrgUser) => run(async () => {
    const result = await apiRequest<{ temporaryPassword: string }>('POST', `/admin/clients/${orgId}/users/${user.id}/reset-password`);
    setSecret({ email: user.email, password: result.temporaryPassword });
  });

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Portal users</h2>
        {canManage && (
          <Button size="sm" onClick={() => { setError(null); setAdding(true); }}>
            <Plus className="size-4" aria-hidden /> Add user
          </Button>
        )}
      </div>
      <ul className="mt-4 divide-y divide-border">
        {users.map((user) => (
          <li key={user.id} className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="truncate font-medium">{user.name}</p>
              <p className="truncate text-sm text-muted">{user.email}</p>
              <p className="text-xs text-muted">Last sign-in: {formatDateTime(user.lastLoginAt)}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="primary">{user.role === 'OWNER' ? 'Owner' : 'Member'}</Badge>
              <Badge tone={user.active ? 'accent' : 'danger'}>{user.active ? 'Active' : 'Inactive'}</Badge>
              {user.mustChangePassword && <Badge>Password change pending</Badge>}
              {canManage && (
                <>
                  <Button variant="secondary" size="sm" disabled={busy} onClick={() => patch(user, { active: !user.active }, user.active ? 'User deactivated.' : 'User reactivated.')}>
                    {user.active ? 'Deactivate' : 'Reactivate'}
                  </Button>
                  <Button variant="secondary" size="sm" disabled={busy} onClick={() => patch(user, { role: user.role === 'OWNER' ? 'MEMBER' : 'OWNER' }, 'Role updated.')}>
                    Make {user.role === 'OWNER' ? 'member' : 'owner'}
                  </Button>
                  <Button variant="ghost" size="sm" disabled={busy} onClick={() => reset(user)}>
                    Reset password
                  </Button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>

      <Modal open={adding} title="Add portal user" onClose={() => !busy && setAdding(false)}>
        <form onSubmit={add} className="space-y-4">
          <FormAlert error={error} />
          <Field label="Name">{(props) => <Input {...props} name="name" required maxLength={80} />}</Field>
          <Field label="Email">{(props) => <Input {...props} name="email" type="email" required autoComplete="off" />}</Field>
          <Field label="Phone">{(props) => <Input {...props} name="phone" maxLength={30} />}</Field>
          <Field label="Role">
            {(props) => (
              <Select {...props} name="role" defaultValue="MEMBER">
                <option value="MEMBER">Member (view and message)</option>
                <option value="OWNER">Owner (also manage users and requests)</option>
              </Select>
            )}
          </Field>
          <Field label="Temporary password" hint="Leave blank to generate one.">{(props) => <Input {...props} name="password" autoComplete="off" />}</Field>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setAdding(false)} disabled={busy}>
              Cancel
            </Button>
            <Button type="submit" loading={busy}>
              Add user
            </Button>
          </div>
        </form>
      </Modal>

      <Modal open={secret !== null} title="Temporary password" onClose={() => setSecret(null)}>
        <div className="space-y-4">
          <p className="text-sm text-muted">Share this with {secret?.email} securely. It is shown only once and must be changed at first sign-in.</p>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-surface-strong p-3">
            <code className="min-w-0 flex-1 break-all font-mono text-sm">{secret?.password}</code>
            <Button variant="secondary" size="sm" onClick={() => void navigator.clipboard?.writeText(secret?.password ?? '').then(() => toast.success('Copied.'))}>
              <Copy className="size-4" aria-hidden /> Copy
            </Button>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setSecret(null)}>Done</Button>
          </div>
        </div>
      </Modal>
    </Card>
  );
}
