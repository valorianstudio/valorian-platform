'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Copy, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/field';
import { useToast } from '@/components/ui/toast';
import { ConfirmDialog } from '@/components/ui/dialog';
import { ApiError, apiRequest } from '@/lib/client-api';
import { FormAlert } from '../form-alert';
import { Modal } from './modal';

export function RoleCreate() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setError(null);
    try {
      const role = await apiRequest<{ id: string }>('POST', '/admin/roles', { name: String(form.get('name') ?? ''), description: String(form.get('description') ?? ''), permissions: [] });
      router.push(`/admin/roles/${role.id}`);
    } catch (e) {
      setError(e instanceof ApiError ? e : null);
      setBusy(false);
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="size-4" aria-hidden /> New role
      </Button>
      <Modal open={open} title="New role" onClose={() => !busy && setOpen(false)}>
        <form onSubmit={onSubmit} className="space-y-4">
          <FormAlert error={error} />
          <Field label="Name">{(props) => <Input {...props} name="name" required minLength={2} maxLength={60} />}</Field>
          <Field label="Description" hint="Optional.">{(props) => <Input {...props} name="description" maxLength={240} />}</Field>
          <p className="text-sm text-muted">You will choose permissions on the next screen.</p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setOpen(false)} disabled={busy}>
              Cancel
            </Button>
            <Button type="submit" loading={busy}>
              Create role
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export function RoleRowActions({ id, name, isSystem, userCount }: { id: string; name: string; isSystem: boolean; userCount: number }) {
  const router = useRouter();
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function duplicate() {
    setBusy(true);
    try {
      const copy = await apiRequest<{ id: string }>('POST', `/admin/roles/${id}/duplicate`);
      toast.success('Role duplicated.');
      router.push(`/admin/roles/${copy.id}`);
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Could not duplicate the role.');
      setBusy(false);
    }
  }

  async function remove() {
    setBusy(true);
    try {
      await apiRequest('DELETE', `/admin/roles/${id}`);
      toast.success('Role deleted.');
      setConfirmDelete(false);
      router.refresh();
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Could not delete the role.');
      setConfirmDelete(false);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Button variant="secondary" size="sm" onClick={duplicate} disabled={busy} aria-label={`Duplicate ${name}`}>
        <Copy className="size-4" aria-hidden /> Duplicate
      </Button>
      {!isSystem && (
        <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(true)} disabled={busy || userCount > 0} title={userCount > 0 ? 'Reassign its users first' : undefined} aria-label={`Delete ${name}`}>
          Delete
        </Button>
      )}
      <ConfirmDialog open={confirmDelete} title={`Delete ${name}?`} description="This removes the role permanently. It has no users assigned." busy={busy} onConfirm={remove} onCancel={() => setConfirmDelete(false)} />
    </>
  );
}
