'use client';

import { BadgeCheck, Check, CircleDollarSign, DoorOpen, Megaphone, Percent } from 'lucide-react';
import { useState } from 'react';
import { AreaChart, Donut } from '@/components/demos/shared/charts';
import { DashboardCard, Panel } from '@/components/demos/shared/dashboard-card';
import { PageHeading, Pill, ProgressBar, SelectMenu, Tabs } from '@/components/demos/shared/app-ui';
import { ANNOUNCEMENTS, OCCUPANCY_MONTHS, PAYMENTS, STAFF_TASKS, UNIT_MIX, VISITORS } from '@/data/property/catalog';
import type { RentStatus, Visitor, VisitorStatus } from '@/data/property/catalog';
import { cn } from '@/lib/cn';
import { rentTone, visitorTone } from './property-cards';

/* ---------------------------------- Payments ---------------------------------- */

const PAY_TABS = ['All', 'Paid', 'Pending', 'Overdue'] as const;
type PayTab = (typeof PAY_TABS)[number];

export function PropertyPaymentsView() {
  const [tab, setTab] = useState<PayTab>('All');
  const [method, setMethod] = useState<'All methods' | 'Card' | 'Bank transfer' | 'Direct debit'>('All methods');
  const list = PAYMENTS.filter((p) => (tab === 'All' || p.status === (tab as RentStatus)) && (method === 'All methods' || p.method === method));
  const collected = PAYMENTS.filter((p) => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0);
  const outstanding = PAYMENTS.filter((p) => p.status !== 'Paid').reduce((sum, p) => sum + p.amount, 0);
  return (
    <>
      <PageHeading title="Payments" description="Rent collection, outstanding balances and the payment records for this month." />
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <DashboardCard index={0} label="Collected this month" value={`$${collected.toLocaleString('en-US')}`} delta={{ value: '96% of rent due', up: true }} icon={CircleDollarSign} />
        <DashboardCard index={1} label="Outstanding" value={`$${outstanding.toLocaleString('en-US')}`} delta={{ value: '2 tenants', up: false }} icon={Percent} tone="amber" />
        <DashboardCard index={2} label="Direct debit" value="58%" delta={{ value: 'of tenants', up: true }} icon={BadgeCheck} tone="emerald" />
        <DashboardCard index={3} label="On-time rate" value="91%" delta={{ value: '+3 pts', up: true }} icon={Check} tone="slate" />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div className="min-w-0 flex-1"><Tabs label="Payment status" value={tab} onChange={setTab} tabs={PAY_TABS.map((t) => ({ id: t, label: t, count: t === 'All' ? PAYMENTS.length : PAYMENTS.filter((p) => p.status === t).length }))} /></div>
        <SelectMenu label="Method" value={method} options={['All methods', 'Card', 'Bank transfer', 'Direct debit'] as const} onChange={setMethod} className="w-44" align="right" />
      </div>
      <Panel index={4} className="mt-4">
        <ul className="divide-y divide-slate-100">
          {list.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-3 first:pt-0 last:pb-0">
              <span className="grid size-9 place-items-center rounded-lg bg-[var(--demo-accent-soft)] text-[color:var(--demo-accent)]"><CircleDollarSign className="size-4" aria-hidden /></span>
              <div className="min-w-0 flex-1"><p className="text-sm font-medium text-slate-900">{p.tenant}</p><p className="text-xs text-slate-500">Unit {p.unit} · {p.method}</p></div>
              <p className="text-xs text-slate-600">{p.date}</p>
              <p className="text-sm font-semibold tabular-nums text-slate-900">${p.amount.toLocaleString('en-US')}</p>
              <Pill tone={rentTone(p.status)}>{p.status}</Pill>
            </li>
          ))}
        </ul>
        {list.length === 0 && <p className="py-8 text-center text-sm text-slate-500">No payments match these filters.</p>}
      </Panel>
    </>
  );
}

/* ---------------------------------- Visitors ---------------------------------- */

const VISIT_TABS = ['All', 'Expected', 'Checked in', 'Left'] as const;
type VisitTab = (typeof VISIT_TABS)[number];
const NEXT_VISIT: Record<VisitorStatus, VisitorStatus | null> = { Expected: 'Checked in', 'Checked in': 'Left', Left: null };

export function PropertyVisitorsView() {
  const [tab, setTab] = useState<VisitTab>('All');
  const [status, setStatus] = useState<Record<string, VisitorStatus>>({});
  const rows: Visitor[] = VISITORS.map((v) => ({ ...v, status: status[v.id] ?? v.status }));
  const list = rows.filter((v) => tab === 'All' || v.status === (tab as VisitorStatus));
  return (
    <>
      <PageHeading title="Visitors" description="Pre-approved guests, check-ins and departures across every building.">
        <span className="inline-flex items-center gap-2 rounded-full bg-[var(--demo-accent-soft)] px-3 py-1.5 text-xs font-semibold text-[color:var(--demo-accent-ink)]"><DoorOpen className="size-3.5" aria-hidden /> Lobby desk open</span>
      </PageHeading>
      <div className="mb-4"><Tabs label="Visitor status" value={tab} onChange={setTab} tabs={VISIT_TABS.map((t) => ({ id: t, label: t, count: t === 'All' ? rows.length : rows.filter((v) => v.status === t).length }))} /></div>
      <div className="space-y-3">
        {list.map((v, i) => {
          const to = NEXT_VISIT[v.status];
          return (
            <article key={v.id} className="demo-rise flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center" style={{ ['--i' as string]: i }}>
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[var(--demo-accent-soft)] text-[color:var(--demo-accent)]"><DoorOpen className="size-4" aria-hidden /></span>
              <div className="min-w-0 flex-1"><p className="text-sm font-semibold text-slate-900">{v.name}</p><p className="text-xs text-slate-500">{v.purpose} for {v.host} · Unit {v.unit} · {v.time}</p></div>
              <div className="flex flex-wrap items-center gap-2">
                <Pill tone={visitorTone(v.status)}>{v.status}</Pill>
                {to && <button type="button" onClick={() => setStatus((s) => ({ ...s, [v.id]: to }))} className="h-8 rounded-lg border border-slate-300 px-3 text-xs font-semibold text-slate-700 hover:border-[color:var(--demo-accent)] hover:text-[color:var(--demo-accent)] focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]">{to === 'Checked in' ? 'Check in' : 'Mark left'}</button>}
              </div>
            </article>
          );
        })}
        {list.length === 0 && <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">No visitors in this status.</p>}
      </div>
    </>
  );
}

/* ---------------------------------- Staff ---------------------------------- */

export function PropertyStaffView() {
  const [done, setDone] = useState<Record<string, boolean>>(Object.fromEntries(STAFF_TASKS.map((t) => [t.id, t.done])));
  const finished = Object.values(done).filter(Boolean).length;
  return (
    <>
      <PageHeading title="Staff" description="Building operations: the task list for each site, and announcements for residents." />
      <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
        <Panel index={0} title={`Tasks, ${finished} of ${STAFF_TASKS.length} done`}>
          <ProgressBar value={Math.round((finished / STAFF_TASKS.length) * 100)} tone="emerald" />
          <ul className="mt-4 divide-y divide-slate-100">
            {STAFF_TASKS.map((t) => (
              <li key={t.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <button type="button" role="checkbox" aria-checked={!!done[t.id]} aria-label={`Mark "${t.task}" as done`} onClick={() => setDone((d) => ({ ...d, [t.id]: !d[t.id] }))} className={cn('grid size-6 shrink-0 place-items-center rounded-md border transition-colors focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]', done[t.id] ? 'border-[var(--demo-good)] bg-[var(--demo-good)] text-white' : 'border-slate-300 bg-white')}>{done[t.id] && <Check className="size-3.5" aria-hidden />}</button>
                <div className="min-w-0 flex-1"><p className={cn('text-sm font-medium', done[t.id] ? 'text-slate-400 line-through' : 'text-slate-900')}>{t.task}</p><p className="text-xs text-slate-500">{t.property} · {t.assignee}</p></div>
                <Pill tone={t.due === 'Today' ? 'amber' : 'slate'}>{t.due}</Pill>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel index={1} title="Announcements">
          <ul className="space-y-4">
            {ANNOUNCEMENTS.map((a) => (
              <li key={a.id} className="rounded-lg bg-slate-50 p-3">
                <div className="flex items-start gap-2"><Megaphone className="mt-0.5 size-4 shrink-0 text-[color:var(--demo-accent)]" aria-hidden /><div className="min-w-0"><p className="text-sm font-semibold text-slate-900">{a.title}</p><p className="mt-1 text-xs leading-relaxed text-slate-600">{a.body}</p></div></div>
                <p className="mt-2 text-[11px] text-slate-500">{a.date}</p>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}

/* ---------------------------------- Reports ---------------------------------- */

export function PropertyReportsView() {
  const [period, setPeriod] = useState<'Last 6 months' | 'This year'>('Last 6 months');
  return (
    <>
      <PageHeading title="Reports" description="Revenue, occupancy and unit mix for owners and managers.">
        <SelectMenu label="Period" value={period} options={['Last 6 months', 'This year'] as const} onChange={setPeriod} className="w-44" align="right" />
      </PageHeading>
      <div className="grid gap-3 lg:grid-cols-3">
        <Panel index={0} title="Occupancy trend, percent" className="lg:col-span-2"><AreaChart data={OCCUPANCY_MONTHS} label="Occupancy per month" min={80} max={100} /></Panel>
        <Panel index={1} title="Unit mix">
          <div className="flex items-center gap-4 lg:flex-col lg:items-start xl:flex-row xl:items-center">
            <Donut label="Unit mix" segments={UNIT_MIX} size={104}><span><span className="block text-lg font-semibold tabular-nums text-slate-900">344</span><span className="block text-[11px] text-slate-500">units</span></span></Donut>
            <ul className="space-y-2 text-sm">{UNIT_MIX.map((s) => <li key={s.label} className="flex items-center gap-2 text-slate-600"><span aria-hidden className={cn('size-2.5 rounded-full', s.tone === 'emerald' ? 'bg-[var(--demo-good)]' : s.tone === 'amber' ? 'bg-[var(--demo-gold)]' : 'bg-slate-300')} />{s.label}<span className="ml-auto pl-3 font-medium tabular-nums text-slate-900">{s.value}%</span></li>)}</ul>
          </div>
        </Panel>
      </div>
      <Panel index={2} title="Maintenance performance" className="mt-3">
        <ul className="grid gap-5 md:grid-cols-3">
          {[['Requests resolved within 48 h', 87], ['Urgent requests answered within 2 h', 100], ['Residents satisfied with repairs', 92]].map(([label, value]) => (
            <li key={label as string}>
              <div className="mb-1.5 flex items-center justify-between text-sm"><span className="text-slate-700">{label as string}</span><span className="font-semibold tabular-nums text-slate-900">{value as number}%</span></div>
              <ProgressBar value={value as number} tone={(value as number) >= 90 ? 'emerald' : 'blue'} />
            </li>
          ))}
        </ul>
      </Panel>
    </>
  );
}

/* ---------------------------------- Settings ---------------------------------- */

function Toggle({ label, description, defaultOn = false }: { label: string; description: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
      <div className="min-w-0"><p className="text-sm font-medium text-slate-900">{label}</p><p className="text-xs text-slate-500">{description}</p></div>
      <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={() => setOn((v) => !v)} className={cn('relative h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]', on ? 'bg-[var(--demo-good)]' : 'bg-slate-300')}>
        <span aria-hidden className={cn('absolute top-0.5 size-5 rounded-full bg-white shadow transition-[left]', on ? 'left-[1.4rem]' : 'left-0.5')} />
      </button>
    </div>
  );
}

export function PropertySettingsView() {
  return (
    <>
      <PageHeading title="Settings" description="Late-rent rules, resident notices and access controls." />
      <div className="grid gap-3 lg:grid-cols-2">
        <Panel index={0} title="Rent and payments">
          <div className="divide-y divide-slate-100">
            <Toggle label="Automatic rent reminders" description="Remind tenants 5 days before the due date." defaultOn />
            <Toggle label="Late fee after 5 days" description="Apply the lease late fee automatically." defaultOn />
            <Toggle label="Direct debit by default" description="Offer direct debit first on new leases." />
          </div>
        </Panel>
        <Panel index={1} title="Residents and access">
          <div className="divide-y divide-slate-100">
            <Toggle label="Visitor approval in the app" description="Residents approve every guest before they reach the lobby." defaultOn />
            <Toggle label="Maintenance updates by text" description="Send a message when a request changes status." defaultOn />
            <Toggle label="Leak sensor alerts" description="Alert the manager on water-sensor triggers." defaultOn />
          </div>
        </Panel>
      </div>
    </>
  );
}
