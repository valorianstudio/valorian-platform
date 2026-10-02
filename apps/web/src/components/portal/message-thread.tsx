'use client';

import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Send } from 'lucide-react';
import { FormAlert } from '@/components/admin/form-alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/field';
import { ApiError, apiRequest } from '@/lib/client-api';
import { cn } from '@/lib/cn';
import { formatDateTime } from '@/lib/portal';
import type { PortalMessage } from '@/lib/portal';

interface Props {
  messages: PortalMessage[];
  endpoint: string;
  /** Which side is viewing; their own messages sit on the right. */
  viewer: 'CLIENT' | 'TEAM';
  /** Team only: allow posting a note the client cannot see. */
  allowInternal?: boolean;
  emptyText?: string;
}

export function MessageThread({ messages, endpoint, viewer, allowInternal, emptyText = 'No messages yet. Say hello!' }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [internal, setInternal] = useState(false);
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    end.current?.scrollIntoView({ block: 'nearest' });
  }, [messages.length]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = event.currentTarget;
    const message = String(new FormData(form).get('message') ?? '').trim();
    if (!message) return;
    setBusy(true);
    setError(null);
    try {
      await apiRequest('POST', endpoint, allowInternal ? { message, visibleToClient: !internal } : { message });
      form.reset();
      setInternal(false);
      router.refresh();
    } catch (e) {
      setError(e instanceof ApiError ? e : null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="max-h-[28rem] space-y-3 overflow-y-auto rounded-xl border border-border bg-surface p-3 sm:p-4" role="log" aria-live="polite" aria-label="Conversation">
        {messages.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted">{emptyText}</p>
        ) : (
          messages.map((m) => {
            const mine = m.senderType === viewer;
            return (
              <div key={m.id} className={cn('flex', mine ? 'justify-end' : 'justify-start')}>
                <div className={cn('max-w-[85%] rounded-2xl px-4 py-2.5 text-sm', mine ? 'bg-primary text-primary-foreground' : 'border border-border bg-background')}>
                  <p className={cn('mb-0.5 text-xs font-medium', mine ? 'text-primary-foreground/80' : 'text-muted')}>
                    {m.senderType === 'TEAM' ? `${m.senderName} · Valorian` : m.senderName}
                    {m.visibleToClient === false && <Badge tone="danger" className="ml-2">Internal</Badge>}
                  </p>
                  <p className="whitespace-pre-wrap break-words">{m.message}</p>
                  <p className={cn('mt-1 text-[11px]', mine ? 'text-primary-foreground/70' : 'text-muted')}>{formatDateTime(m.createdAt)}</p>
                </div>
              </div>
            );
          })
        )}
        <div ref={end} />
      </div>

      <form onSubmit={onSubmit} className="mt-3 space-y-3">
        <FormAlert error={error} />
        <Textarea name="message" required maxLength={4000} rows={3} placeholder={allowInternal ? 'Reply to the client…' : 'Write a message to the Valorian team…'} aria-label="Message" className="min-h-20" />
        <div className="flex flex-wrap items-center justify-between gap-3">
          {allowInternal ? (
            <label className="flex items-center gap-2 text-sm text-muted">
              <input type="checkbox" checked={internal} onChange={(e) => setInternal(e.target.checked)} className="size-4 accent-[var(--color-primary)]" /> Internal note (hidden from client)
            </label>
          ) : (
            <span />
          )}
          <Button type="submit" loading={busy}>
            <Send className="size-4" aria-hidden /> Send
          </Button>
        </div>
      </form>
    </div>
  );
}
