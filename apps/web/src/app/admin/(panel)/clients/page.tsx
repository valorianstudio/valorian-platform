import type { Metadata } from 'next';
import Link from 'next/link';
import { ClientCreate } from '@/components/admin/portal/client-create';
import type { ClientPrefill } from '@/components/admin/portal/client-create';
import { Badge } from '@/components/ui/badge';
import { Button, ButtonLink } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input, Select } from '@/components/ui/field';
import { PageHeader } from '@/components/ui/page-header';
import { EmptyState, ErrorState } from '@/components/ui/states';
import { can } from '@/lib/permissions';
import { getAdminJson, getCurrentAdmin } from '@/lib/server-api';

export const metadata: Metadata = { title: 'Clients' };

type Params = Record<string, string | string[] | undefined>;
const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? '';

interface Row {
  id: string;
  companyName: string;
  industry: string | null;
  contactEmail: string;
  active: boolean;
  userCount: number;
  projectCount: number;
}

export default async function ClientsPage({ searchParams }: { searchParams: Promise<Params> }) {
  const params = await searchParams;
  const admin = await getCurrentAdmin();
  const values = { q: first(params.q), active: first(params.active) };
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) if (value) query.set(key, value);
  const apiQuery = new URLSearchParams(query);
  if (first(params.page)) apiQuery.set('page', first(params.page));

  const fromLead = first(params.fromLead);
  const [data, lead] = await Promise.all([
    getAdminJson<{ items: Row[]; total: number; page: number; pageSize: number }>(`/admin/clients?${apiQuery}`),
    fromLead ? getAdminJson<{ name: string; email: string; phone: string | null; companyName: string | null }>(`/admin/leads/${encodeURIComponent(fromLead)}`) : null,
  ]);
  if (!data) return <ErrorState title="Could not load clients" description="Reload the page to try again." />;
  const prefill: ClientPrefill | undefined = lead ? { companyName: lead.companyName ?? lead.name, contactEmail: lead.email, contactPhone: lead.phone ?? undefined, ownerName: lead.name } : undefined;
  const pageCount = Math.max(1, Math.ceil(data.total / data.pageSize));
  const hrefFor = (p: number) => {
    const next = new URLSearchParams(query);
    if (p > 1) next.set('page', String(p));
    return `/admin/clients${next.size ? `?${next}` : ''}`;
  };

  return (
    <>
      <PageHeader title="Clients" description="Companies with access to the client portal." actions={can(admin?.permissions, 'clients.manage') ? <ClientCreate prefill={prefill} defaultOpen={Boolean(prefill)} leadId={prefill ? fromLead : undefined} /> : undefined} />

      <form method="get" className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_10rem_auto]">
        <Input name="q" defaultValue={values.q} placeholder="Search company or email" aria-label="Search clients" />
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
        {data.total} {data.total === 1 ? 'client' : 'clients'}
        {query.size > 0 && (
          <>
            {' · '}
            <Link href="/admin/clients" className="text-primary">
              Clear filters
            </Link>
          </>
        )}
      </p>

      {data.items.length === 0 ? (
        <EmptyState title="No clients yet" description="Create a client after a project agreement is signed." />
      ) : (
        <ul className="space-y-3">
          {data.items.map((client) => (
            <li key={client.id}>
              <Card className="transition-colors hover:border-primary/40">
                <Link href={`/admin/clients/${client.id}`} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{client.companyName}</p>
                    <p className="truncate text-sm text-muted">
                      {client.contactEmail}
                      {client.industry ? ` · ${client.industry}` : ''}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <Badge tone={client.active ? 'accent' : 'danger'}>{client.active ? 'Active' : 'Inactive'}</Badge>
                    <Badge>
                      {client.projectCount} {client.projectCount === 1 ? 'project' : 'projects'}
                    </Badge>
                    <Badge>
                      {client.userCount} {client.userCount === 1 ? 'user' : 'users'}
                    </Badge>
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
