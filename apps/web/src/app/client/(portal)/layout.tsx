import { redirect } from 'next/navigation';
import { ClientShell } from '@/components/portal/client-shell';
import { getCurrentClient, getSiteSettings } from '@/lib/server-api';

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const [client, settings] = await Promise.all([getCurrentClient(), getSiteSettings()]);
  if (!client) redirect('/client/login');
  if (client.mustChangePassword) redirect('/client/change-password');
  return (
    <ClientShell client={client} brandName={settings.brandName}>
      {children}
    </ClientShell>
  );
}
