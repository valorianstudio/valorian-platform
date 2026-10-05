'use client';

import { AlertTriangle, Package, Pill as PillIcon, Search, ShoppingBag, Users, Wallet } from 'lucide-react';
import { useMemo, useState } from 'react';
import { AreaChart, BarChart, Donut } from '@/components/demos/shared/charts';
import { DashboardCard, Panel } from '@/components/demos/shared/dashboard-card';
import { Pill, PageHeading, SelectMenu, Tabs } from '@/components/demos/shared/app-ui';
import { CUSTOMER_GROWTH, DASHBOARD_STATS, MEDICINES, PRESCRIPTIONS, SALES_WEEK, STOCK_MIX, SUPPLIERS } from '@/data/pharmacy/catalog';
import type { MedicineCategory, PrescriptionStatus } from '@/data/pharmacy/catalog';
import { cn } from '@/lib/cn';
import { InventoryCard, MedicineCard, PrescriptionCard, expiryTone, stockTone } from './pharmacy-cards';

/* ---------------------------------- Dashboard ---------------------------------- */

export function PharmacyDashboardHome() {
  const { medicines, ordersToday, lowStock, revenue, customers } = DASHBOARD_STATS;
  const low = MEDICINES.filter((m) => m.stock <= m.reorderAt);
  return (
    <>
      <PageHeading title="Dashboard" description="Good morning. 12 items need restocking and 2 prescriptions await review." />
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-5">
        <DashboardCard index={0} label="Total medicines" value={medicines.toLocaleString('en-US')} delta={{ value: '+14 this quarter', up: true }} icon={PillIcon} />
        <DashboardCard index={1} label="Today's orders" value={String(ordersToday)} delta={{ value: '+9 vs yesterday', up: true }} icon={ShoppingBag} tone="emerald" />
        <DashboardCard index={2} label="Low stock items" value={String(lowStock)} delta={{ value: 'Reorder today', up: false }} icon={AlertTriangle} tone="amber" />
        <DashboardCard index={3} label="Revenue (Oct)" value={`$${revenue.toLocaleString('en-US')}`} delta={{ value: '+6.4% vs Sep', up: true }} icon={Wallet} tone="slate" />
        <DashboardCard index={4} label="Customers" value={customers.toLocaleString('en-US')} delta={{ value: '+96 this month', up: true }} icon={Users} />
      </div>
      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        <Panel index={5} title="Sales this week (USD, thousands)" className="lg:col-span-2"><BarChart data={SALES_WEEK} label="Sales by day" highlight={5} className="h-40" /></Panel>
        <Panel index={6} title="Stock by category">
          <div className="flex items-center gap-4 lg:flex-col lg:items-start xl:flex-row xl:items-center">
            <Donut label="Stock by category" segments={STOCK_MIX} size={104}><span><span className="block text-lg font-semibold tabular-nums text-slate-900">428</span><span className="block text-[11px] text-slate-500">medicines</span></span></Donut>
            <ul className="space-y-2 text-sm">{STOCK_MIX.map((s) => <li key={s.label} className="flex items-center gap-2 text-slate-600"><span aria-hidden className={cn('size-2.5 rounded-full', s.tone === 'blue' ? 'bg-[var(--demo-accent)]' : s.tone === 'emerald' ? 'bg-[var(--demo-good)]' : s.tone === 'amber' ? 'bg-[var(--demo-orange)]' : 'bg-slate-300')} />{s.label}<span className="ml-auto pl-3 font-medium tabular-nums text-slate-900">{s.value}%</span></li>)}</ul>
          </div>
        </Panel>
        <Panel index={7} title="Customer growth" className="lg:col-span-2" action={<Pill tone="green">+700 since April</Pill>}><AreaChart data={CUSTOMER_GROWTH} label="Customers per month" min={2400} max={3300} /></Panel>
        <Panel index={8} title="Low stock and expiry">
          <ul className="space-y-3">{low.slice(0, 4).map((m) => <li key={m.id} className="flex items-center gap-3"><span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium text-slate-900">{m.name}</span><span className="block truncate text-xs text-slate-500">{m.stock} left · exp. {m.expiry}</span></span><Pill tone={stockTone(m)}>{m.stock}</Pill></li>)}</ul>
        </Panel>
      </div>
    </>
  );
}

/* ---------------------------------- Medicines ---------------------------------- */

const CATEGORY_OPTIONS = ['All', 'Prescription', 'Healthcare', 'Personal care', 'Supplements'] as const;
type CategoryOption = (typeof CATEGORY_OPTIONS)[number];
const EXPIRY_OPTIONS = ['Any expiry', 'Expiring soon'] as const;

export function PharmacyMedicinesView() {
  const [category, setCategory] = useState<CategoryOption>('All');
  const [expiry, setExpiry] = useState<(typeof EXPIRY_OPTIONS)[number]>('Any expiry');
  const [query, setQuery] = useState('');
  const count = (c: CategoryOption) => (c === 'All' ? MEDICINES.length : MEDICINES.filter((m) => m.category === c).length);
  const list = useMemo(
    () =>
      MEDICINES.filter((m) => (category === 'All' || m.category === (category as MedicineCategory)) && (expiry === 'Any expiry' || expiryTone(m.expiry) !== 'green') && `${m.name} ${m.generic}`.toLowerCase().includes(query.trim().toLowerCase())),
    [category, expiry, query],
  );
  return (
    <>
      <PageHeading title="Medicines" description="Every product on the shelf, with stock, batch and expiry." />
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <label className="flex h-9 min-w-[14rem] flex-1 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-600 focus-within:border-[color:var(--demo-accent)] sm:max-w-xs">
          <Search className="size-4 text-slate-400" aria-hidden />
          <span className="sr-only">Search medicines</span>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name or generic" className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none" />
        </label>
        <div className="ml-auto"><SelectMenu label="Expiry" value={expiry} options={EXPIRY_OPTIONS} onChange={setExpiry} className="w-40" align="right" /></div>
      </div>
      <div className="mb-4"><Tabs label="Medicine category" value={category} onChange={setCategory} tabs={CATEGORY_OPTIONS.map((c) => ({ id: c, label: c, count: count(c) }))} /></div>
      {list.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">No medicines match this search.</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{list.map((m, i) => <li key={m.id}><MedicineCard medicine={m} index={i} /></li>)}</ul>
      )}
    </>
  );
}

/* ---------------------------------- Inventory ---------------------------------- */

export function PharmacyInventoryView() {
  const [filter, setFilter] = useState<'All stock' | 'Low stock'>('All stock');
  const [reordered, setReordered] = useState<string[]>([]);
  const low = MEDICINES.filter((m) => m.stock <= m.reorderAt);
  const list = filter === 'Low stock' ? low : MEDICINES;
  return (
    <>
      <PageHeading title="Inventory" description="Stock levels, expiry and supplier information for every batch." />
      {low.length > 0 && (
        <div role="status" className="demo-rise mb-4 flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-amber-100 text-amber-700"><AlertTriangle className="size-4" aria-hidden /></span>
          <p className="flex-1 text-sm text-amber-900"><span className="font-semibold">{low.length} items</span> are at or below their reorder point.</p>
          <Pill tone="amber">{reordered.length} reorders created</Pill>
        </div>
      )}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm text-slate-600">{list.length} batches</span>
        <SelectMenu label="Stock" value={filter} options={['All stock', 'Low stock'] as const} onChange={setFilter} className="w-36" align="right" />
      </div>
      <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {list.map((m, i) => (
          <li key={m.id}><InventoryCard medicine={m} index={i} onReorder={() => setReordered((r) => (r.includes(m.id) ? r : [...r, m.id]))} /></li>
        ))}
      </ul>
      <Panel title="Suppliers" className="mt-4">
        <ul className="divide-y divide-slate-100">
          {SUPPLIERS.map((s) => (
            <li key={s.name} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-3 first:pt-0 last:pb-0">
              <span className="grid size-9 place-items-center rounded-lg bg-[var(--demo-accent-soft)] text-[color:var(--demo-accent)]"><Package className="size-4" aria-hidden /></span>
              <div className="min-w-0 flex-1"><p className="text-sm font-medium text-slate-900">{s.name}</p><p className="text-xs text-slate-500">{s.category}</p></div>
              <p className="text-xs text-slate-600">Lead time {s.leadDays} days</p>
              <p className="text-xs text-slate-600">Last delivery {s.lastDelivery}</p>
              <Pill tone={s.status === 'Active' ? 'green' : 'amber'}>{s.status}</Pill>
            </li>
          ))}
        </ul>
      </Panel>
    </>
  );
}

/* ---------------------------------- Prescriptions ---------------------------------- */

const RX_TABS = ['All', 'Pending', 'Verified', 'Dispensed'] as const;
type RxTab = (typeof RX_TABS)[number];

export function PharmacyPrescriptionsView() {
  const [tab, setTab] = useState<RxTab>('All');
  const [status, setStatus] = useState<Record<string, PrescriptionStatus>>({});
  const rows = PRESCRIPTIONS.map((r) => ({ ...r, status: status[r.id] ?? r.status }));
  const list = rows.filter((r) => tab === 'All' || r.status === tab);
  const next: Record<PrescriptionStatus, PrescriptionStatus | null> = { Pending: 'Verified', Verified: 'Dispensed', Dispensed: null };
  const labels: Record<PrescriptionStatus, string> = { Pending: 'Verify prescription', Verified: 'Mark dispensed', Dispensed: '' };
  return (
    <>
      <PageHeading title="Prescriptions" description="Review, verify and dispense prescriptions with the doctor and patient details." />
      <div className="mb-4"><Tabs label="Prescription status" value={tab} onChange={setTab} tabs={RX_TABS.map((t) => ({ id: t, label: t, count: t === 'All' ? rows.length : rows.filter((r) => r.status === t).length }))} /></div>
      <div className="grid gap-3 lg:grid-cols-2">
        {list.map((r, i) => {
          const to = next[r.status];
          return <PrescriptionCard key={r.id} rx={r} index={i} action={to ? { label: labels[r.status], onClick: () => setStatus((s) => ({ ...s, [r.id]: to })) } : undefined} />;
        })}
      </div>
      {list.length === 0 && <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">No prescriptions in this status.</p>}
    </>
  );
}
