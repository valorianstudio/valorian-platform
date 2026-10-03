import Link from 'next/link';
import { Plus, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button, ButtonLink } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input, Select } from '@/components/ui/field';
import { PageHeader } from '@/components/ui/page-header';
import { EmptyState, ErrorState } from '@/components/ui/states';
import { getAdminJson } from '@/lib/server-api';
import { RowActions } from './row-actions';

type Params = Record<string, string | string[] | undefined>;
const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? '';
const dateFormat = new Intl.DateTimeFormat('en', { dateStyle: 'medium' });

interface Row {
  id: string;
  slug: string;
  title: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  featured: boolean;
  publishedAt: string | null;
  updatedAt: string;
}

interface ContentListProps {
  title: string;
  description: string;
  /** API collection and route segments. */
  resource: string;
  adminPath: string;
  publicPath: string;
  singular: string;
  searchParams: Params;
  filter: { name: string; label: string; options: { value: string; label: string }[] };
  meta: (row: Row & Record<string, unknown>) => string;
  extraActions?: React.ReactNode;
}

export async function ContentList({ title, description, resource, adminPath, publicPath, singular, searchParams, filter, meta, extraActions }: ContentListProps) {
  const keys = ['q', 'status', filter.name, 'featured', 'sort', 'page'];
  const query = new URLSearchParams();
  for (const key of keys) {
    const value = first(searchParams[key]);
    if (value) query.set(key, value);
  }
  const data = await getAdminJson<{ items: (Row & Record<string, unknown>)[]; total: number; page: number; pageSize: number }>(`/admin/${resource}?${query}`);
  if (!data) return <ErrorState title={`Could not load ${title.toLowerCase()}`} description="Reload the page to try again." />;
  const pageCount = Math.max(1, Math.ceil(data.total / data.pageSize));
  const href = (page: number) => {
    const next = new URLSearchParams(query);
    next.set('page', String(page));
    return `/admin/${adminPath}?${next}`;
  };
  const now = Date.now();

  return (
    <>
      <PageHeader
        title={title}
        description={description}
        actions={
          <div className="flex flex-wrap gap-2">
            {extraActions}
            <ButtonLink href={`/admin/${adminPath}/new`} size="sm">
              <Plus className="size-4" aria-hidden /> New {singular}
            </ButtonLink>
          </div>
        }
      />
      <form method="get" action={`/admin/${adminPath}`} role="search" aria-label={`Filter ${title.toLowerCase()}`} className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_auto]">
        <div className="relative sm:col-span-2 lg:col-span-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
          <Input name="q" aria-label="Search" placeholder="Search…" defaultValue={first(searchParams.q)} className="pl-10" />
        </div>
        <Select name="status" aria-label="Status" defaultValue={first(searchParams.status)}>
          <option value="">All statuses</option>
          <option value="PUBLISHED">Published</option>
          <option value="DRAFT">Draft</option>
          <option value="ARCHIVED">Archived</option>
        </Select>
        <Select name={filter.name} aria-label={filter.label} defaultValue={first(searchParams[filter.name])}>
          <option value="">{`All ${filter.label.toLowerCase()}s`}</option>
          {filter.options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </Select>
        <Select name="sort" aria-label="Sort" defaultValue={first(searchParams.sort)}>
          <option value="">Recently updated</option>
          <option value="published">Publish date</option>
          <option value="title">Title</option>
        </Select>
        <Button type="submit">Apply</Button>
      </form>
      <p className="mb-3 text-sm text-muted" aria-live="polite">
        {data.total} {data.total === 1 ? singular : `${singular}s`}
      </p>

      {data.items.length === 0 ? (
        <EmptyState title={query.size ? 'No matches' : `No ${singular}s yet`} description={query.size ? 'Try different filters.' : `Create your first ${singular} to show it on the website.`} action={query.size ? undefined : <ButtonLink href={`/admin/${adminPath}/new`}>New {singular}</ButtonLink>} />
      ) : (
        <ul className="space-y-3">
          {data.items.map((row) => {
            const scheduled = row.status === 'PUBLISHED' && row.publishedAt !== null && new Date(row.publishedAt).getTime() > now;
            const live = row.status === 'PUBLISHED' && !scheduled;
            return (
              <li key={row.id}>
                <Card className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link href={`/admin/${adminPath}/${row.id}/edit`} className="break-words font-medium hover:text-primary">{row.title}</Link>
                      <Badge tone={live ? 'accent' : row.status === 'ARCHIVED' ? 'danger' : scheduled ? 'primary' : 'neutral'}>{scheduled ? 'Scheduled' : row.status.charAt(0) + row.status.slice(1).toLowerCase()}</Badge>
                      {row.featured && <Badge tone="primary">Featured</Badge>}
                    </div>
                    <p className="mt-1 text-sm text-muted">
                      {meta(row)}
                      {row.publishedAt ? ` · ${scheduled ? 'Goes live' : 'Published'} ${dateFormat.format(new Date(row.publishedAt))}` : ''} · Updated {dateFormat.format(new Date(row.updatedAt))}
                    </p>
                  </div>
                  <RowActions resource={resource} adminPath={adminPath} publicPath={publicPath} id={row.id} slug={row.slug} title={row.title} status={row.status} featured={row.featured} live={live} />
                </Card>
              </li>
            );
          })}
        </ul>
      )}

      {pageCount > 1 && (
        <nav aria-label="Pagination" className="mt-6 flex items-center justify-between text-sm">
          <span className="text-muted">Page {data.page} of {pageCount}</span>
          <div className="flex gap-2">
            {data.page > 1 && <ButtonLink href={href(data.page - 1)} variant="secondary" size="sm">Previous</ButtonLink>}
            {data.page < pageCount && <ButtonLink href={href(data.page + 1)} variant="secondary" size="sm">Next</ButtonLink>}
          </div>
        </nav>
      )}
    </>
  );
}
