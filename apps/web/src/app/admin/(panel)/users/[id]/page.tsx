import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { UserActions } from '@/components/admin/team/user-actions';
import { formatDateTime, titleCase } from '@/components/admin/team/shared';
import type { UserDetail } from '@/components/admin/team/shared';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { can } from '@/lib/permissions';
import { getAdminJson, getCurrentAdmin } from '@/lib/server-api';

export const metadata: Metadata = { title: 'User' };

export default async function UserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [admin, user] = await Promise.all([getCurrentAdmin(), getAdminJson<UserDetail>(`/admin/users/${encodeURIComponent(id)}`)]);
  if (!admin || !user) notFound();

  return (
    <>
      <Link href="/admin/users" className="mb-3 inline-flex items-center gap-1 py-2 text-sm text-muted transition-colors hover:text-foreground">
        <ChevronLeft className="size-4" aria-hidden /> Users
      </Link>
      <PageHeader
        title={user.name}
        description={user.email}
        actions={
          <div className="flex flex-wrap gap-2">
            <Badge tone="primary">{user.roleRef?.name ?? 'No role'}</Badge>
            <Badge tone={user.isActive ? 'accent' : 'danger'}>{user.isActive ? 'Active' : 'Inactive'}</Badge>
            {user.totpEnabled && <Badge>2FA on</Badge>}
            {user.mustChangePassword && <Badge>Password reset pending</Badge>}
          </div>
        }
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-6">
          <UserActions user={user} viewerId={admin.id} viewerIsSuper={admin.isSuper} canManage={can(admin.permissions, 'users.manage')} />
        </div>
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold">Account</h2>
            <dl className="mt-4 space-y-3 text-sm">
              {[
                ['Last sign-in', formatDateTime(user.lastLoginAt)],
                ['Created', formatDateTime(user.createdAt)],
                ['Password changed', formatDateTime(user.passwordChangedAt)],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4">
                  <dt className="text-muted">{label}</dt>
                  <dd className="text-right">{value}</dd>
                </div>
              ))}
            </dl>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">Recent activity</h2>
              {can(admin.permissions, 'audit.view') && (
                <Link href={`/admin/audit?user=${user.id}`} className="text-sm text-primary">
                  View all
                </Link>
              )}
            </div>
            {user.recent.length === 0 ? (
              <p className="mt-4 text-sm text-muted">No activity yet.</p>
            ) : (
              <ul className="mt-4 space-y-3 text-sm">
                {user.recent.map((entry) => (
                  <li key={entry.id}>
                    <p>{entry.summary}</p>
                    <p className="text-xs text-muted">
                      {titleCase(entry.action)} · {titleCase(entry.module)} · {formatDateTime(entry.createdAt)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
