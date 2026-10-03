'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Copy } from 'lucide-react';
import { FormAlert } from '@/components/admin/form-alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Field, Input } from '@/components/ui/field';
import { useToast } from '@/components/ui/toast';
import { ApiError, apiRequest } from '@/lib/client-api';
import { formatDateTime } from '@/lib/portal';

interface Member {
  id: string;
  name: string;
  email: string;
  role: 'OWNER' | 'MEMBER';
  active: boolean;
  lastLoginAt: string | null;
}

export function TeamManager({ members, selfId }: { members: Member[]; selfId: string }) {
  const router = useRouter();
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [created, setCreated] = useState<{ email: string; temporaryPassword: string } | null>(null);

  async function add(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    setBusy(true);
    setError(null);
    try {
      const result = await apiRequest<{ email: string; temporaryPassword: string }>('POST', '/client/team', { name: String(data.get('name') ?? ''), email: String(data.get('email') ?? '') });
      setCreated(result);
      form.reset();
      router.refresh();
    } catch (e) {
      setError(e instanceof ApiError ? e : null);
    } finally {
      setBusy(false);
    }
  }

  async function toggle(member: Member) {
    try {
      await apiRequest('PATCH', `/client/team/${member.id}`, { active: !member.active });
      toast.success(member.active ? 'User deactivated.' : 'User reactivated.');
      router.refresh();
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Could not update the user.');
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-5 sm:p-6">
        <h2 className="mb-4 font-semibold">Add a team member</h2>
        <form onSubmit={add} className="space-y-4">
          <FormAlert error={error} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Name">{(props) => <Input {...props} name="name" required maxLength={80} autoComplete="off" />}</Field>
            <Field label="Email">{(props) => <Input {...props} name="email" type="email" required autoComplete="off" />}</Field>
          </div>
          <Button type="submit" loading={busy}>
            Add member
          </Button>
        </form>
        {created && (
          <div className="mt-5 rounded-lg border border-border bg-surface-strong p-4">
            <p className="text-sm">
              Share this temporary password with <strong>{created.email}</strong>. It is shown only once and must be changed at first sign-in.
            </p>
            <div className="mt-3 flex items-center gap-2">
              <code className="min-w-0 flex-1 break-all font-mono text-sm">{created.temporaryPassword}</code>
              <Button variant="secondary" size="sm" onClick={() => void navigator.clipboard?.writeText(created.temporaryPassword).then(() => toast.success('Copied.'))}>
                <Copy className="size-4" aria-hidden /> Copy
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setCreated(null)}>
                Hide
              </Button>
            </div>
          </div>
        )}
      </Card>

      <ul className="space-y-3">
        {members.map((member) => (
          <li key={member.id}>
            <Card className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="truncate font-medium">
                  {member.name}
                  {member.id === selfId && <span className="ml-2 text-xs text-muted">(you)</span>}
                </p>
                <p className="truncate text-sm text-muted">{member.email}</p>
                <p className="mt-0.5 text-xs text-muted">Last sign-in: {formatDateTime(member.lastLoginAt)}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone="primary">{member.role === 'OWNER' ? 'Owner' : 'Member'}</Badge>
                <Badge tone={member.active ? 'accent' : 'danger'}>{member.active ? 'Active' : 'Inactive'}</Badge>
                {member.role === 'MEMBER' && (
                  <Button variant="secondary" size="sm" onClick={() => toggle(member)}>
                    {member.active ? 'Deactivate' : 'Reactivate'}
                  </Button>
                )}
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
