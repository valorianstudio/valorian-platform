'use client';

import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Field, Input, Switch } from '@/components/ui/field';
import { useToast } from '@/components/ui/toast';
import { ApiError, apiRequest } from '@/lib/client-api';
import { FormAlert } from '../form-alert';
import { titleCase } from './shared';
import type { PermissionDef } from './shared';

interface RoleData {
  id: string;
  key: string;
  name: string;
  description: string | null;
  isSystem: boolean;
  active: boolean;
  permissions: string[];
  userCount: number;
}

export function PermissionMatrix({ role, catalogue }: { role: RoleData; catalogue: PermissionDef[] }) {
  const router = useRouter();
  const toast = useToast();
  const isSuper = role.key === 'SUPER_ADMIN';
  const [selected, setSelected] = useState(() => new Set(role.permissions));
  const [active, setActive] = useState(role.active);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const groups = useMemo(() => {
    const map = new Map<string, PermissionDef[]>();
    for (const permission of catalogue) map.set(permission.module, [...(map.get(permission.module) ?? []), permission]);
    return [...map.entries()];
  }, [catalogue]);

  const readOnly = isSuper;

  function toggle(keys: string[], on: boolean) {
    setSelected((current) => {
      const next = new Set(current);
      for (const key of keys) on ? next.add(key) : next.delete(key);
      return next;
    });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || readOnly) return;
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setError(null);
    try {
      await apiRequest('PATCH', `/admin/roles/${role.id}`, {
        ...(role.isSystem ? {} : { name: String(form.get('name') ?? ''), active }),
        description: String(form.get('description') ?? ''),
        permissions: [...selected].filter((key) => !catalogue.find((p) => p.key === key)?.superOnly),
      });
      toast.success('Role saved.');
      router.refresh();
    } catch (e) {
      setError(e instanceof ApiError ? e : null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <FormAlert error={error} />
      <Card className="space-y-5 p-6">
        <h2 className="text-lg font-semibold">Details</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Name" hint={role.isSystem ? 'Built-in roles cannot be renamed.' : undefined}>
            {(props) => <Input {...props} name="name" defaultValue={role.name} disabled={role.isSystem} required minLength={2} maxLength={60} />}
          </Field>
          <Field label="Description">{(props) => <Input {...props} name="description" defaultValue={role.description ?? ''} disabled={readOnly} maxLength={240} />}</Field>
        </div>
        {!role.isSystem && <Switch label="Active" description={role.userCount > 0 ? 'Reassign its users before deactivating.' : 'Inactive roles cannot be assigned.'} checked={active} onChange={setActive} />}
        <p className="text-sm text-muted">
          {role.userCount} {role.userCount === 1 ? 'user has' : 'users have'} this role. Changes apply to them immediately.
        </p>
      </Card>

      <div>
        <h2 className="mb-1 text-lg font-semibold">Permissions</h2>
        {readOnly ? <p className="mb-4 text-sm text-muted">Super Admin always has every permission and cannot be edited.</p> : <p className="mb-4 text-sm text-muted">Pick what this role can do in each area. Role and security management stay with Super Admins.</p>}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {groups.map(([module, items]) => {
            const editable = items.filter((p) => !p.superOnly);
            const keys = editable.map((p) => p.key);
            const allOn = keys.length > 0 && keys.every((key) => selected.has(key) || readOnly);
            return (
              <Card key={module} className="p-5">
                <fieldset>
                  <legend className="flex w-full items-center justify-between gap-3">
                    <span className="font-medium">{titleCase(module)}</span>
                    {!readOnly && keys.length > 0 && (
                      <button type="button" className="text-sm text-primary" onClick={() => toggle(keys, !allOn)}>
                        {allOn ? 'Clear' : 'Select all'}
                      </button>
                    )}
                  </legend>
                  <ul className="mt-3 space-y-2">
                    {items.map((permission) => {
                      const locked = readOnly || permission.superOnly;
                      const checked = readOnly || (!permission.superOnly && selected.has(permission.key));
                      return (
                        <li key={permission.key}>
                          <label className={`flex min-h-9 items-start gap-3 rounded-md px-1 py-1 text-sm ${locked ? 'opacity-70' : 'cursor-pointer hover:bg-surface-strong'}`}>
                            <input type="checkbox" className="mt-0.5 size-4 shrink-0 accent-[var(--color-primary)]" checked={checked} disabled={locked} onChange={(e) => toggle([permission.key], e.target.checked)} />
                            <span>
                              {permission.label}
                              {permission.superOnly && <span className="ml-2 text-xs text-muted">Super Admin only</span>}
                              {permission.description && <span className="block text-xs text-muted">{permission.description}</span>}
                            </span>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                </fieldset>
              </Card>
            );
          })}
        </div>
      </div>

      {!readOnly && (
        <div className="sticky bottom-0 -mx-1 flex items-center justify-between gap-3 border-t border-border bg-background/95 px-1 py-4 backdrop-blur">
          <span className="text-sm text-muted">{selected.size} permissions selected</span>
          <Button type="submit" loading={busy}>
            Save role
          </Button>
        </div>
      )}
    </form>
  );
}
