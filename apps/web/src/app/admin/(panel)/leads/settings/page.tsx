import type { Metadata } from 'next';
import { LeadSettingsForm } from '@/components/admin/leads/lead-settings-form';
import { PageHeader } from '@/components/ui/page-header';
import { ErrorState } from '@/components/ui/states';
import { getAdminJson } from '@/lib/server-api';

export const metadata: Metadata = { title: 'Lead settings' };

export default async function Page() {
  const settings = await getAdminJson<Record<string, unknown>>('/admin/leads/settings');

  return (
    <>
      <PageHeader title="Lead settings" description="Confirmation message and optional new-lead notifications." />
      {settings ? <LeadSettingsForm initial={settings} /> : <ErrorState title="Could not load settings" description="Reload the page to try again." />}
    </>
  );
}
