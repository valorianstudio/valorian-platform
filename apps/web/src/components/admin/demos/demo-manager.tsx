'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Archive, ArrowDown, ArrowUp, Copy, ExternalLink, Globe, Pencil, Plus, Search, Smartphone, Star, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button, ButtonLink } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/dialog';
import { Input, Select } from '@/components/ui/field';
import { EmptyState } from '@/components/ui/states';
import { useToast } from '@/components/ui/toast';
import { refreshContent } from '@/lib/actions';
import { ApiError, apiRequest } from '@/lib/client-api';
import type { DemoRow, NamedRef } from './types';

const PAGE_SIZE = 10;
const dateFormat = new Intl.DateTimeFormat('en', { dateStyle: 'medium' });

export function DemoManager({ initial, categories, industries }: { initial: DemoRow[]; categories: NamedRef[]; industries: NamedRef[] }) {
  const router = useRouter();
  const toast = useToast();
  const [rows, setRows] = useState(initial);
  const [filters, setFilters] = useState({ q: '', status: '', category: '', industry: '', platform: '', featured: '', sort: 'order' });
  const [page, setPage] = useState(1);
  const [toDelete, setToDelete] = useState<DemoRow | null>(null);
  const [busy, setBusy] = useState(false);

  const set = (name: keyof typeof filters, value: string) => {
    setFilters((f) => ({ ...f, [name]: value }));
    setPage(1);
  };
  const filtering = Object.entries(filters).some(([key, value]) => key !== 'sort' && value);

  const filtered = rows
    .filter((d) => {
      const q = filters.q.trim().toLowerCase();
      if (q && !`${d.name} ${d.internalName ?? ''} ${d.slug}`.toLowerCase().includes(q)) return false;
      if (filters.status && d.status !== filters.status) return false;
      if (filters.category && d.categoryId !== filters.category) return false;
      if (filters.industry && d.industryId !== filters.industry) return false;
      if (filters.featured === 'yes' && !d.featured) return false;
      if (filters.featured === 'no' && d.featured) return false;
      const enabled = d.platforms.filter((p) => p.enabled).map((p) => p.type);
      if (filters.platform === 'WEBSITE' && !enabled.includes('WEBSITE')) return false;
      if (filters.platform === 'MOBILE' && !enabled.includes('MOBILE')) return false;
      if (filters.platform === 'BOTH' && enabled.length < 2) return false;
      return true;
    })
    .sort((a, b) => {
      if (filters.sort === 'name') return a.name.localeCompare(b.name);
      if (filters.sort === 'updated') return b.updatedAt.localeCompare(a.updatedAt);
      return 0;
    });
  const canReorder = filters.sort === 'order' && !filtering;
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  async function run<T>(action: () => Promise<T>, success: string): Promise<T | null> {
    try {
      const result = await action();
      await refreshContent();
      toast.success(success);
      return result;
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : 'Something went wrong.');
      return null;
    }
  }

  async function patch(row: DemoRow, body: Record<string, unknown>, message: string) {
    const saved = await run(() => apiRequest<DemoRow>('PATCH', `/admin/demos/${row.id}`, body), message);
    if (saved) setRows((all) => all.map((r) => (r.id === saved.id ? saved : r)));
  }

  async function move(row: DemoRow, delta: -1 | 1) {
    const index = rows.findIndex((r) => r.id === row.id);
    const target = index + delta;
    if (target < 0 || target >= rows.length) return;
    const next = [...rows];
    [next[index], next[target]] = [next[target], next[index]];
    const previous = rows;
    setRows(next);
    if ((await run(() => apiRequest('PUT', '/admin/demos/order', { ids: next.map((r) => r.id) }), 'Order saved.')) === null) setRows(previous);
  }

  async function duplicate(row: DemoRow) {
    const copy = await run(() => apiRequest<{ id: string }>('POST', `/admin/demos/${row.id}/duplicate`), 'Demo duplicated as a draft.');
    if (copy) router.push(`/admin/demos/${copy.id}/edit`);
  }

  async function confirmDelete() {
    if (!toDelete) return;
    setBusy(true);
    const ok = await run(() => apiRequest('DELETE', `/admin/demos/${toDelete.id}`), 'Demo deleted.');
    setBusy(false);
    if (ok !== null) setRows((all) => all.filter((r) => r.id !== toDelete.id));
    setToDelete(null);
  }

  const statusTone = { PUBLISHED: 'accent', DRAFT: 'neutral', ARCHIVED: 'danger' } as const;

  return (
    <div>
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative sm:col-span-2 lg:col-span-4">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
          <Input aria-label="Search demos" placeholder="Search demos…" className="pl-10" value={filters.q} onChange={(e) => set('q', e.target.value)} />
        </div>
        <Select aria-label="Status" value={filters.status} onChange={(e) => set('status', e.target.value)}>
          <option value="">All statuses</option>
          <option value="PUBLISHED">Published</option>
          <option value="DRAFT">Draft</option>
          <option value="ARCHIVED">Archived</option>
        </Select>
        <Select aria-label="Category" value={filters.category} onChange={(e) => set('category', e.target.value)}>
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </Select>
        <Select aria-label="Industry" value={filters.industry} onChange={(e) => set('industry', e.target.value)}>
          <option value="">All industries</option>
          {industries.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </Select>
        <Select aria-label="Platform" value={filters.platform} onChange={(e) => set('platform', e.target.value)}>
          <option value="">All platforms</option>
          <option value="WEBSITE">Website</option>
          <option value="MOBILE">Mobile App</option>
          <option value="BOTH">Website + Mobile</option>
        </Select>
        <Select aria-label="Featured" value={filters.featured} onChange={(e) => set('featured', e.target.value)}>
          <option value="">Featured: any</option>
          <option value="yes">Featured only</option>
          <option value="no">Not featured</option>
        </Select>
        <Select aria-label="Sort" value={filters.sort} onChange={(e) => set('sort', e.target.value)}>
          <option value="order">Sort: display order</option>
          <option value="name">Sort: name</option>
          <option value="updated">Sort: recently updated</option>
        </Select>
        <ButtonLink href="/admin/demos/new" className="sm:col-span-2 lg:col-span-1 lg:col-start-4">
          <Plus className="size-4" aria-hidden /> New demo
        </ButtonLink>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title={rows.length === 0 ? 'No demos yet' : 'No matches'}
          description={rows.length === 0 ? 'Create your first demo to showcase it on the website.' : 'Try different filters.'}
          action={rows.length === 0 ? <ButtonLink href="/admin/demos/new">New demo</ButtonLink> : undefined}
        />
      ) : (
        <ul className="space-y-3">
          {visible.map((row) => {
            const index = rows.findIndex((r) => r.id === row.id);
            const enabled = row.platforms.filter((p) => p.enabled);
            return (
              <li key={row.id}>
                <Card className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link href={`/admin/demos/${row.id}/edit`} className="break-words font-medium hover:text-primary">{row.name}</Link>
                      <Badge tone={statusTone[row.status]}>{row.status.charAt(0) + row.status.slice(1).toLowerCase()}</Badge>
                      {row.featured && <Badge tone="primary">Featured</Badge>}
                      {!row.active && <Badge>Inactive</Badge>}
                    </div>
                    <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
                      <span>{row.industry?.name ?? 'No industry'}</span>
                      {row.category && <span>· {row.category.name}</span>}
                      <span className="inline-flex items-center gap-1.5">
                        {enabled.some((p) => p.type === 'WEBSITE') && <Globe className="size-3.5" aria-label="Website" />}
                        {enabled.some((p) => p.type === 'MOBILE') && <Smartphone className="size-3.5" aria-label="Mobile app" />}
                        {enabled.length === 0 && 'No platform'}
                      </span>
                      <span>· Updated {dateFormat.format(new Date(row.updatedAt))}</span>
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-1">
                    {canReorder && (
                      <>
                        <Button size="sm" variant="ghost" aria-label="Move up" disabled={index === 0} onClick={() => move(row, -1)}><ArrowUp className="size-4" /></Button>
                        <Button size="sm" variant="ghost" aria-label="Move down" disabled={index === rows.length - 1} onClick={() => move(row, 1)}><ArrowDown className="size-4" /></Button>
                      </>
                    )}
                    <Button size="sm" variant="ghost" aria-label={row.featured ? 'Remove from featured' : 'Mark as featured'} aria-pressed={row.featured} onClick={() => patch(row, { featured: !row.featured }, 'Updated.')}>
                      <Star className={`size-4 ${row.featured ? 'fill-current text-primary' : ''}`} />
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => patch(row, { status: row.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED' }, row.status === 'PUBLISHED' ? 'Unpublished.' : 'Published.')}>
                      {row.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                    </Button>
                    {row.status !== 'ARCHIVED' && (
                      <Button size="sm" variant="ghost" aria-label="Archive" onClick={() => patch(row, { status: 'ARCHIVED' }, 'Archived.')}><Archive className="size-4" /></Button>
                    )}
                    {row.status === 'PUBLISHED' && (
                      <Link href={`/demos/${row.slug}`} target="_blank" aria-label="View on site" className="grid size-9 place-items-center rounded-lg hover:bg-surface-strong"><ExternalLink className="size-4" /></Link>
                    )}
                    <Button size="sm" variant="ghost" aria-label="Duplicate" onClick={() => duplicate(row)}><Copy className="size-4" /></Button>
                    <Link href={`/admin/demos/${row.id}/edit`} aria-label="Edit" className="grid size-9 place-items-center rounded-lg hover:bg-surface-strong"><Pencil className="size-4" /></Link>
                    <Button size="sm" variant="ghost" aria-label="Delete" className="text-danger" onClick={() => setToDelete(row)}><Trash2 className="size-4" /></Button>
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      )}

      {pageCount > 1 && (
        <nav aria-label="Pagination" className="mt-6 flex items-center justify-between text-sm">
          <span className="text-muted">Page {current} of {pageCount}</span>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" disabled={current === 1} onClick={() => setPage(current - 1)}>Previous</Button>
            <Button size="sm" variant="secondary" disabled={current === pageCount} onClick={() => setPage(current + 1)}>Next</Button>
          </div>
        </nav>
      )}

      <ConfirmDialog
        open={toDelete !== null}
        title="Delete this demo?"
        description={`“${toDelete?.name ?? ''}” and all its features, modules and screenshots will be permanently removed. Consider archiving it instead.`}
        busy={busy}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
