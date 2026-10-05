'use client';

import { AlertTriangle, Check, Clock, Scissors, Wallet } from 'lucide-react';
import { useState } from 'react';
import { BarChart, Donut } from '@/components/demos/shared/charts';
import { DashboardCard, Panel } from '@/components/demos/shared/dashboard-card';
import { Avatar, PageHeading, Pill, ProgressBar, Tabs } from '@/components/demos/shared/app-ui';
import { APPOINTMENTS, ORDERS, PRODUCTS } from '@/data/petshop/catalog';
import type { Appointment, AppointmentStatus, Order, OrderStatus } from '@/data/petshop/catalog';
import { cn } from '@/lib/cn';
import { AppointmentCard, tone } from './petshop-cards';

const NEXT_ORDER: Partial<Record<OrderStatus, OrderStatus>> = { Placed: 'Packed', Packed: 'Shipped', Shipped: 'Delivered' };
const NEXT_APPT: Partial<Record<AppointmentStatus, AppointmentStatus>> = { Booked: 'Checked in', 'Checked in': 'In progress', 'In progress': 'Done' };

/* ---------------------------------- Orders ---------------------------------- */

export function PetshopOrdersView() {
  const [tab, setTab] = useState<'All' | OrderStatus>('All');
  const [delivery, setDelivery] = useState<'All' | Order['delivery']>('All');
  const [advance, setAdvance] = useState<Record<string, OrderStatus>>({});
  const orders: Order[] = ORDERS.map((o) => ({ ...o, status: advance[o.id] ?? o.status }));
  const list = orders.filter((o) => (tab === 'All' || o.status === tab) && (delivery === 'All' || o.delivery === delivery));
  return (
    <>
      <PageHeading title="Orders" description="Pack, ship and deliver online orders." />
      <div className="mb-3 flex flex-wrap items-center gap-2.5">
        <Tabs label="Order status" value={tab} onChange={setTab} tabs={[{ id: 'All', label: 'All', count: orders.length }, ...(['Placed', 'Packed', 'Shipped', 'Delivered'] as const).map((s) => ({ id: s, label: s, count: orders.filter((o) => o.status === s).length }))]} />
        <div className="ml-auto"><Tabs label="Delivery type" value={delivery} onChange={setDelivery} tabs={(['All', 'Delivery', 'Pickup'] as const).map((d) => ({ id: d, label: d }))} /></div>
      </div>
      <ul key={`${tab}-${delivery}`} className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((o, i) => (
          <li key={o.id} className="demo-rise rounded-xl border border-slate-200 bg-white p-4 transition-shadow hover:shadow-md" style={{ ['--i' as string]: i }}>
            <div className="flex items-start justify-between gap-2"><div><p className="text-xs text-slate-500">{o.id} · {o.date}</p><p className="text-sm font-semibold text-slate-900">{o.customer}</p></div><Pill tone={tone(o.status)}>{o.status}</Pill></div>
            <p className="mt-3 text-xs text-slate-600">{o.items} items · {o.delivery}</p>
            <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-100 pt-3"><span className="text-base font-semibold tabular-nums text-slate-900">${o.total}</span>{NEXT_ORDER[o.status] && <button type="button" onClick={() => setAdvance((a) => ({ ...a, [o.id]: NEXT_ORDER[o.status]! }))} className="rounded-lg bg-[var(--demo-accent)] px-2.5 py-1 text-xs font-semibold text-white hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]">Mark {NEXT_ORDER[o.status]!.toLowerCase()}</button>}</div>
          </li>
        ))}
        {list.length === 0 && <li className="rounded-xl border border-dashed border-slate-300 bg-white py-10 text-center text-sm text-slate-500 sm:col-span-2 xl:col-span-3">No orders here.</li>}
      </ul>
    </>
  );
}

/* ---------------------------------- Appointments & grooming ---------------------------------- */

export function PetshopAppointmentsView({ grooming = false }: { grooming?: boolean }) {
  const [status, setStatus] = useState<Record<string, AppointmentStatus>>({});
  const [filter, setFilter] = useState<'All' | 'Vet checkup' | 'Grooming' | 'Training' | 'Vaccination'>(grooming ? 'Grooming' : 'All');
  const list: Appointment[] = APPOINTMENTS.map((a) => ({ ...a, status: status[a.id] ?? a.status })).filter((a) => filter === 'All' || a.kind === filter);
  return (
    <>
      <PageHeading title={grooming ? 'Grooming' : 'Appointments'} description={grooming ? 'The groomer board for today.' : 'Vet visits, grooming and training for today.'} />
      <div className="mb-4"><Tabs label="Appointment type" value={filter} onChange={setFilter} tabs={(['All', 'Grooming', 'Vet checkup', 'Vaccination', 'Training'] as const).map((t) => ({ id: t, label: t }))} /></div>
      <ul key={filter} className="grid gap-3 lg:grid-cols-2">
        {list.map((a, i) => <li key={a.id}><AppointmentCard appointment={a} index={i} action={NEXT_APPT[a.status] ? { label: `Move to ${NEXT_APPT[a.status]!.toLowerCase()}`, onClick: () => setStatus((s) => ({ ...s, [a.id]: NEXT_APPT[a.status]! })) } : undefined} /></li>)}
        {list.length === 0 && <li className="rounded-xl border border-dashed border-slate-300 bg-white py-10 text-center text-sm text-slate-500 lg:col-span-2">Nothing booked for this type today.</li>}
      </ul>
      {grooming && <p className="mt-4 inline-flex items-center gap-2 text-xs text-slate-500"><Scissors className="size-3.5" aria-hidden /> Each groomer works one pet at a time.</p>}
    </>
  );
}

/* ---------------------------------- Inventory ---------------------------------- */

export function PetshopInventoryView() {
  const [restocked, setRestocked] = useState<Record<string, boolean>>({});
  const rows = PRODUCTS.map((p) => ({ ...p, level: restocked[p.id] ? p.reorderAt * 3 : p.stock, low: !restocked[p.id] && p.stock <= p.reorderAt }));
  const alerts = rows.filter((r) => r.low);
  return (
    <>
      <PageHeading title="Inventory" description="Stock levels, reorder points and low-stock alerts." />
      {alerts.length > 0 && <div role="status" className="demo-rise mb-3 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-sm text-amber-900"><AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden /><p><span className="font-semibold">{alerts.length} products are at or below their reorder point.</span></p></div>}
      <div className="demo-rise overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full min-w-[36rem] text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50 text-xs font-medium text-slate-500"><tr><th scope="col" className="px-4 py-3">Product</th><th scope="col" className="px-4 py-3">Category</th><th scope="col" className="px-4 py-3">Units</th><th scope="col" className="w-40 px-4 py-3">Level</th><th scope="col" className="px-4 py-3">Status</th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="px-4 py-3 font-medium text-slate-900">{r.name}</td>
                <td className="px-4 py-3 text-slate-600">{r.category}</td>
                <td className="px-4 py-3 tabular-nums text-slate-700">{r.level}</td>
                <td className="px-4 py-3"><ProgressBar value={Math.min(100, (r.level / (r.reorderAt * 3)) * 100)} tone={r.low ? 'blue' : 'emerald'} /></td>
                <td className="px-4 py-3">{r.low ? <button type="button" onClick={() => setRestocked((s) => ({ ...s, [r.id]: true }))} className="rounded-lg bg-[var(--demo-accent)] px-2.5 py-1 text-xs font-semibold text-white hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]">Reorder</button> : <Pill tone="green">{restocked[r.id] ? 'Restocked' : 'OK'}</Pill>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ---------------------------------- Payments, reports, settings ---------------------------------- */

export function PetshopPaymentsView() {
  const rows = [
    { id: 'P-1', label: 'Grooming · Biscuit', amount: 58, status: 'Paid' as const, method: 'Card' },
    { id: 'P-2', label: 'Order #2201', amount: 62, status: 'Pending' as const, method: 'Wallet' },
    { id: 'P-3', label: 'Vet checkup · Luna', amount: 55, status: 'Paid' as const, method: 'Card' },
    { id: 'P-4', label: 'Membership · Pet Plus', amount: 29, status: 'Paid' as const, method: 'Account' },
  ];
  return (
    <>
      <PageHeading title="Payments" description="Card, wallet and account payments for services and orders." />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <DashboardCard index={0} label="Collected today" value="$204" icon={Wallet} tone="emerald" />
        <DashboardCard index={1} label="Pending" value="$62" icon={Clock} tone="amber" />
        <DashboardCard index={2} label="Refunds" value="$0" icon={Check} tone="slate" />
      </div>
      <ul className="mt-4 divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
        {rows.map((r) => <li key={r.id} className="flex flex-wrap items-center gap-3 p-4"><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-slate-900">{r.label}</p><p className="text-xs text-slate-500">{r.id} · {r.method}</p></div><span className="text-sm font-semibold tabular-nums text-slate-900">${r.amount}</span><Pill tone={r.status === 'Paid' ? 'green' : 'amber'}>{r.status}</Pill></li>)}
      </ul>
    </>
  );
}

const REPORTS = ['Sales by category', 'Grooming utilisation', 'Vet visits and vaccinations', 'Low-stock report', 'Customer retention', 'Staff schedules'];

export function PetshopReportsView() {
  const [ready, setReady] = useState<Record<string, boolean>>({});
  return (
    <>
      <PageHeading title="Reports" description="Printable reports for the owner and the accountant." />
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {REPORTS.map((name, i) => (
          <li key={name} className="demo-rise flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4" style={{ ['--i' as string]: i }}>
            <div><p className="text-sm font-semibold text-slate-900">{name}</p><p className="text-xs text-slate-500">PDF · October 2026</p></div>
            <button type="button" onClick={() => setReady((s) => ({ ...s, [name]: true }))} className={cn('inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]', ready[name] ? 'bg-[var(--demo-good-soft)] text-[color:var(--demo-good-ink)]' : 'bg-[var(--demo-accent)] text-white hover:brightness-110')}>{ready[name] ? <><Check className="size-3.5" aria-hidden /> Ready</> : 'Generate'}</button>
          </li>
        ))}
      </ul>
      <Panel title="Category mix" index={6} className="mt-4"><div className="flex items-center gap-4"><Donut label="Sales by category" segments={[{ label: 'Dogs', value: 38, tone: 'blue' }, { label: 'Cats', value: 29, tone: 'emerald' }, { label: 'Accessories', value: 22, tone: 'slate' }]} size={96} /><div className="min-w-0"><BarChart data={[{ label: 'Dogs', value: 38 }, { label: 'Cats', value: 29 }, { label: 'Birds', value: 11 }]} label="Sales share by category" unit="%" className="h-24" /></div></div></Panel>
    </>
  );
}

function Switch({ label, description, defaultOn = false }: { label: string; description: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <li className="flex items-center justify-between gap-4 py-3.5">
      <div className="min-w-0"><p className="text-sm font-medium text-slate-900">{label}</p><p className="text-xs text-slate-500">{description}</p></div>
      <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={() => setOn((v) => !v)} className={cn('relative h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]', on ? 'bg-[var(--demo-accent)]' : 'bg-slate-300')}>
        <span aria-hidden className={cn('absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow transition-transform duration-200', on && 'translate-x-5')} />
      </button>
    </li>
  );
}

export function PetshopSettingsView() {
  return (
    <>
      <PageHeading title="Settings" description="Shop profile, booking rules and reminders." />
      <div className="grid gap-3 lg:grid-cols-2">
        <Panel title="Shop profile" index={0}>
          <dl className="space-y-3 text-sm">{[['Shop', 'Pawsome Pet Co.'], ['Address', '12 Garden Row'], ['Phone', '+1 555 0177']].map(([k, v]) => <div key={k} className="flex justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0"><dt className="text-slate-500">{k}</dt><dd className="font-medium text-slate-900">{v}</dd></div>)}</dl>
        </Panel>
        <Panel title="Reminders and booking" index={1}>
          <ul className="divide-y divide-slate-100">
            <Switch label="Vaccination reminders" description="Remind owners 14 days before a booster is due." defaultOn />
            <Switch label="Grooming reminders" description="Text owners the day before their appointment." defaultOn />
            <Switch label="Online booking" description="Let customers book grooming and checkups online." defaultOn />
            <Switch label="Low-stock emails" description="Email the manager when a product hits its reorder point." />
          </ul>
        </Panel>
      </div>
      <p className="mt-4 flex items-center gap-2 text-xs text-slate-500"><Avatar name="Pawsome Team" size="sm" /> Changes apply to all branches.</p>
    </>
  );
}
