import type { Metadata } from 'next';
import Link from 'next/link';
import { UserCreate } from '@/components/admin/team/user-create';
import { formatDateTime } from '@/components/admin/team/shared';
import type { RoleOption, UserRow } from '@/components/admin/team/shared';
import { Badge } from '@/components/ui/badge';
import { Button, ButtonLink } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input, Select } from '@/components/ui/field';
import { PageHeader } from '@/components/ui/page-header';
import { EmptyState, ErrorState } from '@/components/ui/states';
import { can } from '@/lib/permissions';
import { getAdminJson, getCurrentAdmin } from '@/lib/server-api';

export const metadata: Metadata = { title: 'Users' };

type Params = Record<string, string | string[] | undefined>;
const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? '';

export default async function UsersPage({ searchParams }: { searchParams: Promise<Params> }) {
  const params = await searchParams;
  const admin = await getCurrentAdmin();
  const values = { q: first(params.q), role: first(params.role), active: first(params.active) };
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) if (value) query.set(key, value);
  const page = first(params.page);
  const apiQuery = new URLSearchParams(query);
  if (page) apiQuery.set('page', page);

  const data = await getAdminJson<{ items: UserRow[]; total: number; page: number; pageSize: number; roles: RoleOption[] }>(`/admin/users?${apiQuery}`);
  if (!data) return <ErrorState title="Could not load users" description="Reload the page to try again." />;
  const pageCount = Math.max(1, Math.ceil(data.total / data.pageSize));
  const hrefFor = (p: number) => {
    const next = new URLSearchParams(query);
    if (p > 1) next.set('page', String(p));
    return `/admin/users${next.size ? `?${next}` : ''}`;
  };

  return (
    <>
      <PageHeader title="Users" description="Admin team members, their roles and sign-in status." actions={can(admin?.permissions, 'users.manage') ? <UserCreate roles={data.roles} canCreateSuper={Boolean(admin?.isSuper)} /> : undefined} />

      <form method="get" className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_12rem_10rem_auto]">
        <Input name="q" defaultValue={values.q} placeholder="Search name or email" aria-label="Search users" />
        <Select name="role" defaultValue={values.role} aria-label="Role">
          <option value="">All roles</option>
          {data.roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </Select>
        <Select name="active" defaultValue={values.active} aria-label="Status">
          <option value="">Any status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </Select>
        <Button type="submit" variant="secondary">
          Filter
        </Button>
      </form>

      <p className="mb-3 text-sm text-muted" aria-live="polite">
        {data.total} {data.total === 1 ? 'user' : 'users'}
        {query.size > 0 && (
          <>
            {' · '}
            <Link href="/admin/users" className="text-primary">
              Clear filters
            </Link>
          </>
        )}
      </p>

      {data.items.length === 0 ? (
        <EmptyState title="No users match" description="Try different filters." />
      ) : (
        <ul className="space-y-3">
          {data.items.map((user) => (
            <li key={user.id}>
              <Card className="transition-colors hover:border-primary/40">
                <Link href={`/admin/users/${user.id}`} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="truncate font-medium">
                      {user.name}
                      {user.id === admin?.id && <span className="ml-2 text-xs text-muted">(you)</span>}
                    </p>
                    <p className="truncate text-sm text-muted">{user.email}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <Badge tone="primary">{user.roleRef?.name ?? 'No role'}</Badge>
                    <Badge tone={user.isActive ? 'accent' : 'danger'}>{user.isActive ? 'Active' : 'Inactive'}</Badge>
                    {user.totpEnabled && <Badge>2FA</Badge>}
                    {user.mustChangePassword && <Badge>Password reset pending</Badge>}
                    <span className="text-muted">Last sign-in: {formatDateTime(user.lastLoginAt)}</span>
                  </div>
                </Link>
              </Card>
            </li>
          ))}
        </ul>
      )}

      {pageCount > 1 && (
        <nav aria-label="Pagination" className="mt-6 flex items-center justify-between text-sm">
          <span className="text-muted">
            Page {data.page} of {pageCount}
          </span>
          <div className="flex gap-2">
            {data.page > 1 && (
              <ButtonLink href={hrefFor(data.page - 1)} variant="secondary" size="sm">
                Previous
              </ButtonLink>
            )}
            {data.page < pageCount && (
              <ButtonLink href={hrefFor(data.page + 1)} variant="secondary" size="sm">
                Next
              </ButtonLink>
            )}
          </div>
        </nav>
      )}
    </>
  );
}
