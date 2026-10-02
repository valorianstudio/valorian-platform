import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { PasswordForm, ProfileForm } from '@/components/admin/profile-forms';
import { formatDateTime, titleCase } from '@/components/admin/team/shared';
import { TwoFactorCard } from '@/components/admin/team/two-factor';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { getCurrentAdmin } from '@/lib/server-api';

export const metadata: Metadata = { title: 'Profile' };

export default async function ProfilePage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect('/admin/login');

  const groups = new Map<string, number>();
  for (const key of admin.permissions) groups.set(key.split('.')[0], (groups.get(key.split('.')[0]) ?? 0) + 1);

  return (
    <>
      <PageHeader title="Profile" description="Manage your account, password and sign-in security." />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <ProfileForm admin={admin} />
          <Card className="p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">Role and access</h2>
              <Badge tone="primary">{admin.role?.name ?? 'No role'}</Badge>
            </div>
            <p className="mt-2 text-sm text-muted">
              Last sign-in: {formatDateTime(admin.lastLoginAt)} · Member since {formatDateTime(admin.createdAt)}
            </p>
            <p className="mt-4 text-sm font-medium">{admin.isSuper ? 'Full access to every area.' : `${admin.permissions.length} permissions across ${groups.size} areas`}</p>
            {!admin.isSuper && (
              <ul className="mt-3 flex flex-wrap gap-2">
                {[...groups.entries()].map(([module, count]) => (
                  <li key={module}>
                    <Badge>
                      {titleCase(module)} · {count}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
        <div className="space-y-6">
          <PasswordForm />
          <TwoFactorCard enabled={admin.totpEnabled} />
        </div>
      </div>
    </>
  );
}
