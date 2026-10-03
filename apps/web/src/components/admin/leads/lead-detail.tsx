'use client';

import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Archive, ArchiveRestore, ArrowLeft, Copy, Mail, MessageCircle, Pencil, Trash2 } from 'lucide-react';
import { FormAlert } from '@/components/admin/form-alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/dialog';
import { Field, Input, Select, Textarea } from '@/components/ui/field';
import { useToast } from '@/components/ui/toast';
import { ApiError, apiRequest } from '@/lib/client-api';
import { LEAD_PRIORITIES, LEAD_STATUSES } from '@/lib/types';
import type { LeadPriority, LeadStatus } from '@/lib/types';
import { whatsappLink } from '@/lib/whatsapp';
import { CONTACT_LABEL, PLATFORM_LABEL, PriorityBadge, SOURCE_LABEL, STATUS_LABEL, StatusBadge, estimateText, formatDate, formatDateTime, money } from './shared';

interface Snapshot {
  projectType?: { name: string; basePrice: number };
  features?: { id: string; name: string; category: string | null; price: number }[];
  integrations?: { id: string; name: string; price: number }[];
  complexity?: { name: string; multiplier: number };
  scale?: { label: string; multiplier: number };
  urgency?: { label: string; multiplier: number };
}

export interface LeadFull {
  id: string;
  referenceCode: string;
  name: string;
  email: string;
  phone: string | null;
  whatsapp: string | null;
  companyName: string | null;
  country: string | null;
  preferredContact: string;
  source: string;
  sourceUrl: string | null;
  projectType: string | null;
  platform: string | null;
  estimatedMin: number | null;
  estimatedMax: number | null;
  currency: 'BDT' | 'USD' | null;
  finalProjectValue: number | null;
  finalCurrency: 'BDT' | 'USD' | null;
  priority: LeadPriority;
  status: LeadStatus;
  expectedTimeline: string | null;
  budgetRange: string | null;
  clientMessage: string | null;
  internalSummary: string | null;
  followUpAt: string | null;
  followUpNote: string | null;
  wonAt: string | null;
  lostAt: string | null;
  lostReason: string | null;
  archivedAt: string | null;
  createdAt: string;
  demo: { id: string; name: string; slug: string } | null;
  service: { id: string; title: string; slug: string } | null;
  estimatorSubmission: { weeksMin: number; weeksMax: number; complexity: string; scale: string; urgency: string; breakdown: { snapshot?: Snapshot } } | null;
  notes: { id: string; content: string; authorId: string | null; authorName: string; createdAt: string }[];
  activities: { id: string; type: string; title: string; detail: string | null; authorName: string | null; createdAt: string }[];
}

const LOST_REASONS = [
  ['PRICE', 'Price'],
  ['NO_RESPONSE', 'No response'],
  ['CHOSE_COMPETITOR', 'Chose a competitor'],
  ['PROJECT_CANCELLED', 'Project cancelled'],
  ['REQUIREMENTS_CHANGED', 'Requirements changed'],
  ['OTHER', 'Other'],
] as const;
const ACTIVITY_TYPES = [
  ['CALL', 'Phone call'],
  ['WHATSAPP', 'WhatsApp'],
  ['EMAIL', 'Email'],
  ['MEETING', 'Meeting'],
  ['PROPOSAL_SENT', 'Proposal sent'],
  ['OTHER', 'Other'],
] as const;

function Section({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <Card className="p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        {action}
      </div>
      {children}
    </Card>
  );
}

function Info({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="mt-0.5 break-words font-medium">{children || '—'}</dd>
    </div>
  );
}

export function LeadDetail({ lead, currentAdminId, company }: { lead: LeadFull; currentAdminId: string; company: string }) {
  const router = useRouter();
  const toast = useToast();
  const [error, setError] = useState<ApiError | null>(null);
  const [busy, setBusy] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<'WON' | 'LOST' | null>(null);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [priority, setPriority] = useState(lead.priority);
  const [followUp, setFollowUp] = useState(lead.followUpAt?.slice(0, 10) ?? '');
  const [followUpNote, setFollowUpNote] = useState(lead.followUpNote ?? '');
  const [finalValue, setFinalValue] = useState(lead.finalProjectValue?.toString() ?? '');
  const [finalCurrency, setFinalCurrency] = useState<'BDT' | 'USD'>(lead.finalCurrency ?? lead.currency ?? 'USD');
  const [summary, setSummary] = useState(lead.internalSummary ?? '');

  async function run(action: () => Promise<unknown>, success: string): Promise<boolean> {
    if (busy) return false;
    setBusy(true);
    setError(null);
    try {
      await action();
      toast.success(success);
      router.refresh();
      return true;
    } catch (e) {
      const apiError = e instanceof ApiError ? e : new ApiError('Something went wrong.', 0);
      setError(apiError);
      toast.error(apiError.message);
      return false;
    } finally {
      setBusy(false);
    }
  }

  const patch = (body: Record<string, unknown>, message: string) => run(() => apiRequest('PATCH', `/admin/leads/${lead.id}`, body), message);
  const changeStatus = (status: LeadStatus, extra: Record<string, unknown> = {}) => run(() => apiRequest('POST', `/admin/leads/${lead.id}/status`, { status, ...extra }), `Status set to ${STATUS_LABEL[status]}.`);
  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied.`);
    } catch {
      toast.error('Could not copy to the clipboard.');
    }
  };

  const phoneForWa = lead.whatsapp ?? lead.phone;
  const wa = whatsappLink(phoneForWa, `Hello ${lead.name}, this is ${company}. Following up on your project request ${lead.referenceCode}.`);
  const snapshot = lead.estimatorSubmission?.breakdown.snapshot;

  return (
    <div>
      <Link href="/admin/leads" className="mb-3 inline-flex items-center gap-1 py-2 text-sm text-muted transition-colors hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden /> All leads
      </Link>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="font-mono text-sm text-muted">{lead.referenceCode}</p>
          <h1 className="break-words text-2xl font-semibold tracking-tight sm:text-3xl">{lead.name}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <StatusBadge status={lead.status} />
            <PriorityBadge priority={lead.priority} />
            {lead.archivedAt && <span className="text-sm text-muted">Archived</span>}
          </div>
        </div>
        <Button variant="secondary" size="sm" disabled={busy} onClick={() => run(() => apiRequest('POST', `/admin/leads/${lead.id}/${lead.archivedAt ? 'restore' : 'archive'}`), lead.archivedAt ? 'Lead restored.' : 'Lead archived.')}>
          {lead.archivedAt ? <ArchiveRestore className="size-4" aria-hidden /> : <Archive className="size-4" aria-hidden />} {lead.archivedAt ? 'Restore' : 'Archive'}
        </Button>
      </div>
      <FormAlert error={error} />

      <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="min-w-0 space-y-6">
          <Section title="Client">
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Info label="Name">{lead.name}</Info>
              <Info label="Company">{lead.companyName}</Info>
              <Info label="Email">{lead.email}</Info>
              <Info label="Phone">{lead.phone}</Info>
              <Info label="WhatsApp">{lead.whatsapp}</Info>
              <Info label="Country">{lead.country}</Info>
              <Info label="Preferred contact">{CONTACT_LABEL[lead.preferredContact] ?? lead.preferredContact}</Info>
            </dl>
            <div className="mt-5 flex flex-wrap gap-2">
              <a href={`mailto:${lead.email}`} className="inline-flex h-9 items-center gap-2 rounded-lg border border-border px-3 text-sm font-medium hover:bg-surface-strong">
                <Mail className="size-4" aria-hidden /> Email client
              </a>
              {wa && (
                <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex h-9 items-center gap-2 rounded-lg border border-border px-3 text-sm font-medium hover:bg-surface-strong">
                  <MessageCircle className="size-4" aria-hidden /> Open WhatsApp
                </a>
              )}
              <Button size="sm" variant="ghost" onClick={() => copy(lead.email, 'Email')}><Copy className="size-4" aria-hidden /> Copy email</Button>
              {(lead.phone ?? lead.whatsapp) && <Button size="sm" variant="ghost" onClick={() => copy((lead.phone ?? lead.whatsapp) as string, 'Phone')}><Copy className="size-4" aria-hidden /> Copy phone</Button>}
            </div>
          </Section>

          <Section title="Project">
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Info label="Source">{SOURCE_LABEL[lead.source] ?? lead.source}</Info>
              <Info label="Source page">{lead.sourceUrl}</Info>
              <Info label="Demo">{lead.demo && <Link href={`/demos/${lead.demo.slug}`} target="_blank" className="text-primary">{lead.demo.name}</Link>}</Info>
              <Info label="Service">{lead.service && <Link href={`/services/${lead.service.slug}`} target="_blank" className="text-primary">{lead.service.title}</Link>}</Info>
              <Info label="Project type">{lead.projectType}</Info>
              <Info label="Platform">{lead.platform && PLATFORM_LABEL[lead.platform]}</Info>
              <Info label="Expected timeline">{lead.expectedTimeline}</Info>
              <Info label="Budget range">{lead.budgetRange}</Info>
            </dl>
            <div className="mt-5">
              <p className="text-sm text-muted">Client message</p>
              <p className="mt-1 whitespace-pre-line break-words">{lead.clientMessage || '—'}</p>
            </div>
          </Section>

          {lead.estimatorSubmission && (
            <Section title="Estimate (as shown to the client)">
              <p className="text-2xl font-semibold tabular-nums">{estimateText(lead)}</p>
              <p className="mt-1 text-sm text-muted">
                Timeline {lead.estimatorSubmission.weeksMin}–{lead.estimatorSubmission.weeksMax} weeks · {lead.estimatorSubmission.complexity} · {lead.estimatorSubmission.scale} · {lead.estimatorSubmission.urgency}
              </p>
              {snapshot && (
                <dl className="mt-5 space-y-4 text-sm">
                  <div>
                    <dt className="text-muted">Base ({snapshot.projectType?.name})</dt>
                    <dd className="font-medium tabular-nums">{money(snapshot.projectType?.basePrice ?? 0, lead.currency)}</dd>
                  </div>
                  <div>
                    <dt className="text-muted">Features</dt>
                    <dd>
                      <ul className="mt-1 divide-y divide-border rounded-lg border border-border">
                        {(snapshot.features ?? []).map((f) => (
                          <li key={f.id} className="flex justify-between gap-3 px-3 py-2"><span>{f.name}</span><span className="tabular-nums text-muted">{money(f.price, lead.currency)}</span></li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                  {(snapshot.integrations ?? []).length > 0 && (
                    <div>
                      <dt className="text-muted">Integrations</dt>
                      <dd>
                        <ul className="mt-1 divide-y divide-border rounded-lg border border-border">
                          {(snapshot.integrations ?? []).map((f) => (
                            <li key={f.id} className="flex justify-between gap-3 px-3 py-2"><span>{f.name}</span><span className="tabular-nums text-muted">{money(f.price, lead.currency)}</span></li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-muted">
                    <span>Complexity ×{snapshot.complexity?.multiplier}</span>
                    <span>Scale ×{snapshot.scale?.multiplier}</span>
                    <span>Urgency ×{snapshot.urgency?.multiplier}</span>
                  </div>
                </dl>
              )}
              <p className="mt-4 text-xs text-muted">Prices are a snapshot from the moment of calculation and do not change when pricing is edited.</p>
            </Section>
          )}

          <Section title="Notes">
            <form
              onSubmit={async (event) => {
                event.preventDefault();
                const formElement = event.currentTarget;
                const content = String(new FormData(formElement).get('content') ?? '').trim();
                if (!content) return;
                if (await run(() => apiRequest('POST', `/admin/leads/${lead.id}/notes`, { content }), 'Note added.')) formElement.reset();
              }}
              className="space-y-3"
            >
              <Field label="Add an internal note" hint="Only visible to admins.">{(props) => <Textarea {...props} name="content" rows={3} maxLength={4000} />}</Field>
              <Button type="submit" size="sm" loading={busy}>Add note</Button>
            </form>
            <ul className="mt-6 space-y-4">
              {lead.notes.length === 0 && <li className="text-sm text-muted">No notes yet.</li>}
              {lead.notes.map((note) => (
                <li key={note.id} className="rounded-xl border border-border p-4">
                  {editingNote === note.id ? (
                    <form
                      onSubmit={async (event) => {
                        event.preventDefault();
                        const content = String(new FormData(event.currentTarget).get('content') ?? '').trim();
                        if (content && (await run(() => apiRequest('PATCH', `/admin/leads/notes/${note.id}`, { content }), 'Note updated.'))) setEditingNote(null);
                      }}
                      className="space-y-3"
                    >
                      <Textarea name="content" aria-label="Edit note" defaultValue={note.content} rows={3} maxLength={4000} />
                      <div className="flex gap-2">
                        <Button type="submit" size="sm" loading={busy}>Save</Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingNote(null)}>Cancel</Button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <p className="whitespace-pre-line break-words">{note.content}</p>
                      <div className="mt-2 flex items-center justify-between gap-2 text-xs text-muted">
                        <span>{note.authorName} · {formatDateTime(note.createdAt)}</span>
                        {note.authorId === currentAdminId && (
                          <span className="flex">
                            <Button size="sm" variant="ghost" aria-label="Edit note" onClick={() => setEditingNote(note.id)}><Pencil className="size-3.5" /></Button>
                            <Button size="sm" variant="ghost" aria-label="Delete note" className="text-danger" onClick={() => setNoteToDelete(note.id)}><Trash2 className="size-3.5" /></Button>
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Activity">
            <form
              onSubmit={async (event) => {
                event.preventDefault();
                const formElement = event.currentTarget;
                const form = new FormData(formElement);
                const title = String(form.get('title') ?? '').trim();
                if (!title) return;
                if (await run(() => apiRequest('POST', `/admin/leads/${lead.id}/activities`, { type: form.get('type'), title, detail: String(form.get('detail') ?? '') }), 'Activity logged.')) formElement.reset();
              }}
              className="grid grid-cols-1 gap-3 sm:grid-cols-[10rem_1fr]"
            >
              <Select name="type" aria-label="Activity type" defaultValue="CALL">
                {ACTIVITY_TYPES.map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </Select>
              <Input name="title" aria-label="Activity title" placeholder="What happened? e.g. Intro call, 20 min" maxLength={120} />
              <Textarea name="detail" aria-label="Details" rows={2} placeholder="Details (optional)" className="min-h-16 sm:col-span-2" maxLength={2000} />
              <div className="sm:col-span-2"><Button type="submit" size="sm" variant="secondary" loading={busy}>Log activity</Button></div>
            </form>
            <ol className="mt-6 space-y-4 border-l border-border pl-5">
              {lead.activities.map((a) => (
                <li key={a.id} className="relative">
                  <span aria-hidden className="absolute -left-[1.55rem] top-1.5 size-2.5 rounded-full bg-primary" />
                  <p className="font-medium">{a.title}</p>
                  {a.detail && <p className="text-sm text-muted">{a.detail}</p>}
                  <p className="text-xs text-muted">{formatDateTime(a.createdAt)}{a.authorName ? ` · ${a.authorName}` : ''}</p>
                </li>
              ))}
            </ol>
          </Section>
        </div>

        <aside className="min-w-0 space-y-6 lg:sticky lg:top-24 lg:self-start">
          <Section title="Sales status">
            <div className="space-y-5">
              <Field label="Stage">
                {(props) => (
                  <Select
                    {...props}
                    value={lead.status}
                    disabled={busy}
                    onChange={(e) => {
                      const next = e.target.value as LeadStatus;
                      if (next === 'WON' || next === 'LOST') setPendingStatus(next);
                      else void changeStatus(next);
                    }}
                  >
                    {LEAD_STATUSES.map((s) => (
                      <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                    ))}
                  </Select>
                )}
              </Field>
              <Field label="Priority">
                {(props) => (
                  <Select {...props} value={priority} disabled={busy} onChange={(e) => { const next = e.target.value as LeadPriority; setPriority(next); void patch({ priority: next }, 'Priority updated.'); }}>
                    {LEAD_PRIORITIES.map((p) => (
                      <option key={p} value={p}>{p.charAt(0) + p.slice(1).toLowerCase()}</option>
                    ))}
                  </Select>
                )}
              </Field>
              <div className="space-y-3">
                <Field label="Follow-up date">{(props) => <Input {...props} type="date" value={followUp} onChange={(e) => setFollowUp(e.target.value)} />}</Field>
                <Field label="Follow-up note">{(props) => <Input {...props} value={followUpNote} maxLength={300} onChange={(e) => setFollowUpNote(e.target.value)} />}</Field>
                <Button size="sm" variant="secondary" loading={busy} onClick={() => patch({ followUpAt: followUp, followUpNote }, followUp ? 'Follow-up scheduled.' : 'Follow-up cleared.')}>Save follow-up</Button>
              </div>
              <div className="space-y-3 border-t border-border pt-5">
                <p className="text-sm text-muted">Estimated: <span className="font-medium text-foreground">{estimateText(lead)}</span></p>
                <div className="grid grid-cols-[1fr_6rem] gap-2">
                  <Field label="Final agreed value">{(props) => <Input {...props} inputMode="numeric" value={finalValue} onChange={(e) => setFinalValue(e.target.value.replace(/[^\d]/g, ''))} />}</Field>
                  <Field label="Currency">
                    {(props) => (
                      <Select {...props} value={finalCurrency} onChange={(e) => setFinalCurrency(e.target.value as 'BDT' | 'USD')}>
                        <option value="BDT">BDT</option>
                        <option value="USD">USD</option>
                      </Select>
                    )}
                  </Field>
                </div>
                <Button size="sm" variant="secondary" loading={busy} onClick={() => patch({ finalProjectValue: finalValue === '' ? null : Number(finalValue), finalCurrency: finalValue === '' ? null : finalCurrency }, 'Final value saved.')}>Save value</Button>
              </div>
              {lead.status === 'WON' && <p className="rounded-lg bg-accent-soft px-3 py-2 text-sm text-accent">Won on {formatDate(lead.wonAt)}{lead.finalProjectValue !== null ? ` · ${money(lead.finalProjectValue, lead.finalCurrency)}` : ''}</p>}
              {lead.status === 'LOST' && <p className="rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">Lost on {formatDate(lead.lostAt)} · {LOST_REASONS.find(([v]) => v === lead.lostReason)?.[1] ?? lead.lostReason}</p>}
            </div>
          </Section>
          <Section title="Internal summary">
            <Textarea aria-label="Internal summary" rows={4} value={summary} maxLength={2000} onChange={(e) => setSummary(e.target.value)} />
            <Button className="mt-3" size="sm" variant="secondary" loading={busy} onClick={() => patch({ internalSummary: summary }, 'Summary saved.')}>Save summary</Button>
          </Section>
        </aside>
      </div>

      <OutcomeDialog
        status={pendingStatus}
        defaultCurrency={lead.finalCurrency ?? lead.currency ?? 'USD'}
        defaultValue={lead.finalProjectValue}
        busy={busy}
        onCancel={() => setPendingStatus(null)}
        onSubmit={async (extra) => {
          if (pendingStatus && (await changeStatus(pendingStatus, extra))) setPendingStatus(null);
        }}
      />
      <ConfirmDialog open={noteToDelete !== null} title="Delete this note?" description="This note will be permanently removed." busy={busy} onConfirm={async () => { if (noteToDelete) await run(() => apiRequest('DELETE', `/admin/leads/notes/${noteToDelete}`), 'Note deleted.'); setNoteToDelete(null); }} onCancel={() => setNoteToDelete(null)} />
    </div>
  );
}

function OutcomeDialog({ status, defaultCurrency, defaultValue, busy, onCancel, onSubmit }: { status: 'WON' | 'LOST' | null; defaultCurrency: 'BDT' | 'USD'; defaultValue: number | null; busy: boolean; onCancel: () => void; onSubmit: (extra: Record<string, unknown>) => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const open = status !== null;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (open && !element.open) element.showModal();
    if (!open && element.open) element.close();
  }, [open]);

  return (
    <dialog ref={ref} onCancel={(e) => { e.preventDefault(); onCancel(); }} className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-border bg-background p-0 text-foreground shadow-2xl backdrop:bg-foreground/40">
      {status && (
        <form
          key={status}
          onSubmit={(event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            const note = String(form.get('note') ?? '').trim() || undefined;
            if (status === 'WON') {
              const value = String(form.get('value') ?? '');
              onSubmit({ note, ...(value ? { finalProjectValue: Number(value), finalCurrency: form.get('currency') } : {}) });
            } else {
              onSubmit({ note, lostReason: form.get('reason') });
            }
          }}
          className="space-y-4 p-6"
        >
          <h2 className="text-lg font-semibold">{status === 'WON' ? 'Mark as won' : 'Mark as lost'}</h2>
          {status === 'WON' ? (
            <div className="grid grid-cols-[1fr_6rem] gap-2">
              <Field label="Final agreed value">{(props) => <Input {...props} name="value" inputMode="numeric" pattern="[0-9]*" defaultValue={defaultValue ?? ''} />}</Field>
              <Field label="Currency">
                {(props) => (
                  <Select {...props} name="currency" defaultValue={defaultCurrency}>
                    <option value="BDT">BDT</option>
                    <option value="USD">USD</option>
                  </Select>
                )}
              </Field>
            </div>
          ) : (
            <Field label="Reason">
              {(props) => (
                <Select {...props} name="reason" required defaultValue="">
                  <option value="" disabled>Select a reason…</option>
                  {LOST_REASONS.map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </Select>
              )}
            </Field>
          )}
          <Field label="Note (optional)">{(props) => <Textarea {...props} name="note" rows={3} maxLength={2000} />}</Field>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={onCancel} disabled={busy}>Cancel</Button>
            <Button type="submit" variant={status === 'LOST' ? 'danger' : 'primary'} loading={busy}>{status === 'WON' ? 'Mark won' : 'Mark lost'}</Button>
          </div>
        </form>
      )}
    </dialog>
  );
}
