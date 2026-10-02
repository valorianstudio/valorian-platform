'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';
import { FormAlert } from '@/components/admin/form-alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast';
import { refreshContent } from '@/lib/actions';
import { ApiError, apiRequest } from '@/lib/client-api';
import { EntityForm } from './entity-form';
import { initialValues, toPayload } from './field-defs';
import type { FieldDef, FormValues, RelationOptions } from './field-defs';

/** Shared save plumbing: busy flag, error banner, success toast, public cache refresh. */
export function useSaver() {
  const toast = useToast();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  async function save<T>(action: () => Promise<T>, message: string): Promise<T | null> {
    if (saving) return null;
    setSaving(true);
    setError(null);
    try {
      const result = await action();
      await refreshContent();
      toast.success(message);
      return result;
    } catch (e) {
      setError(e instanceof ApiError ? e : new ApiError('Something went wrong.', 0));
      return null;
    } finally {
      setSaving(false);
    }
  }
  return { saving, error, save };
}

export function TabCard({ children, error, footer }: { children: ReactNode; error: ApiError | null; footer: ReactNode }) {
  return (
    <Card className="space-y-6 p-4 sm:p-6">
      <FormAlert error={error} />
      {children}
      <div>{footer}</div>
    </Card>
  );
}

export function FieldsTab({ fields, initial, onSave, label = 'Save', relationOptions }: { fields: FieldDef[]; initial: Record<string, unknown> | null; onSave: (payload: Record<string, unknown>, saver: ReturnType<typeof useSaver>) => Promise<void>; label?: string; relationOptions?: RelationOptions }) {
  const saver = useSaver();
  const [values, setValues] = useState<FormValues>(() => initialValues(fields, initial, { featured: false, active: true, noindex: false }));
  return (
    <TabCard error={saver.error} footer={<Button loading={saver.saving} onClick={() => onSave(toPayload(fields, values), saver)}>{saver.saving ? 'Saving…' : label}</Button>}>
      <EntityForm fields={fields} values={values} onChange={setValues} disabled={saver.saving} relationOptions={relationOptions} />
    </TabCard>
  );
}


export function CollectionTab({ endpoint, field, initial, hint }: { endpoint: string; field: FieldDef & { kind: 'items' }; initial: Record<string, unknown>[]; hint: string }) {
  const saver = useSaver();
  const fields = [field];
  const [values, setValues] = useState<FormValues>(() => initialValues(fields, { rows: initial }));
  return (
    <TabCard
      error={saver.error}
      footer={<Button loading={saver.saving} onClick={() => saver.save(() => apiRequest('PUT', endpoint, values.rows), 'Saved.')}>{saver.saving ? 'Saving…' : 'Save'}</Button>}
    >
      <p className="text-sm text-muted">{hint}</p>
      <EntityForm fields={fields} values={values} onChange={setValues} disabled={saver.saving} />
    </TabCard>
  );
}

