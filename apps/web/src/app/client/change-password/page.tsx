import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { ForcedPasswordForm } from '@/components/admin/forced-password-form';
import { Wordmark } from '@/components/site/wordmark';
import { Card } from '@/components/ui/card';
import { getCurrentClient, getSiteSettings } from '@/lib/server-api';

export const metadata: Metadata = { title: 'Set a new password' };

export default async function ClientChangePasswordPage() {
  const client = await getCurrentClient();
  if (!client) redirect('/client/login');
  if (!client.mustChangePassword) redirect('/client/dashboard');
  const settings = await getSiteSettings();

  return (
    <main className="relative grid min-h-screen place-items-center px-5 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Wordmark name={settings.brandName} />
        </div>
        <Card className="p-6 shadow-sm sm:p-8">
          <h1 className="text-xl font-semibold">Set a new password</h1>
          <p className="mb-6 mt-1 text-sm text-muted">Welcome, {client.name.split(' ')[0]}. Choose your own password before continuing.</p>
          <ForcedPasswordForm endpoint="/client-auth/password" redirectTo="/client/dashboard" />
        </Card>
      </div>
    </main>
  );
}
