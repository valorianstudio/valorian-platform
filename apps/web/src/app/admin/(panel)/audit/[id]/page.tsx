import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { formatDateTime, titleCase } from '@/components/admin/team/shared';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { getAdminJson } from '@/lib/server-api';

export const metadata: Metadata = { title: 'Audit entry' };

interface Entry {
  id: string;
  adminName: string;
  adminEmail: string | null;
  action: string;
  module: string;
  entityType: string | null;
  entityId: string | null;
  entityLabel: string | null;
  summary: string;
  changes: Record<string, { before: unknown; after: unknown }> | null;
  ipMasked: string | null;
  userAgent: string | null;
  createdAt: string;
}

function show(value: unknown): string {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'string') return value;
  return JSON.stringify(value, null, 2);
}

export default async function AuditEntryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const entry = await getAdminJson<Entry>(`/admin/audit/${encodeURIComponent(id)}`);
  if (!entry) notFound();
  const changes = entry.changes ? Object.entries(entry.changes) : [];

  return (
    <>
      <Link href="/admin/audit" className="mb-3 inline-flex items-center gap-1 py-2 text-sm text-muted transition-colors hover:text-foreground">
        <ChevronLeft className="size-4" aria-hidden /> Audit log
      </Link>
      <PageHeader title={entry.summary} description={formatDateTime(entry.createdAt)} actions={<Badge>{titleCase(entry.action)}</Badge>} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[22rem_1fr]">
        <Card className="h-fit p-6">
          <dl className="space-y-3 text-sm">
            {[
              ['Who', entry.adminEmail ? `${entry.adminName} (${entry.adminEmail})` : entry.adminName],
              ['Module', titleCase(entry.module)],
              ['Entity', [entry.entityType, entry.entityLabel].filter(Boolean).join(' · ') || '—'],
              ['Entity ID', entry.entityId ?? '—'],
              ['IP address', entry.ipMasked ?? '—'],
              ['Device', entry.userAgent ?? '—'],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-muted">{label}</dt>
                <dd className="break-words">{value}</dd>
              </div>
            ))}
          </dl>
        </Card>
        <Card className="p-6">
          <h2 className="text-lg font-semibold">Changes</h2>
          {changes.length === 0 ? (
            <p className="mt-3 text-sm text-muted">No field-level changes were recorded for this entry.</p>
          ) : (
            <div className="mt-4 space-y-4">
              {changes.map(([field, change]) => (
                <div key={field}>
                  <p className="mb-1.5 text-sm font-medium">{titleCase(field)}</p>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <pre className="max-h-64 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-danger-soft p-3 text-xs text-foreground">
                      <span className="mb-1 block font-sans font-medium text-danger">Before</span>
                      {show(change?.before)}
                    </pre>
                    <pre className="max-h-64 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-accent-soft p-3 text-xs text-foreground">
                      <span className="mb-1 block font-sans font-medium text-accent">After</span>
                      {show(change?.after)}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
