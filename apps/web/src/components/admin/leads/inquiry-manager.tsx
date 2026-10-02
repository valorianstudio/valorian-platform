'use client';

import { useState } from 'react';
import { Archive, ArchiveRestore, ChevronDown, Mail, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input, Select, Textarea } from '@/components/ui/field';
import { EmptyState } from '@/components/ui/states';
import { useToast } from '@/components/ui/toast';
import { ApiError, apiRequest } from '@/lib/client-api';
import { cn } from '@/lib/cn';
import { LEAD_PRIORITIES } from '@/lib/types';
import { CONTACT_LABEL, PriorityBadge, formatDateTime } from './shared';
import type { LeadPriority } from '@/lib/types';

export interface InquiryRow {
  id: string;
  type: 'PROJECT' | 'GENERAL' | 'PARTNERSHIP' | 'SUPPORT' | 'OTHER';
  name: string;
  email: string;
  phone: string | null;
  companyName: string | null;
  country: string | null;
  message: string;
  preferredContact: string;
  sourceUrl: string | null;
  status: 'NEW' | 'REPLIED' | 'CLOSED';
  priority: LeadPriority;
  isRead: boolean;
  internalNote: string | null;
  archivedAt: string | null;
  createdAt: string;
}

const PAGE_SIZE = 15;
const TYPE_LABEL: Record<string, string> = { GENERAL: 'General', PARTNERSHIP: 'Partnership', SUPPORT: 'Support', OTHER: 'Other', PROJECT: 'Project' };
const STATUS_LABEL = { NEW: 'New', REPLIED: 'Replied', CLOSED: 'Closed' } as const;

export function InquiryManager({ initial, archivedView }: { initial: InquiryRow[]; archivedView: boolean }) {
  const toast = useToast();
  const [rows, setRows] = useState(initial);
  const [q, setQ] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const filtered = rows.filter((r) => {
    if (type && r.type !== type) return false;
    if (status && r.status !== status) return false;
    if (unreadOnly && r.isRead) return false;
    const needle = q.trim().toLowerCase();
    return !needle || `${r.name} ${r.email} ${r.companyName ?? ''} ${r.message}`.toLowerCase().includes(needle);
  });
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  async function update(row: InquiryRow, body: Record<string, unknown>, message?: string) {
    try {
      const saved = await apiRequest<InquiryRow>('PATCH', `/admin/inquiries/${row.id}`, body);
      setRows((all) => ('archived' in body ? all.filter((r) => r.id !== row.id) : all.map((r) => (r.id === saved.id ? saved : r))));
      if (message) toast.success(message);
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : 'Could not update the inquiry.');
    }
  }

  function toggle(row: InquiryRow) {
    const opening = openId !== row.id;
    setOpenId(opening ? row.id : null);
    if (opening && !row.isRead) void update(row, { isRead: true });
  }

  return (
    <div>
      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_auto]">
        <div className="relative sm:col-span-2 lg:col-span-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
          <Input aria-label="Search inquiries" placeholder="Search inquiries…" className="pl-10" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} />
        </div>
        <Select aria-label="Type" value={type} onChange={(e) => { setType(e.target.value); setPage(1); }}>
          <option value="">All types</option>
          {Object.entries(TYPE_LABEL).filter(([key]) => key !== 'PROJECT').map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </Select>
        <Select aria-label="Status" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
          <option value="">All statuses</option>
          {Object.entries(STATUS_LABEL).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </Select>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={unreadOnly} onChange={(e) => { setUnreadOnly(e.target.checked); setPage(1); }} className="size-4 accent-[var(--primary)]" /> Unread only
        </label>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title={rows.length ? 'No matches' : archivedView ? 'No archived inquiries' : 'No inquiries yet'} description={rows.length ? 'Try different filters.' : 'General, partnership and support messages from the contact form appear here.'} />
      ) : (
        <ul className="space-y-3">
          {visible.map((row) => {
            const open = openId === row.id;
            return (
              <li key={row.id}>
                <Card>
                  <button type="button" aria-expanded={open} onClick={() => toggle(row)} className="flex w-full items-start gap-3 p-4 text-left">
                    <span aria-hidden className={cn('mt-2 size-2 shrink-0 rounded-full', row.isRead ? 'bg-transparent' : 'bg-primary')} />
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className={cn('truncate', !row.isRead && 'font-semibold')}>{row.name}</span>
                        <Badge>{TYPE_LABEL[row.type]}</Badge>
                        <Badge tone={row.status === 'NEW' ? 'primary' : row.status === 'REPLIED' ? 'accent' : 'neutral'}>{STATUS_LABEL[row.status]}</Badge>
                        <PriorityBadge priority={row.priority} />
                      </span>
                      <span className="mt-1 line-clamp-2 break-words text-sm text-muted">{row.message}</span>
                      <span className="mt-1 block text-xs text-muted">{formatDateTime(row.createdAt)}</span>
                    </span>
                    <ChevronDown className={cn('mt-1 size-4 shrink-0 text-muted transition-transform', open && 'rotate-180')} aria-hidden />
                  </button>
                  {open && (
                    <div className="space-y-5 border-t border-border p-4">
                      <p className="whitespace-pre-line break-words">{row.message}</p>
                      <dl className="grid gap-3 text-sm sm:grid-cols-2">
                        <div><dt className="text-muted">Email</dt><dd className="break-all font-medium">{row.email}</dd></div>
                        <div><dt className="text-muted">Phone</dt><dd className="font-medium">{row.phone ?? '—'}</dd></div>
                        <div><dt className="text-muted">Company</dt><dd className="font-medium">{row.companyName ?? '—'}</dd></div>
                        <div><dt className="text-muted">Country</dt><dd className="font-medium">{row.country ?? '—'}</dd></div>
                        <div><dt className="text-muted">Preferred contact</dt><dd className="font-medium">{CONTACT_LABEL[row.preferredContact] ?? row.preferredContact}</dd></div>
                      </dl>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Select aria-label="Status" value={row.status} onChange={(e) => update(row, { status: e.target.value }, 'Status updated.')}>
                          {Object.entries(STATUS_LABEL).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                        </Select>
                        <Select aria-label="Priority" value={row.priority} onChange={(e) => update(row, { priority: e.target.value }, 'Priority updated.')}>
                          {LEAD_PRIORITIES.map((p) => (
                            <option key={p} value={p}>{p.charAt(0) + p.slice(1).toLowerCase()}</option>
                          ))}
                        </Select>
                      </div>
                      <form
                        onSubmit={(event) => {
                          event.preventDefault();
                          void update(row, { internalNote: String(new FormData(event.currentTarget).get('note') ?? '') }, 'Note saved.');
                        }}
                        className="space-y-2"
                      >
                        <Textarea name="note" aria-label="Internal note" placeholder="Internal note (admins only)" rows={2} maxLength={2000} defaultValue={row.internalNote ?? ''} className="min-h-16" />
                        <Button type="submit" size="sm" variant="secondary">Save note</Button>
                      </form>
                      <div className="flex flex-wrap gap-2">
                        <a href={`mailto:${row.email}?subject=${encodeURIComponent('Re: your message')}`} className="inline-flex h-9 items-center gap-2 rounded-lg border border-border px-3 text-sm font-medium hover:bg-surface-strong">
                          <Mail className="size-4" aria-hidden /> Reply by email
                        </a>
                        <Button size="sm" variant="ghost" onClick={() => update(row, { isRead: !row.isRead })}>{row.isRead ? 'Mark unread' : 'Mark read'}</Button>
                        <Button size="sm" variant="ghost" onClick={() => update(row, { archived: !row.archivedAt }, row.archivedAt ? 'Restored.' : 'Archived.')}>
                          {row.archivedAt ? <ArchiveRestore className="size-4" aria-hidden /> : <Archive className="size-4" aria-hidden />} {row.archivedAt ? 'Restore' : 'Archive'}
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              </li>
            );
          })}
        </ul>
      )}

      {pages > 1 && (
        <nav aria-label="Pagination" className="mt-6 flex items-center justify-between text-sm">
          <span className="text-muted">Page {current} of {pages}</span>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" disabled={current === 1} onClick={() => setPage(current - 1)}>Previous</Button>
            <Button size="sm" variant="secondary" disabled={current === pages} onClick={() => setPage(current + 1)}>Next</Button>
          </div>
        </nav>
      )}
    </div>
  );
}
