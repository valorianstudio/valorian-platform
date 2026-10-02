import type { Metadata } from 'next';
import { SecurityForm } from '@/components/admin/team/security-form';
import type { SecurityValues } from '@/components/admin/team/security-form';
import { PageHeader } from '@/components/ui/page-header';
import { ErrorState } from '@/components/ui/states';
import { getAdminJson } from '@/lib/server-api';

export const metadata: Metadata = { title: 'Security settings' };

export default async function SecuritySettingsPage() {
  const values = await getAdminJson<SecurityValues>('/admin/security');
  if (!values) return <ErrorState title="Could not load security settings" description="Reload the page to try again." />;
  return (
    <>
      <PageHeader title="Security" description="Session, password and lockout policy for the admin team." />
      <SecurityForm values={values} />
    </>
  );
}
