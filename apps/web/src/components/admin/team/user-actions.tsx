'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Field, Input, Select } from '@/components/ui/field';
import { useToast } from '@/components/ui/toast';
import { ApiError, apiRequest } from '@/lib/client-api';
import { FormAlert } from '../form-alert';
import { Modal } from './modal';
import type { RoleOption, UserDetail } from './shared';

type Action = 'save' | 'toggle' | 'reset' | 'delete';

export function UserActions({ user, viewerId, viewerIsSuper, canManage }: { user: UserDetail; viewerId: string; viewerIsSuper: boolean; canManage: boolean }) {
  const router = useRouter();
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [confirming, setConfirming] = useState<Action | null>(null);
  const [tempPassword, setTempPassword] = useState<string | null>(null);

  const isSelf = user.id === viewerId;
  const targetIsSuper = user.roleRef?.key === 'SUPER_ADMIN';
  const locked = !canManage || (targetIsSuper && !viewerIsSuper);
  const roleOptions: RoleOption[] = user.roles.filter((role) => role.active && (viewerIsSuper || role.key !== 'SUPER_ADMIN'));
  const [roleId, setRoleId] = useState(user.roleRef?.id ?? '');
  const roleKeyAfter = user.roles.find((role) => role.id === roleId)?.key;
  const roleNeedsPassword = roleId !== user.roleRef?.id && (targetIsSuper || roleKeyAfter === 'SUPER_ADMIN');

  async function run<T>(request: () => Promise<T>, success: string, after?: (result: T) => void) {
    setBusy(true);
    setError(null);
    try {
      const result = await request();
      toast.success(success);
      setConfirming(null);
      after?.(result);
      router.refresh();
    } catch (e) {
      setError(e instanceof ApiError ? e : null);
    } finally {
      setBusy(false);
    }
  }

  function confirmValue(event: FormEvent<HTMLFormElement>): string | undefined {
    return String(new FormData(event.currentTarget).get('confirmPassword') ?? '') || undefined;
  }

  async function onSaveDetails(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = new FormData(event.currentTarget);
    const confirmPassword = String(form.get('confirmPassword') ?? '') || undefined;
    await run(
      () => apiRequest('PATCH', `/admin/users/${user.id}`, { name: String(form.get('name') ?? ''), email: String(form.get('email') ?? ''), ...(roleId !== user.roleRef?.id ? { roleId } : {}), confirmPassword }),
      'User updated.',
    );
  }

  function onConfirm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || !confirming) return;
    const confirmPassword = confirmValue(event);
    if (confirming === 'toggle') void run(() => apiRequest('PATCH', `/admin/users/${user.id}`, { isActive: !user.isActive, confirmPassword }), user.isActive ? 'User deactivated.' : 'User activated.');
    if (confirming === 'reset') void run(() => apiRequest<{ temporaryPassword: string }>('POST', `/admin/users/${user.id}/reset-password`), 'Password reset.', (result) => setTempPassword(result.temporaryPassword));
    if (confirming === 'delete') void run(() => apiRequest('DELETE', `/admin/users/${user.id}`, { confirmPassword }), 'User deleted.', () => router.replace('/admin/users'));
  }

  const needsPasswordForToggle = targetIsSuper && user.isActive;
  const titles: Record<Action, string> = { save: '', toggle: user.isActive ? 'Deactivate user' : 'Activate user', reset: 'Force password reset', delete: 'Delete user' };

  return (
    <>
      <Card className="p-6">
        <h2 className="text-lg font-semibold">Details</h2>
        <form onSubmit={onSaveDetails} className="mt-5 space-y-5">
          <FormAlert error={confirming ? null : error} />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Name">{(props) => <Input {...props} name="name" defaultValue={user.name} disabled={locked} required />}</Field>
            <Field label="Email">{(props) => <Input {...props} name="email" type="email" defaultValue={user.email} disabled={locked} required />}</Field>
          </div>
          <Field label="Role" hint={isSelf ? 'You cannot change your own role.' : undefined}>
            {(props) => (
              <Select {...props} value={roleId} onChange={(e) => setRoleId(e.target.value)} disabled={locked || isSelf}>
                {!roleOptions.some((role) => role.id === user.roleRef?.id) && user.roleRef && <option value={user.roleRef.id}>{user.roleRef.name}</option>}
                {roleOptions.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </Select>
            )}
          </Field>
          {roleNeedsPassword && <Field label="Your password" hint="Required to change a Super Admin role.">{(props) => <Input {...props} name="confirmPassword" type="password" autoComplete="current-password" required />}</Field>}
          {!locked && (
            <Button type="submit" loading={busy && !confirming}>
              Save changes
            </Button>
          )}
        </form>
      </Card>

      {!locked && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold">Access</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {!isSelf && (
              <Button variant="secondary" onClick={() => { setError(null); setConfirming('toggle'); }}>
                {user.isActive ? 'Deactivate' : 'Activate'}
              </Button>
            )}
            {!isSelf && (
              <Button variant="secondary" onClick={() => { setError(null); setConfirming('reset'); }}>
                Force password reset
              </Button>
            )}
            {!isSelf && (
              <Button variant="danger" onClick={() => { setError(null); setConfirming('delete'); }}>
                Delete user
              </Button>
            )}
            {isSelf && <p className="text-sm text-muted">You cannot deactivate, reset or delete your own account here. Use your profile to change your password.</p>}
          </div>
        </Card>
      )}

      <Modal open={confirming !== null && !tempPassword} title={confirming ? titles[confirming] : ''} onClose={() => !busy && setConfirming(null)}>
        <form onSubmit={onConfirm} className="space-y-4">
          <FormAlert error={error} />
          <p className="text-sm text-muted">
            {confirming === 'toggle' && (user.isActive ? 'They will be signed out and unable to sign in until reactivated.' : 'They will be able to sign in again.')}
            {confirming === 'reset' && 'A new temporary password is generated, all of their sessions end, and they must choose a new password at next sign-in.'}
            {confirming === 'delete' && 'This permanently removes the account. Their past audit entries are kept.'}
          </p>
          {(confirming === 'delete' || (confirming === 'toggle' && needsPasswordForToggle)) && (
            <Field label="Your password" hint="Confirm it is you.">
              {(props) => <Input {...props} name="confirmPassword" type="password" autoComplete="current-password" required />}
            </Field>
          )}
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setConfirming(null)} disabled={busy}>
              Cancel
            </Button>
            <Button type="submit" variant={confirming === 'delete' ? 'danger' : 'primary'} loading={busy}>
              Confirm
            </Button>
          </div>
        </form>
      </Modal>

      <Modal open={tempPassword !== null} title="Temporary password" onClose={() => setTempPassword(null)}>
        <div className="space-y-4">
          <p className="text-sm text-muted">Share this with {user.email} securely. It is shown only once.</p>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-surface-strong p-3">
            <code className="min-w-0 flex-1 break-all font-mono text-sm">{tempPassword}</code>
            <Button variant="secondary" size="sm" onClick={() => void navigator.clipboard?.writeText(tempPassword ?? '').then(() => toast.success('Copied.'))}>
              <Copy className="size-4" aria-hidden /> Copy
            </Button>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setTempPassword(null)}>Done</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
