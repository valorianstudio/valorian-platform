import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { LoginForm } from '@/components/admin/login-form';
import { Wordmark } from '@/components/site/wordmark';
import { Card } from '@/components/ui/card';
import { getCurrentAdmin, getSiteSettings } from '@/lib/server-api';

export const metadata: Metadata = { title: 'Sign in' };

export default async function AdminLoginPage() {
  if (await getCurrentAdmin()) redirect('/admin');
  const settings = await getSiteSettings();

  return (
    <main className="relative grid min-h-screen place-items-center px-5 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Wordmark name={settings.brandName} />
        </div>
        <Card className="p-6 shadow-sm sm:p-8">
          <h1 className="text-xl font-semibold">Admin sign in</h1>
          <p className="mb-6 mt-1 text-sm text-muted">Enter your credentials to access the dashboard.</p>
          <LoginForm />
        </Card>
      </div>
    </main>
  );
}
