'use client';

import { CalendarCheck, Check, Clock, FilePlus2, Landmark, Plus, Receipt, Timer, Wallet, X } from 'lucide-react';
import { useId, useState } from 'react';
import { BarChart } from '@/components/demos/shared/charts';
import { DashboardCard, Panel } from '@/components/demos/shared/dashboard-card';
import { Avatar, PageHeading, Pill, SelectMenu, Tabs } from '@/components/demos/shared/app-ui';
import { APPOINTMENTS, INITIAL_TEETH, INVOICES, PATIENTS, PRESCRIPTIONS, REVENUE_MONTHS, TOOTH_STATES, TREATMENTS } from '@/data/clinic/app';
import type { AppointmentStatus, Invoice, InvoiceStatus, Prescription, ToothState } from '@/data/clinic/app';
import { cn } from '@/lib/cn';
import { AppointmentCard, tone } from './clinic-cards';
import { ToothChart, ToothLegend } from './tooth-chart';

const money = (value: number) => `$${value.toLocaleString('en-US')}`;
const PATIENT_NAMES = PATIENTS.map((p) => p.name);

/* ---------------------------------- Medical records ---------------------------------- */

export function ClinicRecordsView() {
  const [patient, setPatient] = useState(PATIENT_NAMES[1]);
  const [teeth, setTeeth] = useState<Record<number, ToothState>>(INITIAL_TEETH);
  const [tooth, setTooth] = useState<number | null>(36);
  const [tab, setTab] = useState<'treatments' | 'history'>('treatments');
  const record = PATIENTS.find((p) => p.name === patient) ?? PATIENTS[0];
  const state = tooth ? (teeth[tooth] ?? 'healthy') : null;
  const treatments = tooth ? TREATMENTS.filter((t) => t.tooth === String(tooth)) : TREATMENTS;

  return (
    <>
      <PageHeading title="Medical records" description="Dental chart, treatments and clinical history.">
        <SelectMenu label="Patient" value={patient} options={PATIENT_NAMES} onChange={setPatient} className="w-52" align="right" />
      </PageHeading>
      <div className="grid gap-3 xl:grid-cols-[1.15fr_1fr]">
        <Panel index={0} title="Dental chart" action={<span className="text-xs text-slate-500">Select a tooth</span>}>
          <div className="mx-auto max-w-lg">
            <ToothChart teeth={teeth} selected={tooth} onSelect={(n) => setTooth((current) => (current === n ? null : n))} showNumbers />
          </div>
          <div className="mt-2">
            <ToothLegend />
          </div>
          <div className="mt-4 rounded-xl bg-slate-50 p-3">
            {tooth ? (
              <>
                <p className="text-sm font-semibold text-slate-900">
                  Tooth {tooth} <span className="font-normal text-slate-500">· {TOOTH_STATES.find((s) => s.id === state)?.label}</span>
                </p>
                <div role="group" aria-label={`Set status of tooth ${tooth}`} className="mt-2.5 flex flex-wrap gap-1.5">
                  {TOOTH_STATES.map((s) => (
                    <button key={s.id} type="button" aria-pressed={state === s.id} onClick={() => setTeeth((current) => ({ ...current, [tooth]: s.id }))} className={cn('rounded-full px-2.5 py-1 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]', state === s.id ? 'bg-[var(--demo-accent)] text-white' : 'bg-white text-slate-700 ring-1 ring-inset ring-slate-200 hover:ring-slate-300')}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-sm text-slate-500">Select a tooth to see and update its status.</p>
            )}
          </div>
        </Panel>

        <Panel index={1}>
          <Tabs label="Record sections" value={tab} onChange={setTab} tabs={[{ id: 'treatments', label: 'Treatment history' }, { id: 'history', label: 'Medical history' }]} />
          <div key={`${tab}-${tooth}-${patient}`} className="demo-rise mt-4">
            {tab === 'treatments' ? (
              treatments.length ? (
                <ol className="space-y-4 border-l border-slate-200 pl-4">
                  {treatments.map((t) => (
                    <li key={t.date + t.procedure} className="relative">
                      <span aria-hidden className="absolute -left-[1.4rem] top-1.5 size-2.5 rounded-full bg-[var(--demo-good)] ring-4 ring-white" />
                      <p className="text-xs text-slate-500">
                        {t.date} · Tooth {t.tooth}
                      </p>
                      <p className="text-sm font-semibold text-slate-900">{t.procedure}</p>
                      <p className="text-xs text-slate-600">
                        {t.doctor} · {money(t.cost)}
                      </p>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="py-6 text-center text-sm text-slate-500">No treatments recorded for tooth {tooth}.</p>
              )
            ) : (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-1.5">
                  {record.allergies.map((a) => (
                    <Pill key={a} tone="red">
                      Allergy: {a}
                    </Pill>
                  ))}
                  {record.conditions.map((c) => (
                    <Pill key={c} tone="amber">
                      {c}
                    </Pill>
                  ))}
                  {!record.allergies.length && !record.conditions.length && <span className="text-sm text-slate-500">No allergies or conditions recorded.</span>}
                </div>
                <ol className="space-y-4 border-l border-slate-200 pl-4">
                  {record.history.map((h) => (
                    <li key={h.date + h.title} className="relative">
                      <span aria-hidden className="absolute -left-[1.4rem] top-1.5 size-2.5 rounded-full bg-[var(--demo-accent)] ring-4 ring-white" />
                      <p className="text-xs text-slate-500">{h.date}</p>
                      <p className="text-sm font-semibold text-slate-900">{h.title}</p>
                      <p className="text-sm text-slate-600">{h.note}</p>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </Panel>
      </div>
    </>
  );
}

/* ---------------------------------- Prescriptions ---------------------------------- */

const DRUGS = ['Amoxicillin 500 mg', 'Paracetamol 500 mg', 'Ibuprofen 400 mg', 'Chlorhexidine mouthwash', 'Fluoride gel 1.1%'] as const;

export function ClinicPrescriptionsView({ doctor = 'Dr. Amara Okoye' }: { doctor?: string }) {
  const [items, setItems] = useState<Prescription[]>(PRESCRIPTIONS);
  const [tab, setTab] = useState<'Active' | 'Completed' | 'All'>('Active');
  const [open, setOpen] = useState(false);
  const [patient, setPatient] = useState(PATIENT_NAMES[0]);
  const [drug, setDrug] = useState<(typeof DRUGS)[number]>(DRUGS[0]);
  const [dose, setDose] = useState('1 tablet, twice daily');
  const id = useId();
  const list = items.filter((p) => tab === 'All' || p.status === tab);

  function add() {
    setItems((current) => [{ id: `rx-${current.length + 1}`, patient, drug, dose, duration: '7 days', doctor, date: '05 Oct', status: 'Active' }, ...current]);
    setTab('Active');
    setOpen(false);
  }

  return (
    <>
      <PageHeading title="Prescriptions" description="Digital prescriptions with allergy checks.">
        <button type="button" aria-expanded={open} onClick={() => setOpen((v) => !v)} className="inline-flex h-9 items-center gap-2 rounded-lg bg-[var(--demo-accent)] px-3.5 text-sm font-semibold text-white hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]">
          {open ? <X className="size-4" aria-hidden /> : <Plus className="size-4" aria-hidden />} {open ? 'Cancel' : 'New prescription'}
        </button>
      </PageHeading>

      {open && (
        <Panel title="New prescription" className="mb-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <span className="mb-1.5 block text-xs font-medium text-slate-500">Patient</span>
              <SelectMenu label="Patient" value={patient} options={PATIENT_NAMES} onChange={setPatient} />
            </div>
            <div>
              <span className="mb-1.5 block text-xs font-medium text-slate-500">Medication</span>
              <SelectMenu label="Medication" value={drug} options={DRUGS} onChange={setDrug} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor={`${id}-dose`} className="mb-1.5 block text-xs font-medium text-slate-500">
                Dose and frequency
              </label>
              <input id={`${id}-dose`} value={dose} onChange={(event) => setDose(event.target.value)} className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-900 focus:border-[color:var(--demo-accent)] focus:outline-2 focus:outline-[color:var(--demo-accent)]" />
            </div>
          </div>
          {PATIENTS.find((p) => p.name === patient)?.allergies.length ? (
            <p role="status" className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900">
              Allergy check: {patient} is allergic to {PATIENTS.find((p) => p.name === patient)?.allergies.join(', ')}.
            </p>
          ) : (
            <p role="status" className="mt-3 rounded-lg bg-[var(--demo-good-soft)] px-3 py-2 text-xs text-[color:var(--demo-good-ink)]">
              Allergy check: no known allergies for {patient}.
            </p>
          )}
          <div className="mt-4 flex justify-end">
            <button type="button" onClick={add} className="h-9 rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]">
              Issue prescription
            </button>
          </div>
        </Panel>
      )}

      <Tabs label="Prescription status" value={tab} onChange={setTab} tabs={(['Active', 'Completed', 'All'] as const).map((t) => ({ id: t, label: t, count: items.filter((p) => t === 'All' || p.status === t).length }))} />
      <ul key={tab} className="mt-3 grid gap-3 md:grid-cols-2">
        {list.map((p, i) => (
          <li key={p.id} className="demo-rise rounded-xl border border-slate-200 bg-white p-4" style={{ ['--i' as string]: i }}>
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[var(--demo-accent-soft)] text-[color:var(--demo-accent)]">
                <FilePlus2 className="size-5" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900">{p.drug}</p>
                <p className="text-xs text-slate-600">{p.dose}</p>
              </div>
              <Pill tone={tone(p.status)}>{p.status}</Pill>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
              <span className="inline-flex items-center gap-2">
                <Avatar name={p.patient} size="sm" /> {p.patient}
              </span>
              <span>
                {p.duration} · {p.date}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

/* ---------------------------------- Billing ---------------------------------- */

export function ClinicBillingView() {
  const [tab, setTab] = useState<'All' | InvoiceStatus>('All');
  const [paid, setPaid] = useState<Record<string, boolean>>({});
  const invoices: Invoice[] = INVOICES.map((i) => (paid[i.id] ? { ...i, status: 'Paid' } : i));
  const sum = (status: InvoiceStatus) => invoices.filter((i) => i.status === status).reduce((total, i) => total + i.amount, 0);
  const list = invoices.filter((i) => tab === 'All' || i.status === tab);

  return (
    <>
      <PageHeading title="Billing" description="Invoices, insurance claims and payment status." />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <DashboardCard index={0} label="Collected" value={money(sum('Paid'))} delta={{ value: 'This week', up: true }} icon={Wallet} tone="emerald" />
        <DashboardCard index={1} label="Pending" value={money(sum('Pending'))} icon={Clock} />
        <DashboardCard index={2} label="Overdue" value={money(sum('Overdue'))} delta={{ value: 'Send reminders', up: false }} icon={Receipt} tone="amber" />
      </div>
      <div className="mt-3 grid gap-3 xl:grid-cols-[1fr_1.7fr]">
        <Panel index={3} title="Revenue (USD, thousands)" className="self-start">
          <BarChart data={REVENUE_MONTHS} label="Revenue by month" highlight={5} className="h-36" />
        </Panel>
        <Panel index={4} title="Invoices">
          <Tabs label="Invoice status" value={tab} onChange={setTab} tabs={(['All', 'Paid', 'Pending', 'Overdue'] as const).map((t) => ({ id: t, label: t }))} />
          <ul key={tab} className="mt-3 grid gap-2.5 md:grid-cols-2">
            {list.map((inv, i) => (
              <li key={inv.id} className="demo-rise rounded-xl border border-slate-200 p-3.5 transition-shadow hover:shadow-md" style={{ ['--i' as string]: i }}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-500">{inv.id}</p>
                    <p className="truncate text-sm font-semibold text-slate-900">{inv.patient}</p>
                  </div>
                  <Pill tone={tone(inv.status)}>{inv.status}</Pill>
                </div>
                <p className="mt-1 truncate text-xs text-slate-600">
                  {inv.service} · {inv.date}
                </p>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <p className="text-lg font-semibold tabular-nums text-slate-900">{money(inv.amount)}</p>
                  {inv.status === 'Paid' ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-[color:var(--demo-good-ink)]">
                      <Check className="size-3.5" aria-hidden /> {inv.insurance ?? 'Paid'}
                    </span>
                  ) : (
                    <button type="button" onClick={() => setPaid((current) => ({ ...current, [inv.id]: true }))} className="rounded-md bg-slate-900 px-2.5 py-1 text-xs font-semibold text-white hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]">
                      Mark as paid
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}

/* ---------------------------------- Reports & settings ---------------------------------- */

const REPORTS = ['Patient growth', 'Revenue summary', 'Appointment utilisation', 'Treatment mix', 'Insurance claims', 'Outstanding balances'];

export function ClinicReportsView() {
  const [ready, setReady] = useState<Record<string, boolean>>({});
  return (
    <>
      <PageHeading title="Reports" description="Generate printable reports for the owner and the accountant." />
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {REPORTS.map((name, i) => (
          <li key={name} className="demo-rise flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4" style={{ ['--i' as string]: i }}>
            <div>
              <p className="text-sm font-semibold text-slate-900">{name}</p>
              <p className="text-xs text-slate-500">PDF · October 2026</p>
            </div>
            <button type="button" onClick={() => setReady((current) => ({ ...current, [name]: true }))} className={cn('inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]', ready[name] ? 'bg-[var(--demo-good-soft)] text-[color:var(--demo-good-ink)]' : 'bg-slate-900 text-white hover:bg-slate-700')}>
              {ready[name] ? (
                <>
                  <Check className="size-3.5" aria-hidden /> Ready
                </>
              ) : (
                'Generate'
              )}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

function Switch({ label, description, defaultOn = false }: { label: string; description: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <li className="flex items-center justify-between gap-4 py-3.5">
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-900">{label}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
      <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={() => setOn((v) => !v)} className={cn('relative h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]', on ? 'bg-[var(--demo-accent)]' : 'bg-slate-300')}>
        <span aria-hidden className={cn('absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow transition-transform duration-200', on && 'translate-x-5')} />
      </button>
    </li>
  );
}

const HOURS_OPTIONS = ['08:00 – 17:00', '09:00 – 18:00', '09:00 – 20:00 (late opening)'] as const;

export function ClinicSettingsView() {
  const [hours, setHours] = useState<(typeof HOURS_OPTIONS)[number]>(HOURS_OPTIONS[1]);
  return (
    <>
      <PageHeading title="Settings" description="Clinic profile, booking and notifications." />
      <div className="grid gap-3 lg:grid-cols-2">
        <Panel title="Clinic profile" index={0}>
          <dl className="space-y-3 text-sm">
            {[
              ['Clinic name', 'Brightsmile Dental'],
              ['Address', '24 Harbour Road, Riverside'],
              ['Phone', '+1 555 0100'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                <dt className="text-slate-500">{k}</dt>
                <dd className="text-right font-medium text-slate-900">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-4">
            <span className="mb-1.5 block text-xs font-medium text-slate-500">Opening hours</span>
            <SelectMenu label="Opening hours" value={hours} options={HOURS_OPTIONS} onChange={setHours} />
          </div>
        </Panel>
        <Panel title="Preferences" index={1}>
          <ul className="divide-y divide-slate-100">
            <Switch label="Online booking" description="Let patients book from the website and app." defaultOn />
            <Switch label="SMS reminders" description="Remind patients 24 hours before a visit." defaultOn />
            <Switch label="Email receipts" description="Send an invoice after every payment." />
            <Switch label="Two-factor sign-in" description="Require a code for staff accounts." defaultOn />
          </ul>
        </Panel>
      </div>
    </>
  );
}

/* ---------------------------------- Doctor's day ---------------------------------- */

const NEXT: Partial<Record<AppointmentStatus, { to: AppointmentStatus; label: string }>> = {
  Pending: { to: 'Confirmed', label: 'Confirm' },
  Confirmed: { to: 'Checked in', label: 'Check in' },
  'Checked in': { to: 'In progress', label: 'Start' },
  'In progress': { to: 'Completed', label: 'Complete' },
};

export function ClinicDoctorDay() {
  const mine = APPOINTMENTS.filter((a) => a.doctor === 'Dr. Amara Okoye');
  const [status, setStatus] = useState<Record<string, AppointmentStatus>>({});
  const [notes, setNotes] = useState<{ id: number; text: string }[]>([{ id: 1, text: 'Marcus Reed: temporary crown holding well. Final fit booked for 14 Oct.' }]);
  const [draft, setDraft] = useState('');
  const id = useId();
  const queue = mine.map((a) => ({ ...a, status: status[a.id] ?? a.status }));
  const done = queue.filter((a) => a.status === 'Completed').length;
  const waiting = queue.filter((a) => a.status === 'Checked in').length;

  return (
    <>
      <PageHeading title="My day" description="Good morning, Dr. Okoye. Here is your schedule for today." />
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <DashboardCard index={0} label="Patients today" value={String(queue.length)} icon={CalendarCheck} />
        <DashboardCard index={1} label="Completed" value={String(done)} icon={Check} tone="emerald" />
        <DashboardCard index={2} label="Waiting" value={String(waiting)} icon={Clock} tone="amber" />
        <DashboardCard index={3} label="Avg. wait" value="6 min" icon={Timer} tone="slate" />
      </div>
      <div className="mt-3 grid gap-3 lg:grid-cols-[1.3fr_1fr]">
        <Panel title="Today's patients" index={4}>
          <ul className="space-y-2.5">
            {queue.map((a, i) => (
              <li key={a.id}>
                <AppointmentCard appointment={a} index={i} action={NEXT[a.status] ? { label: NEXT[a.status]!.label, onClick: () => setStatus((c) => ({ ...c, [a.id]: NEXT[a.status]!.to })) } : undefined} />
              </li>
            ))}
          </ul>
        </Panel>
        <div className="space-y-3">
          <Panel title="Clinical notes" index={5}>
            <label htmlFor={`${id}-note`} className="sr-only">
              Add a note
            </label>
            <textarea id={`${id}-note`} rows={3} value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Add a note for the patient file…" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[color:var(--demo-accent)] focus:outline-2 focus:outline-[color:var(--demo-accent)]" />
            <div className="mt-2 flex justify-end">
              <button
                type="button"
                disabled={!draft.trim()}
                onClick={() => {
                  setNotes((c) => [{ id: c.length + 1, text: draft.trim() }, ...c]);
                  setDraft('');
                }}
                className="h-8 rounded-lg bg-slate-900 px-3 text-xs font-semibold text-white hover:bg-slate-700 disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]"
              >
                Save note
              </button>
            </div>
            <ul className="mt-3 space-y-2">
              {notes.map((n) => (
                <li key={n.id} className="demo-rise rounded-lg border-l-2 border-[color:var(--demo-accent)] bg-slate-50 px-3 py-2 text-sm text-slate-700">
                  {n.text}
                </li>
              ))}
            </ul>
          </Panel>
          <Panel title="Recent prescriptions" index={6} action={<Landmark className="size-4 text-slate-400" aria-hidden />}>
            <ul className="divide-y divide-slate-100">
              {PRESCRIPTIONS.filter((p) => p.doctor === 'Dr. Amara Okoye')
                .slice(0, 3)
                .map((p) => (
                  <li key={p.id} className="py-2.5">
                    <p className="text-sm font-medium text-slate-900">{p.drug}</p>
                    <p className="text-xs text-slate-500">
                      {p.patient} · {p.dose}
                    </p>
                  </li>
                ))}
            </ul>
          </Panel>
        </div>
      </div>
    </>
  );
}
