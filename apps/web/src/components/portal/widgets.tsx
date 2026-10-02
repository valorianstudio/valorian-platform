import { Check, Circle, Clock, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/cn';
import { formatDate, label, milestoneTone, statusTone } from '@/lib/portal';
import type { MilestoneStatus, PortalMilestone, ProjectStatus } from '@/lib/portal';

export function StatusBadge({ status }: { status: ProjectStatus }) {
  return <Badge tone={statusTone(status)}>{label(status)}</Badge>;
}

export function ProgressBar({ value, className }: { value: number; className?: string }) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Project progress" className="h-2 flex-1 overflow-hidden rounded-full bg-surface-strong">
        <div className="h-full rounded-full bg-primary transition-[width]" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-10 text-right text-sm font-medium tabular-nums">{pct}%</span>
    </div>
  );
}

const ICON: Record<MilestoneStatus, typeof Check> = { COMPLETED: Check, IN_PROGRESS: Clock, DELAYED: AlertTriangle, PENDING: Circle };

export function MilestoneTimeline({ milestones }: { milestones: PortalMilestone[] }) {
  if (milestones.length === 0) return <p className="text-sm text-muted">No milestones have been added yet.</p>;
  const currentId = milestones.find((m) => m.status === 'IN_PROGRESS' || m.status === 'DELAYED')?.id ?? milestones.find((m) => m.status === 'PENDING')?.id;
  return (
    <ol className="relative space-y-5 border-l border-border pl-6">
      {milestones.map((milestone) => {
        const Icon = ICON[milestone.status];
        const tone = milestoneTone(milestone.status);
        return (
          <li key={milestone.id} className="relative">
            <span
              className={cn(
                'absolute -left-[2.2rem] grid size-6 place-items-center rounded-full ring-4 ring-background',
                tone === 'accent' && 'bg-accent text-white',
                tone === 'primary' && 'bg-primary text-primary-foreground',
                tone === 'danger' && 'bg-danger text-white',
                tone === 'neutral' && 'bg-surface-strong text-muted',
              )}
            >
              <Icon className="size-3.5" aria-hidden />
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-medium">{milestone.title}</h3>
              <Badge tone={tone}>{label(milestone.status)}</Badge>
              {milestone.id === currentId && milestone.status !== 'DELAYED' && <Badge tone="primary">Current</Badge>}
            </div>
            {milestone.description && <p className="mt-1 text-sm text-muted">{milestone.description}</p>}
            <p className="mt-1 text-xs text-muted">{milestone.status === 'COMPLETED' ? `Completed ${formatDate(milestone.completedDate)}` : milestone.dueDate ? `Due ${formatDate(milestone.dueDate)}` : 'No due date'}</p>
          </li>
        );
      })}
    </ol>
  );
}
