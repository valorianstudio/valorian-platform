import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { PasswordForm, ProfileForm } from '@/components/admin/profile-forms';
import { PageHeader } from '@/components/ui/page-header';
import { getCurrentAdmin } from '@/lib/server-api';

export const metadata: Metadata = { title: 'Profile' };

export default async function ProfilePage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect('/admin/login');

  return (
    <>
      <PageHeader title="Profile" description="Manage your account details and password." />
      <div className="grid gap-6 lg:grid-cols-2">
        <ProfileForm admin={admin} />
        <PasswordForm />
      </div>
    </>
  );
}
