'use client';

import { useState } from 'react';
import { FormAlert } from '@/components/admin/form-alert';
import { EntityForm } from '@/components/admin/cms/entity-form';
import { initialValues, toPayload } from '@/components/admin/cms/field-defs';
import type { FieldDef, FormValues } from '@/components/admin/cms/field-defs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast';
import { refreshContent } from '@/lib/actions';
import { ApiError, apiRequest } from '@/lib/client-api';

const FIELDS: FieldDef[] = [
  { kind: 'text', name: 'responseNote', label: 'Confirmation message', max: 240, hint: 'Shown after a visitor submits a request. Leave empty for the default. Only promise response times you can keep.' },
  { kind: 'switch', name: 'notifyEnabled', label: 'Notify me about new leads', description: 'Sends a webhook when a lead arrives. Requires LEAD_WEBHOOK_URL on the API server; without it nothing is sent and leads still work.' },
  { kind: 'text', name: 'notifyEmail', label: 'Notification recipient', max: 160, hint: 'Included in the webhook payload for your email or automation tool.' },
];

export function LeadSettingsForm({ initial }: { initial: Record<string, unknown> }) {
  const toast = useToast();
  const [values, setValues] = useState<FormValues>(() => initialValues(FIELDS, initial));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  async function save() {
    if (saving) return;
    setSaving(true);
    setError(null);
    try {
      await apiRequest('PUT', '/admin/leads/settings', toPayload(FIELDS, values));
      await refreshContent();
      toast.success('Lead settings saved.');
    } catch (e) {
      setError(e instanceof ApiError ? e : null);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="space-y-6 p-4 sm:p-6">
      <FormAlert error={error} />
      <EntityForm fields={FIELDS} values={values} onChange={setValues} disabled={saving} />
      <Button onClick={save} loading={saving}>
        {saving ? 'Saving…' : 'Save settings'}
      </Button>
    </Card>
  );
}
