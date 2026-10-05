'use client';

import { Check, Package, Search, ShieldCheck, Truck, Wallet } from 'lucide-react';
import { useMemo, useState } from 'react';
import { BarChart } from '@/components/demos/shared/charts';
import { DashboardCard, Panel } from '@/components/demos/shared/dashboard-card';
import { Avatar, PageHeading, Pill, ProgressBar, SelectMenu, Tabs } from '@/components/demos/shared/app-ui';
import { CUSTOMERS, ORDERS, SALES_WEEK, SUPPLIERS, TRACK } from '@/data/pharmacy/catalog';
import type { Customer, Order, OrderStatus } from '@/data/pharmacy/catalog';
import { cn } from '@/lib/cn';
import { OrderCard } from './pharmacy-cards';

/* ---------------------------------- Orders ---------------------------------- */

const ORDER_TABS = ['All', 'Placed', 'Packed', 'Out for delivery', 'Delivered'] as const;
type OrderTab = (typeof ORDER_TABS)[number];
const NEXT_STATUS: Record<OrderStatus, OrderStatus | null> = { Placed: 'Packed', Packed: 'Out for delivery', 'Out for delivery': 'Delivered', Delivered: null };

export function PharmacyOrdersView() {
  const [tab, setTab] = useState<OrderTab>('All');
  const [method, setMethod] = useState<'All methods' | 'Delivery' | 'Pickup'>('All methods');
  const [status, setStatus] = useState<Record<string, OrderStatus>>({});
  const rows: Order[] = ORDERS.map((o) => ({ ...o, status: status[o.id] ?? o.status }));
  const list = rows.filter((o) => (tab === 'All' || o.status === tab) && (method === 'All methods' || o.method === method));
  return (
    <>
      <PageHeading title="Orders" description="Track every order from placed to delivered, with pick-up and delivery details." />
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="min-w-0 flex-1"><Tabs label="Order status" value={tab} onChange={setTab} tabs={ORDER_TABS.map((t) => ({ id: t, label: t, count: t === 'All' ? rows.length : rows.filter((o) => o.status === t).length }))} /></div>
        <SelectMenu label="Method" value={method} options={['All methods', 'Delivery', 'Pickup'] as const} onChange={setMethod} className="w-40" align="right" />
      </div>
      <div className="grid gap-4 xl:grid-cols-[1fr_20rem]">
        <div className="space-y-3">
          {list.map((o, i) => {
            const to = NEXT_STATUS[o.status];
            return <OrderCard key={o.id} order={o} index={i} action={to ? { label: `Mark ${to.toLowerCase()}`, onClick: () => setStatus((s) => ({ ...s, [o.id]: to })) } : undefined} />;
          })}
          {list.length === 0 && <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">No orders match these filters.</p>}
        </div>
        <Panel index={4} title="Delivery tracking, #7741">
          <ol className="relative space-y-4 border-l border-slate-200 pl-4">
            {TRACK.map((s) => (
              <li key={s.label} className="relative">
                <span className={cn('absolute -left-[1.2rem] top-0.5 grid size-3 place-items-center rounded-full', s.done ? 'bg-[var(--demo-good)]' : 'bg-slate-200')} />
                <p className={cn('text-sm font-medium', s.done ? 'text-slate-900' : 'text-slate-500')}>{s.label}</p>
                <p className="text-xs text-slate-500">{s.note}</p>
              </li>
            ))}
          </ol>
        </Panel>
      </div>
    </>
  );
}

/* ---------------------------------- Customers ---------------------------------- */

const TIER_TABS = ['All', 'Gold', 'Silver', 'New'] as const;
type TierTab = (typeof TIER_TABS)[number];
const TIER_TONE: Record<Customer['tier'], 'amber' | 'blue' | 'slate'> = { Gold: 'amber', Silver: 'blue', New: 'slate' };

export function PharmacyCustomersView() {
  const [tier, setTier] = useState<TierTab>('All');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Customer>(CUSTOMERS[0]);
  const list = useMemo(() => CUSTOMERS.filter((c) => (tier === 'All' || c.tier === tier) && c.name.toLowerCase().includes(query.trim().toLowerCase())), [tier, query]);
  const history = ORDERS.filter((o) => o.customer === selected.name);
  return (
    <>
      <PageHeading title="Customers" description="Patient profiles, refills and purchase history." />
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <label className="flex h-9 min-w-[14rem] flex-1 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-600 focus-within:border-[color:var(--demo-accent)] sm:max-w-xs">
          <Search className="size-4 text-slate-400" aria-hidden />
          <span className="sr-only">Search customers</span>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search customers" className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none" />
        </label>
        <div className="ml-auto"><Tabs label="Customer tier" value={tier} onChange={setTier} tabs={TIER_TABS.map((t) => ({ id: t, label: t }))} /></div>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <ul className="space-y-2">
          {list.map((c, i) => (
            <li key={c.id} className="demo-rise" style={{ ['--i' as string]: i }}>
              <button type="button" aria-pressed={selected.id === c.id} onClick={() => setSelected(c)} className={cn('flex w-full items-center gap-3 rounded-xl border bg-white p-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]', selected.id === c.id ? 'border-[color:var(--demo-accent)] bg-[var(--demo-accent-soft)]' : 'border-slate-200 hover:border-slate-300')}>
                <Avatar name={c.name} />
                <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-slate-900">{c.name}</span><span className="block text-xs text-slate-500">{c.city} · {c.orders} orders</span></span>
                <Pill tone={TIER_TONE[c.tier]}>{c.tier}</Pill>
              </button>
            </li>
          ))}
          {list.length === 0 && <li className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">No customers found.</li>}
        </ul>
        <Panel index={3} title="Profile">
          <div className="flex items-center gap-3"><Avatar name={selected.name} size="lg" /><div><p className="text-base font-semibold text-slate-900">{selected.name}</p><p className="text-xs text-slate-500">{selected.city} · last order {selected.lastOrder}</p></div></div>
          <div className="mt-5 grid grid-cols-3 gap-2 text-center">
            {[['Total spent', `$${selected.spent.toLocaleString('en-US')}`], ['Orders', String(selected.orders)], ['Refills', String(selected.refills)]].map(([l, v]) => (
              <div key={l} className="rounded-lg bg-slate-50 p-3"><p className="text-sm font-semibold tabular-nums text-slate-900">{v}</p><p className="text-[11px] text-slate-500">{l}</p></div>
            ))}
          </div>
          <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-slate-500">Purchase history</p>
          <ul className="mt-2 divide-y divide-slate-100 text-sm">
            {history.length > 0 ? history.map((o) => <li key={o.id} className="flex items-center justify-between py-2.5"><span className="text-slate-700"><span className="tabular-nums">{o.id}</span> · {o.items} items</span><span className="font-medium tabular-nums text-slate-900">${o.total.toFixed(2)}</span></li>) : <li className="py-2.5 text-slate-500">No orders in the last week.</li>}
          </ul>
        </Panel>
      </div>
    </>
  );
}

/* ---------------------------------- Suppliers ---------------------------------- */

export function PharmacySuppliersView() {
  return (
    <>
      <PageHeading title="Suppliers" description="Who supplies each category, lead times and the last delivery." />
      <div className="grid gap-3 md:grid-cols-2">
        {SUPPLIERS.map((s, i) => (
          <Panel key={s.name} index={i}>
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[var(--demo-accent-soft)] text-[color:var(--demo-accent)]"><Package className="size-4" aria-hidden /></span>
              <div className="min-w-0 flex-1"><p className="text-sm font-semibold text-slate-900">{s.name}</p><p className="text-xs text-slate-500">{s.category}</p></div>
              <Pill tone={s.status === 'Active' ? 'green' : 'amber'}>{s.status}</Pill>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div><dt className="text-xs text-slate-500">Lead time</dt><dd className="font-medium text-slate-900">{s.leadDays} days</dd></div>
              <div><dt className="text-xs text-slate-500">Last delivery</dt><dd className="font-medium text-slate-900">{s.lastDelivery}</dd></div>
            </dl>
          </Panel>
        ))}
      </div>
    </>
  );
}

/* ---------------------------------- Sales ---------------------------------- */

export function PharmacySalesView() {
  const [period, setPeriod] = useState<'This week' | 'Last week'>('This week');
  const top = [
    { name: 'Amoxil 500', share: 84 },
    { name: 'Paracetamol Forte', share: 71 },
    { name: 'Vitamin D3 Daily', share: 58 },
    { name: 'Ventolin Inhaler', share: 46 },
  ];
  return (
    <>
      <PageHeading title="Sales" description="Revenue by day and the products that sell best.">
        <SelectMenu label="Period" value={period} options={['This week', 'Last week'] as const} onChange={setPeriod} className="w-40" align="right" />
      </PageHeading>
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <DashboardCard index={0} label="Revenue" value="$52,380" delta={{ value: '+6.4% vs Sep', up: true }} icon={Wallet} />
        <DashboardCard index={1} label="Prescriptions" value="1,284" delta={{ value: '+4.1%', up: true }} icon={ShieldCheck} tone="emerald" />
        <DashboardCard index={2} label="Average basket" value="$38.20" delta={{ value: '+$1.40', up: true }} icon={Package} tone="slate" />
        <DashboardCard index={3} label="Delivered" value="94%" delta={{ value: 'on time', up: true }} icon={Truck} tone="amber" />
      </div>
      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        <Panel index={4} title="Revenue by day (USD, thousands)" className="lg:col-span-2"><BarChart data={SALES_WEEK} label="Revenue by day" highlight={5} className="h-48" /></Panel>
        <Panel index={5} title="Top products">
          <ul className="space-y-4">
            {top.map((p) => (
              <li key={p.name}>
                <div className="mb-1.5 flex justify-between text-sm"><span className="font-medium text-slate-900">{p.name}</span><span className="tabular-nums text-slate-500">{p.share}% of sales</span></div>
                <ProgressBar value={p.share} tone="emerald" />
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}

/* ---------------------------------- Reports ---------------------------------- */

export function PharmacyReportsView() {
  const rows = [
    { label: 'Prescription refills completed', value: 86 },
    { label: 'Orders delivered on time', value: 94 },
    { label: 'Stock accuracy on audit', value: 98 },
    { label: 'Patients with reminders on', value: 61 },
  ];
  return (
    <>
      <PageHeading title="Reports" description="Monthly performance across dispensing, delivery and stock." />
      <Panel index={0} title="October performance">
        <ul className="space-y-5">
          {rows.map((r) => (
            <li key={r.label}>
              <div className="mb-1.5 flex items-center justify-between text-sm"><span className="text-slate-700">{r.label}</span><span className="flex items-center gap-1 font-semibold tabular-nums text-slate-900"><Check className="size-3.5 text-[color:var(--demo-good-ink)]" aria-hidden /> {r.value}%</span></div>
              <ProgressBar value={r.value} tone={r.value >= 90 ? 'emerald' : 'blue'} />
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
      <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={() => setOn((v) => !v)} className={cn('relative h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]', on ? 'bg-[var(--demo-accent)]' : 'bg-slate-300')}>
        <span aria-hidden className={cn('absolute top-0.5 size-5 rounded-full bg-white shadow transition-[left]', on ? 'left-[1.4rem]' : 'left-0.5')} />
      </button>
    </div>
  );
}

export function PharmacySettingsView() {
  return (
    <>
      <PageHeading title="Settings" description="Pharmacy details, safety checks and patient reminders." />
      <div className="grid gap-3 lg:grid-cols-2">
        <Panel index={0} title="Safety checks">
          <div className="divide-y divide-slate-100">
            <Toggle label="Pharmacist sign-off" description="Every prescription is verified before it is dispensed." defaultOn />
            <Toggle label="Interaction warnings" description="Flag known drug interactions at the point of sale." defaultOn />
            <Toggle label="Expiry blocking" description="Stop selling batches that have expired." defaultOn />
          </div>
        </Panel>
        <Panel index={1} title="Patient reminders">
          <div className="divide-y divide-slate-100">
            <Toggle label="Dose reminders" description="Remind patients at each scheduled dose time." defaultOn />
            <Toggle label="Refill reminders" description="Text patients 3 days before a refill is due." defaultOn />
            <Toggle label="Low stock alerts" description="Notify staff when an item reaches its reorder point." />
          </div>
        </Panel>
      </div>
    </>
  );
}
