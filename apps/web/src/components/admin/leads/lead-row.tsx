import Link from 'next/link';
import { CalendarClock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { PLATFORM_LABEL, PriorityBadge, SOURCE_LABEL, StatusBadge, estimateText, formatDate, money } from './shared';
import type { LeadRow } from './shared';

export function LeadRowCard({ lead }: { lead: LeadRow }) {
  const overdue = lead.followUpAt !== null && new Date(lead.followUpAt) < new Date(new Date().toDateString()) && lead.status !== 'WON' && lead.status !== 'LOST';
  const project = [lead.demo?.name ?? lead.service?.title, lead.platform && PLATFORM_LABEL[lead.platform], lead.projectType].filter(Boolean).join(' · ');

  return (
    <Card className="transition-colors hover:border-primary/40">
      <Link href={`/admin/leads/${lead.id}`} className="grid grid-cols-1 gap-3 p-4 lg:grid-cols-[1.4fr_1.4fr_1fr_auto] lg:items-center lg:gap-5">
        <div className="min-w-0">
          <p className="font-mono text-xs text-muted">{lead.referenceCode}</p>
          <p className="truncate font-medium">{lead.name}</p>
          <p className="truncate text-sm text-muted">{lead.companyName ?? lead.email}</p>
        </div>
        <div className="min-w-0 text-sm">
          <p className="truncate">{project || '—'}</p>
          <p className="text-muted">{SOURCE_LABEL[lead.source] ?? lead.source}</p>
        </div>
        <div className="text-sm">
          <p className="font-medium tabular-nums">{lead.finalProjectValue !== null ? `Final ${money(lead.finalProjectValue, lead.finalCurrency)}` : estimateText(lead)}</p>
          <p className={`flex items-center gap-1 ${overdue ? 'text-danger' : 'text-muted'}`}>
            {lead.followUpAt ? (
              <>
                <CalendarClock className="size-3.5" aria-hidden /> {formatDate(lead.followUpAt)}
              </>
            ) : (
              <>Created {formatDate(lead.createdAt)}</>
            )}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
          <StatusBadge status={lead.status} />
          <PriorityBadge priority={lead.priority} />
          {lead.archivedAt && <span className="text-xs text-muted">Archived</span>}
        </div>
      </Link>
    </Card>
  );
}
