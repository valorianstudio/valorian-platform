import type { ReactNode } from 'react';
import { AlertTriangle, Inbox } from 'lucide-react';
import { Card } from './card';

interface StateProps {
  title?: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ title = 'Nothing here yet', description, action }: StateProps) {
  return (
    <Card className="flex flex-col items-center gap-3 px-6 py-14 text-center">
      <span className="grid size-11 place-items-center rounded-full bg-surface-strong text-muted">
        <Inbox className="size-5" aria-hidden />
      </span>
      <h2 className="text-base font-semibold">{title}</h2>
      {description && <p className="max-w-sm text-sm text-muted">{description}</p>}
      {action}
    </Card>
  );
}

export function ErrorState({ title = 'Something went wrong', description, action }: StateProps) {
  return (
    <Card role="alert" className="flex flex-col items-center gap-3 px-6 py-14 text-center">
      <span className="grid size-11 place-items-center rounded-full bg-danger-soft text-danger">
        <AlertTriangle className="size-5" aria-hidden />
      </span>
      <h2 className="text-base font-semibold">{title}</h2>
      {description && <p className="max-w-sm text-sm text-muted">{description}</p>}
      {action}
    </Card>
  );
}
