import type { Metadata } from 'next';
import Link from 'next/link';
import { RoleCreate, RoleRowActions } from '@/components/admin/team/role-actions';
import type { RoleSummary } from '@/components/admin/team/shared';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { ErrorState } from '@/components/ui/states';
import { getAdminJson } from '@/lib/server-api';

export const metadata: Metadata = { title: 'Roles' };

export default async function RolesPage() {
  const roles = await getAdminJson<RoleSummary[]>('/admin/roles');
  if (!roles) return <ErrorState title="Could not load roles" description="Reload the page to try again." />;

  return (
    <>
      <PageHeader title="Roles" description="Control what each part of the team can see and do." actions={<RoleCreate />} />
      <ul className="space-y-3">
        {roles.map((role) => (
          <li key={role.id}>
            <Card className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <Link href={`/admin/roles/${role.id}`} className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-2 font-medium">
                  {role.name}
                  {role.isSystem && <Badge>Built-in</Badge>}
                  {!role.active && <Badge tone="danger">Inactive</Badge>}
                </p>
                <p className="mt-0.5 text-sm text-muted">{role.description || 'No description'}</p>
                <p className="mt-1 text-sm text-muted">
                  {role.userCount} {role.userCount === 1 ? 'user' : 'users'} · {role.permissionCount} permissions
                </p>
              </Link>
              <div className="flex shrink-0 items-center gap-2">
                <RoleRowActions id={role.id} name={role.name} isSystem={role.isSystem} userCount={role.userCount} />
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </>
  );
}
