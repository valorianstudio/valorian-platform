import type { Metadata } from 'next';
import { AnalyticsSettingsForm } from '@/components/admin/analytics/settings-form';
import { PageHeader } from '@/components/ui/page-header';
import { ErrorState } from '@/components/ui/states';
import { getAdminJson } from '@/lib/server-api';

export const metadata: Metadata = { title: 'Analytics settings' };

export default async function Page() {
  const settings = await getAdminJson<Record<string, unknown>>('/admin/analytics/settings');

  return (
    <>
      <PageHeader title="Analytics settings" description="Analytics is first-party and anonymous: no IP addresses, fingerprints or form contents are stored, and browsers that send Do Not Track are not counted." />
      {settings ? (
        <AnalyticsSettingsForm initial={settings} />
      ) : (
        <ErrorState title="Could not load settings" description="Reload the page to try again." />
      )}
    </>
  );
}
