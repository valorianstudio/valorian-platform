import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { ClientPasswordForm, ClientProfileForm } from '@/components/portal/client-profile-forms';
import { PageHeader } from '@/components/ui/page-header';
import { getCurrentClient } from '@/lib/server-api';

export const metadata: Metadata = { title: 'Profile' };

export default async function ClientProfilePage() {
  const client = await getCurrentClient();
  if (!client) redirect('/client/login');
  return (
    <>
      <PageHeader title="Profile" description="Your contact details, company information and password." />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ClientProfileForm client={client} />
        <ClientPasswordForm />
      </div>
    </>
  );
}
