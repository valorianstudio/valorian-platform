'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { FormAlert } from '@/components/admin/form-alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Field, Input, Select, Textarea } from '@/components/ui/field';
import { useToast } from '@/components/ui/toast';
import { ApiError, apiRequest } from '@/lib/client-api';
import { PROJECT_STATUSES, dateInput, label } from '@/lib/portal';
import type { ProjectStatus } from '@/lib/portal';

export interface ProjectFormValues {
  id?: string;
  name: string;
  description: string | null;
  organizationId: string;
  status: ProjectStatus;
  startDate: string | null;
  estimatedEndDate: string | null;
  actualEndDate: string | null;
  progressPercentage: number;
  technologies: string[];
  finalValue: number | null;
  finalCurrency: 'BDT' | 'USD' | null;
  internalNotes: string | null;
  leadId?: string | null;
}

export interface LeadOption {
  id: string;
  referenceCode: string;
  name: string;
  companyName: string | null;
  projectType: string | null;
  finalProjectValue: number | null;
  finalCurrency: 'BDT' | 'USD' | null;
}

interface Props {
  initial?: ProjectFormValues;
  clients: { id: string; companyName: string }[];
  leads?: LeadOption[];
  presetClient?: string;
  presetLead?: string;
  canManage: boolean;
}

export function ProjectForm({ initial, clients, leads = [], presetClient, presetLead, canManage }: Props) {
  const router = useRouter();
  const toast = useToast();
  const editing = Boolean(initial?.id);
  const lead = leads.find((l) => l.id === presetLead);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [leadId, setLeadId] = useState(initial?.leadId ?? presetLead ?? '');
  const selectedLead = leads.find((l) => l.id === leadId);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || !canManage) return;
    const f = new FormData(event.currentTarget);
    const text = (key: string) => String(f.get(key) ?? '').trim();
    const value = text('finalValue');
    const body = {
      name: text('name'),
      description: text('description'),
      status: text('status'),
      progressPercentage: Number(text('progressPercentage') || 0),
      startDate: text('startDate'),
      estimatedEndDate: text('estimatedEndDate'),
      ...(editing ? { actualEndDate: text('actualEndDate') } : {}),
      technologies: text('technologies').split(',').map((t) => t.trim()).filter(Boolean),
      finalValue: value === '' ? null : Number(value),
      finalCurrency: value === '' ? null : text('finalCurrency') || 'USD',
      internalNotes: text('internalNotes'),
      ...(editing ? {} : { organizationId: text('organizationId'), leadId: leadId || null }),
    };
    setBusy(true);
    setError(null);
    try {
      if (editing) {
        await apiRequest('PATCH', `/admin/projects/${initial?.id}`, body);
        toast.success('Project saved.');
        router.refresh();
      } else {
        const created = await apiRequest<{ id: string }>('POST', '/admin/projects', body);
        router.push(`/admin/projects/${created.id}`);
      }
    } catch (e) {
      setError(e instanceof ApiError ? e : null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="p-5 sm:p-6">
      <form onSubmit={onSubmit} className="space-y-5">
        <FormAlert error={error} />
        <fieldset disabled={!canManage || busy} className="space-y-5">
          {!editing && leads.length > 0 && (
            <Field label="Originating lead" hint="Links the project to a won lead and copies its estimate and final value. The lead itself is not changed.">
              {(props) => (
                <Select {...props} value={leadId} onChange={(e) => setLeadId(e.target.value)}>
                  <option value="">No lead</option>
                  {leads.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.referenceCode} · {l.companyName ?? l.name}
                    </option>
                  ))}
                </Select>
              )}
            </Field>
          )}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Project name" className="sm:col-span-2">
              {(props) => <Input {...props} name="name" key={selectedLead?.id ?? 'none'} defaultValue={initial?.name ?? (selectedLead ? `${selectedLead.companyName ?? selectedLead.name}${selectedLead.projectType ? ` ${selectedLead.projectType}` : ''}` : lead ? '' : '')} required maxLength={120} />}
            </Field>
            <Field label="Client">
              {(props) => (
                <Select {...props} name="organizationId" defaultValue={initial?.organizationId ?? presetClient ?? ''} disabled={editing || !canManage} required>
                  <option value="">Select a client…</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.companyName}
                    </option>
                  ))}
                </Select>
              )}
            </Field>
            <Field label="Status">
              {(props) => (
                <Select {...props} name="status" defaultValue={initial?.status ?? 'DISCOVERY'}>
                  {PROJECT_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {label(s)}
                    </option>
                  ))}
                </Select>
              )}
            </Field>
            <Field label="Progress (%)">{(props) => <Input {...props} name="progressPercentage" type="number" min={0} max={100} defaultValue={initial?.progressPercentage ?? 0} required />}</Field>
            <Field label="Start date">{(props) => <Input {...props} name="startDate" type="date" defaultValue={dateInput(initial?.startDate)} />}</Field>
            <Field label="Estimated finish">{(props) => <Input {...props} name="estimatedEndDate" type="date" defaultValue={dateInput(initial?.estimatedEndDate)} />}</Field>
            {editing && <Field label="Actual finish">{(props) => <Input {...props} name="actualEndDate" type="date" defaultValue={dateInput(initial?.actualEndDate)} />}</Field>}
            <Field label="Technologies" hint="Comma separated, shown to the client." className="sm:col-span-2">
              {(props) => <Input {...props} name="technologies" defaultValue={initial?.technologies.join(', ') ?? ''} placeholder="Next.js, PostgreSQL, Stripe" />}
            </Field>
          </div>
          <Field label="Description" hint="Shown to the client.">{(props) => <Textarea {...props} name="description" defaultValue={initial?.description ?? ''} maxLength={4000} />}</Field>
          <div className="grid grid-cols-1 gap-5 rounded-xl border border-border p-4 sm:grid-cols-2">
            <p className="text-sm text-muted sm:col-span-2">Internal only. Never visible in the client portal.</p>
            <Field label="Final project value">{(props) => <Input {...props} name="finalValue" type="number" min={0} key={selectedLead?.id ?? 'none'} defaultValue={initial?.finalValue ?? selectedLead?.finalProjectValue ?? ''} />}</Field>
            <Field label="Currency">
              {(props) => (
                <Select {...props} name="finalCurrency" defaultValue={initial?.finalCurrency ?? selectedLead?.finalCurrency ?? 'USD'} key={selectedLead?.id ?? 'none'}>
                  <option value="USD">USD</option>
                  <option value="BDT">BDT</option>
                </Select>
              )}
            </Field>
            <Field label="Internal notes" className="sm:col-span-2">{(props) => <Textarea {...props} name="internalNotes" defaultValue={initial?.internalNotes ?? ''} maxLength={4000} />}</Field>
          </div>
        </fieldset>
        {canManage && (
          <Button type="submit" loading={busy}>
            {editing ? 'Save project' : 'Create project'}
          </Button>
        )}
      </form>
    </Card>
  );
}
