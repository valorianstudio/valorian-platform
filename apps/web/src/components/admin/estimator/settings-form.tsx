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
  { kind: 'switch', name: 'enabled', label: 'Estimator enabled', description: 'When off, /estimate shows an unavailable message and calculations are refused.' },
  { kind: 'number', name: 'roundingStep', label: 'Round range to nearest', half: true, hint: 'Prices are in USD. For example 50 or 100.' },
  { kind: 'number', name: 'rangeLowPercent', label: 'Range: lower bound (% below estimate)', half: true },
  { kind: 'number', name: 'rangeHighPercent', label: 'Range: upper bound (% above estimate)', half: true },
  { kind: 'number', name: 'bothDiscountPercent', label: 'Website + Mobile package discount (%)', half: true, hint: 'Applied when an item has no explicit combined price.' },
  { kind: 'textarea', name: 'disclaimer', label: 'Disclaimer shown with every estimate', rows: 2, max: 300 },
];

export function EstimatorSettingsForm({ initial }: { initial: Record<string, unknown> }) {
  const toast = useToast();
  const [values, setValues] = useState<FormValues>(() => initialValues(FIELDS, initial));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  async function save() {
    if (saving) return;
    setSaving(true);
    setError(null);
    try {
      await apiRequest('PUT', '/admin/estimator/settings', toPayload(FIELDS, values));
      await refreshContent();
      toast.success('Estimator settings saved.');
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
