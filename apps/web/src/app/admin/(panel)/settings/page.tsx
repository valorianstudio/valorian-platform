import type { Metadata } from 'next';
import { SettingsForm } from '@/components/admin/settings-form';
import { ButtonLink } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import { ErrorState } from '@/components/ui/states';
import { getAdminSettings } from '@/lib/server-api';

export const metadata: Metadata = { title: 'Settings' };

export default async function SettingsPage() {
  const settings = await getAdminSettings();

  return (
    <>
      <PageHeader title="Site settings" description="Global business details used across the public website." />
      {settings ? (
        <SettingsForm initial={settings} />
      ) : (
        <ErrorState title="Could not load settings" description="The API is unreachable or your session has expired. Reload the page to try again." action={<ButtonLink href="/admin/settings" variant="secondary">Reload</ButtonLink>} />
      )}
    </>
  );
}
