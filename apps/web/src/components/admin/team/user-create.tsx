'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Copy, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Field, Input, Select, Switch } from '@/components/ui/field';
import { useToast } from '@/components/ui/toast';
import { ApiError, apiRequest } from '@/lib/client-api';
import { FormAlert } from '../form-alert';
import { Modal } from './modal';
import type { RoleOption } from './shared';

export function UserCreate({ roles, canCreateSuper }: { roles: RoleOption[]; canCreateSuper: boolean }) {
  const router = useRouter();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [active, setActive] = useState(true);
  const [roleId, setRoleId] = useState('');
  const [created, setCreated] = useState<{ email: string; temporaryPassword: string | null } | null>(null);

  const options = roles.filter((role) => role.active && (canCreateSuper || role.key !== 'SUPER_ADMIN'));
  const needsConfirm = options.find((role) => role.id === roleId)?.key === 'SUPER_ADMIN';

  function close() {
    setOpen(false);
    setCreated(null);
    setError(null);
    router.refresh();
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setError(null);
    try {
      const result = await apiRequest<{ email: string; temporaryPassword: string | null }>('POST', '/admin/users', {
        name: String(form.get('name') ?? ''),
        email: String(form.get('email') ?? ''),
        roleId,
        isActive: active,
        password: String(form.get('password') ?? '') || undefined,
        confirmPassword: String(form.get('confirmPassword') ?? '') || undefined,
      });
      setCreated(result);
    } catch (e) {
      setError(e instanceof ApiError ? e : null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="size-4" aria-hidden /> New user
      </Button>
      <Modal open={open} title={created ? 'User created' : 'New admin user'} onClose={busy ? () => undefined : close}>
        {created ? (
          <div className="space-y-4">
            <p className="text-sm text-muted">
              {created.temporaryPassword ? (
                <>Share this temporary password with <strong className="text-foreground">{created.email}</strong> securely. It is shown only once, and they must change it at first sign-in.</>
              ) : (
                <>The account for <strong className="text-foreground">{created.email}</strong> was created with the password you entered. They must change it at first sign-in.</>
              )}
            </p>
            {created.temporaryPassword && (
              <div className="flex items-center gap-2 rounded-lg border border-border bg-surface-strong p-3">
                <code className="min-w-0 flex-1 break-all font-mono text-sm">{created.temporaryPassword}</code>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    void navigator.clipboard?.writeText(created.temporaryPassword ?? '').then(() => toast.success('Copied.'));
                  }}
                >
                  <Copy className="size-4" aria-hidden /> Copy
                </Button>
              </div>
            )}
            <div className="flex justify-end">
              <Button onClick={close}>Done</Button>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <FormAlert error={error} />
            <Field label="Name">{(props) => <Input {...props} name="name" required maxLength={80} autoComplete="off" />}</Field>
            <Field label="Email">{(props) => <Input {...props} name="email" type="email" required autoComplete="off" />}</Field>
            <Field label="Role">
              {(props) => (
                <Select {...props} value={roleId} onChange={(e) => setRoleId(e.target.value)} required>
                  <option value="">Select a role…</option>
                  {options.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </Select>
              )}
            </Field>
            <Field label="Temporary password" hint="Leave blank to generate a secure one. The user must change it at first sign-in.">
              {(props) => <Input {...props} name="password" type="text" autoComplete="off" />}
            </Field>
            <Switch label="Active" description="Inactive users cannot sign in." checked={active} onChange={setActive} />
            {needsConfirm && (
              <Field label="Your password" hint="Required to create a Super Admin.">
                {(props) => <Input {...props} name="confirmPassword" type="password" autoComplete="current-password" required />}
              </Field>
            )}
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={close} disabled={busy}>
                Cancel
              </Button>
              <Button type="submit" loading={busy}>
                Create user
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
