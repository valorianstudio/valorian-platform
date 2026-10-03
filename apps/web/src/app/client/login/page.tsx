import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { ClientLoginForm } from '@/components/portal/client-login-form';
import { Wordmark } from '@/components/site/wordmark';
import { Card } from '@/components/ui/card';
import { getCurrentClient, getSiteSettings } from '@/lib/server-api';

export const metadata: Metadata = { title: 'Sign in' };

export default async function ClientLoginPage() {
  if (await getCurrentClient()) redirect('/client/dashboard');
  const settings = await getSiteSettings();

  return (
    <main className="relative grid min-h-screen place-items-center px-5 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Wordmark name={settings.brandName} />
        </div>
        <Card className="p-6 shadow-sm sm:p-8">
          <h1 className="text-xl font-semibold">Client portal</h1>
          <p className="mb-6 mt-1 text-sm text-muted">Sign in to follow your project, files and messages.</p>
          <ClientLoginForm />
        </Card>
      </div>
    </main>
  );
}
