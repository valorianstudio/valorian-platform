'use client';

import { FieldsTab } from '@/components/admin/cms/editor-kit';
import type { FieldDef } from '@/components/admin/cms/field-defs';
import { apiRequest } from '@/lib/client-api';

const FIELDS: FieldDef[] = [
  { kind: 'switch', name: 'enabled', label: 'Collect analytics', description: 'Turn off to stop recording new events. Existing data is kept until it expires.' },
  { kind: 'switch', name: 'excludeAdmin', label: 'Exclude signed-in admins', description: 'Visits by you while signed in to the admin are not counted.' },
  { kind: 'switch', name: 'trackArticles', label: 'Track article views' },
  { kind: 'switch', name: 'trackEstimator', label: 'Track detailed estimator steps', description: 'Needed for the estimator funnel.' },
  { kind: 'number', name: 'retentionDays', label: 'Keep raw events for (days)', half: true, hint: '7–1095. Older raw events and idle sessions are deleted automatically. Leads and estimates are never deleted.' },
  { kind: 'select', name: 'defaultRangeDays', label: 'Default dashboard range', half: true, options: [{ value: '1', label: 'Today' }, { value: '7', label: 'Last 7 days' }, { value: '30', label: 'Last 30 days' }, { value: '90', label: 'Last 90 days' }, { value: '365', label: 'Last 365 days' }] },
  { kind: 'number', name: 'idleLeadDays', label: 'Flag leads idle for (days)', half: true },
];

export function AnalyticsSettingsForm({ initial }: { initial: Record<string, unknown> }) {
  return (
    <FieldsTab
      fields={FIELDS}
      initial={initial}
      label="Save settings"
      onSave={async (payload, saver) => {
        await saver.save(() => apiRequest('PUT', '/admin/analytics/settings', { ...payload, defaultRangeDays: Number(payload.defaultRangeDays) }), 'Analytics settings saved.');
      }}
    />
  );
}
