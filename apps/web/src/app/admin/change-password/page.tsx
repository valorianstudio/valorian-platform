import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { ForcedPasswordForm } from '@/components/admin/forced-password-form';
import { Wordmark } from '@/components/site/wordmark';
import { Card } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { getCurrentAdmin, getSiteSettings } from '@/lib/server-api';

export const metadata: Metadata = { title: 'Set a new password' };

export default async function ChangePasswordPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect('/admin/login');
  if (!admin.mustChangePassword) redirect('/admin');
  const settings = await getSiteSettings();

  return (
    <main className="relative grid min-h-screen place-items-center px-5 py-12">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Wordmark name={settings.brandName} />
        </div>
        <Card className="p-6 shadow-sm sm:p-8">
          <h1 className="text-xl font-semibold">Set a new password</h1>
          <p className="mb-6 mt-1 text-sm text-muted">Hi {admin.name.split(' ')[0]}, your account needs a new password before you can continue.</p>
          <ForcedPasswordForm />
        </Card>
      </div>
    </main>
  );
}
