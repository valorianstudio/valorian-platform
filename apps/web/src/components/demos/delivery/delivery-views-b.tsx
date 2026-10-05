'use client';

import { Check, Clock, Crown, Route as RouteIcon, Search, Wallet } from 'lucide-react';
import { useState } from 'react';
import { AreaChart, BarChart, Donut } from '@/components/demos/shared/charts';
import { DashboardCard, Panel } from '@/components/demos/shared/dashboard-card';
import { Avatar, PageHeading, Pill, ProgressBar, SelectMenu, Tabs } from '@/components/demos/shared/app-ui';
import { CUSTOMERS, DASHBOARD_STATS, ORDERS, REVENUE_MONTHS, ROUTES, SUCCESS_WEEK, TRANSACTIONS } from '@/data/delivery/operations';
import type { Transaction } from '@/data/delivery/operations';
import { cn } from '@/lib/cn';
import { tone } from './delivery-cards';

const money = (value: number) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/* ---------------------------------- Customers ---------------------------------- */

export function DeliveryCustomersView() {
  const [tier, setTier] = useState<'All tiers' | 'Plus' | 'Standard' | 'Business' | 'New'>('All tiers');
  const [query, setQuery] = useState('');
  const list = CUSTOMERS.filter((c) => (tier === 'All tiers' || c.tier === tier) && c.name.toLowerCase().includes(query.trim().toLowerCase()));
  return (
    <>
      <PageHeading title="Customers" description="Who orders, how often, and what they order most." />
      <div className="mb-4 flex flex-wrap items-center gap-2.5">
        <label className="relative min-w-48 flex-1 sm:max-w-xs">
          <span className="sr-only">Search customers</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search customers" className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm placeholder:text-slate-400 focus:border-[color:var(--demo-accent)] focus:outline-2 focus:outline-[color:var(--demo-accent)]" />
        </label>
        <div className="ml-auto"><SelectMenu label="Tier" value={tier} options={['All tiers', 'Plus', 'Standard', 'Business', 'New'] as const} onChange={setTier} className="w-36" align="right" /></div>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((c, i) => (
          <li key={c.id} className="demo-rise rounded-xl border border-slate-200 bg-white p-4 transition-shadow hover:shadow-md" style={{ ['--i' as string]: i }}>
            <div className="flex items-center gap-3"><Avatar name={c.name} /><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-900">{c.name}</p><p className="text-xs text-slate-500">Last order {c.last}</p></div>{c.tier === 'Business' && <Crown className="size-4 text-[color:var(--demo-orange-ink)]" aria-label="Business account" />}<Pill tone={tone(c.tier)}>{c.tier}</Pill></div>
            <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 text-xs"><div><p className="text-slate-500">Orders</p><p className="font-semibold tabular-nums text-slate-900">{c.orders}</p></div><div><p className="text-slate-500">Lifetime spend</p><p className="font-semibold tabular-nums text-slate-900">{money(c.spend)}</p></div></div>
          </li>
        ))}
      </ul>
    </>
  );
}

/* ---------------------------------- Routes ---------------------------------- */

export function DeliveryRoutesView() {
  const [done, setDone] = useState<Record<string, number>>(() => Object.fromEntries(ROUTES.map((r) => [r.id, r.done])));
  return (
    <>
      <PageHeading title="Routes" description="Planned routes for each rider. Stops update as deliveries complete." />
      <ul className="grid gap-3 lg:grid-cols-3">
        {ROUTES.map((r, i) => {
          const complete = done[r.id];
          const pct = (complete / r.stops) * 100;
          return (
            <li key={r.id} className="demo-rise rounded-xl border border-slate-200 bg-white p-4" style={{ ['--i' as string]: i }}>
              <div className="flex items-start justify-between gap-2"><div className="min-w-0"><p className="text-sm font-semibold text-slate-900">{r.name}</p><p className="text-xs text-slate-500">{r.rider}</p></div><RouteIcon className="size-4 text-[color:var(--demo-accent)]" aria-hidden /></div>
              <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600"><span>{r.stops} stops</span><span>{r.km} km</span><span className="inline-flex items-center gap-1"><Clock className="size-3" aria-hidden /> {r.minutes} min</span></p>
              <div className="mt-4"><div className="mb-1.5 flex justify-between text-xs text-slate-500"><span>{complete} of {r.stops} done</span><span className="font-medium tabular-nums text-slate-700">{Math.round(pct)}%</span></div><ProgressBar value={pct} tone={pct === 100 ? 'emerald' : 'blue'} /></div>
              <button type="button" disabled={complete >= r.stops} onClick={() => setDone((d) => ({ ...d, [r.id]: Math.min(r.stops, d[r.id] + 1) }))} className="mt-4 h-8 w-full rounded-lg bg-[var(--demo-accent)] text-xs font-semibold text-white hover:brightness-110 disabled:bg-slate-200 disabled:text-slate-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]">{complete >= r.stops ? 'Route complete' : 'Complete next stop'}</button>
            </li>
          );
        })}
      </ul>
    </>
  );
}

/* ---------------------------------- Payments ---------------------------------- */

export function DeliveryPaymentsView() {
  const [tab, setTab] = useState<'All' | Transaction['status']>('All');
  const [paid, setPaid] = useState<Record<string, boolean>>({});
  const rows: Transaction[] = TRANSACTIONS.map((t) => (paid[t.id] ? { ...t, status: 'Paid' } : t));
  const list = rows.filter((t) => tab === 'All' || t.status === tab);
  const sum = (s: Transaction['status']) => rows.filter((t) => t.status === s).reduce((a, t) => a + t.amount, 0);
  return (
    <>
      <PageHeading title="Payments" description="Transactions, earnings and invoices to collect." />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <DashboardCard index={0} label="Collected" value={money(sum('Paid'))} icon={Wallet} tone="emerald" />
        <DashboardCard index={1} label="Pending" value={money(sum('Pending'))} icon={Clock} tone="amber" />
        <DashboardCard index={2} label="Refunded" value={money(sum('Refunded'))} icon={Check} tone="slate" />
      </div>
      <div className="mt-3 grid gap-3 xl:grid-cols-[1fr_1.6fr]">
        <Panel index={3} title="Earnings, last six months (USD thousands)" className="self-start"><BarChart data={REVENUE_MONTHS} label="Earnings by month" highlight={5} className="h-40" /></Panel>
        <Panel index={4} title="Transactions">
          <Tabs label="Transaction status" value={tab} onChange={setTab} tabs={(['All', 'Paid', 'Pending', 'Refunded'] as const).map((t) => ({ id: t, label: t }))} />
          <ul key={tab} className="mt-3 divide-y divide-slate-100">
            {list.map((t, i) => (
              <li key={t.id} className="demo-rise flex flex-wrap items-center gap-3 py-3" style={{ ['--i' as string]: i }}>
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-slate-900">{t.label}</p><p className="text-xs text-slate-500">{t.id} · {t.date} · {t.method}</p></div>
                <span className="text-sm font-semibold tabular-nums text-slate-900">{money(t.amount)}</span>
                <Pill tone={tone(t.status)}>{t.status}</Pill>
                {t.status === 'Pending' && <button type="button" onClick={() => setPaid((p) => ({ ...p, [t.id]: true }))} className="rounded-md bg-[var(--demo-accent)] px-2.5 py-1 text-xs font-semibold text-white hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]">Mark paid</button>}
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}

/* ---------------------------------- Analytics, reports, settings ---------------------------------- */

export function DeliveryAnalyticsView() {
  return (
    <>
      <PageHeading title="Analytics" description="Speed, reliability and cost per drop, so you can plan the next shift." />
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <DashboardCard index={0} label="Avg. delivery time" value="28 min" delta={{ value: '-3 min', up: true }} icon={Clock} />
        <DashboardCard index={1} label="Cost per drop" value="$4.20" delta={{ value: '-$0.30', up: true }} icon={Wallet} tone="emerald" />
        <DashboardCard index={2} label="Km per delivery" value="3.4" icon={RouteIcon} tone="amber" />
        <DashboardCard index={3} label="Failed deliveries" value="0.8%" delta={{ value: '-0.2 pts', up: true }} icon={Check} tone="slate" />
      </div>
      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        <Panel index={4} title="On-time rate, by day (%)" className="lg:col-span-2"><AreaChart data={SUCCESS_WEEK} label="On-time rate by day" min={90} max={100} /></Panel>
        <Panel index={5} title="Mix by type"><div className="flex items-center gap-4"><Donut label="Deliveries by type" segments={[{ label: 'Food', value: 52, tone: 'blue' }, { label: 'Parcel', value: 33, tone: 'emerald' }, { label: 'Business', value: 15, tone: 'amber' }]} size={96} /><p className="text-xs text-slate-600">Food leads volume, business runs carry the highest fees.</p></div></Panel>
      </div>
    </>
  );
}

const REPORTS = ['Daily delivery summary', 'Rider performance', 'Cost per zone', 'Failed deliveries', 'Customer retention', 'Payouts to riders'];

export function DeliveryReportsView() {
  const [ready, setReady] = useState<Record<string, boolean>>({});
  return (
    <>
      <PageHeading title="Reports" description="Printable reports for operations, finance and partners." />
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {REPORTS.map((name, i) => (
          <li key={name} className="demo-rise flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4" style={{ ['--i' as string]: i }}>
            <div><p className="text-sm font-semibold text-slate-900">{name}</p><p className="text-xs text-slate-500">PDF · October 2026</p></div>
            <button type="button" onClick={() => setReady((s) => ({ ...s, [name]: true }))} className={cn('inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]', ready[name] ? 'bg-[var(--demo-good-soft)] text-[color:var(--demo-good-ink)]' : 'bg-[var(--demo-accent)] text-white hover:brightness-110')}>{ready[name] ? <><Check className="size-3.5" aria-hidden /> Ready</> : 'Generate'}</button>
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
      <div className="min-w-0"><p className="text-sm font-medium text-slate-900">{label}</p><p className="text-xs text-slate-500">{description}</p></div>
      <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={() => setOn((v) => !v)} className={cn('relative h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]', on ? 'bg-[var(--demo-accent)]' : 'bg-slate-300')}>
        <span aria-hidden className={cn('absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow transition-transform duration-200', on && 'translate-x-5')} />
      </button>
    </li>
  );
}

export function DeliverySettingsView() {
  const [zone, setZone] = useState<'Old Town' | 'North' | 'Harbour'>('Old Town');
  return (
    <>
      <PageHeading title="Settings" description="Service zones, fees and dispatch rules." />
      <div className="grid gap-3 lg:grid-cols-2">
        <Panel title="Dispatch" index={0}>
          <dl className="space-y-3 text-sm">{[['Company', 'Swiftwheel'], ['Base fee', '$4.90'], ['Per km', '$0.80']].map(([k, v]) => <div key={k} className="flex justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0"><dt className="text-slate-500">{k}</dt><dd className="font-medium text-slate-900">{v}</dd></div>)}</dl>
          <div className="mt-4"><span className="mb-1.5 block text-xs font-medium text-slate-500">Default zone</span><SelectMenu label="Default zone" value={zone} options={['Old Town', 'North', 'Harbour'] as const} onChange={setZone} /></div>
        </Panel>
        <Panel title="Rules" index={1}>
          <ul className="divide-y divide-slate-100">
            <Switch label="Auto-assign nearest rider" description="Offer each new order to the closest free rider." defaultOn />
            <Switch label="Proof of delivery photo" description="Riders take a photo at each drop-off." defaultOn />
            <Switch label="Surge pricing" description="Raise fees automatically at peak hours." />
          </ul>
        </Panel>
      </div>
      <p className="mt-4 text-xs text-slate-500">{ORDERS.length} recent orders use these rules.</p>
    </>
  );
}

