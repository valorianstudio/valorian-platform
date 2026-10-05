'use client';

import { BarChart3, Check, CreditCard, Package, ShoppingBag, Tag, TrendingUp, Users, Wallet, Search, AlertTriangle } from 'lucide-react';
import { useMemo, useState } from 'react';
import { AreaChart, BarChart, Donut } from '@/components/demos/shared/charts';
import { DashboardCard, Panel } from '@/components/demos/shared/dashboard-card';
import { Avatar, PageHeading, Pill, ProgressBar, SelectMenu, Tabs } from '@/components/demos/shared/app-ui';
import { CATEGORY_MIX, CUSTOMERS, DISCOUNTS, ORDERS, PRODUCTS, REVENUE_MONTHS, SALES_WEEK, STOCK, formatPrice } from '@/data/clothing/catalog';
import type { Order } from '@/data/clothing/catalog';
import { cn } from '@/lib/cn';
import { GarmentArt } from './garment-art';

const ORDER_STATUS: Order['status'][] = ['Placed', 'Packed', 'Shipped', 'Delivered', 'Returned'];
const NEXT: Partial<Record<Order['status'], Order['status']>> = { Placed: 'Packed', Packed: 'Shipped', Shipped: 'Delivered' };
const tone = (s: string) => (['Delivered', 'Active', 'VIP'].includes(s) ? 'green' : ['Returned', 'Low'].includes(s) ? 'red' : ['Placed', 'Packed', 'Shipped', 'Loyal'].includes(s) ? 'blue' : 'slate');

/* ---------------------------------- Dashboard ---------------------------------- */

export function AdminDashboardHome() {
  return (
    <>
      <PageHeading title="Dashboard" description="Autumn Edit is outperforming last season by 18%." />
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <DashboardCard index={0} label="Total sales" value="$284k" delta={{ value: '+8.4% vs Sep', up: true }} icon={TrendingUp} />
        <DashboardCard index={1} label="Orders" value="2,941" delta={{ value: '+212 this week', up: true }} icon={ShoppingBag} tone="emerald" />
        <DashboardCard index={2} label="Customers" value="18,206" delta={{ value: '+6.1%', up: true }} icon={Users} tone="slate" />
        <DashboardCard index={3} label="Revenue (Oct)" value="$112,640" delta={{ value: '+5.2% MTD', up: true }} icon={Wallet} tone="amber" />
      </div>
      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        <Panel index={4} title="Sales this week (USD, thousands)" className="lg:col-span-2">
          <BarChart data={SALES_WEEK} label="Sales by day" highlight={5} className="h-40" />
        </Panel>
        <Panel index={5} title="Inventory status">
          <div className="flex items-center gap-4 lg:flex-col lg:items-start xl:flex-row xl:items-center">
            <Donut label="Inventory status" segments={[{ label: 'In stock', value: 81, tone: 'emerald' }, { label: 'Low', value: 13, tone: 'amber' }, { label: 'Out', value: 6, tone: 'slate' }]} size={104}>
              <span>
                <span className="block text-lg font-semibold tabular-nums text-slate-900">81%</span>
                <span className="block text-[11px] text-slate-500">in stock</span>
              </span>
            </Donut>
            <ul className="space-y-2 text-sm">
              {[['In stock', '81%', 'bg-[var(--demo-good)]'], ['Low stock', '13%', 'bg-amber-500'], ['Out of stock', '6%', 'bg-slate-300']].map(([l, v, c]) => (
                <li key={l} className="flex items-center gap-2 text-slate-600"><span aria-hidden className={cn('size-2.5 rounded-full', c)} />{l}<span className="ml-auto pl-3 font-medium tabular-nums text-slate-900">{v}</span></li>
              ))}
            </ul>
          </div>
        </Panel>
        <Panel index={6} title="Revenue, last six months" className="lg:col-span-2">
          <AreaChart data={REVENUE_MONTHS} label="Revenue by month (USD thousands)" min={150} max={300} />
        </Panel>
        <Panel index={7} title="Recent orders">
          <ul className="space-y-3">
            {ORDERS.slice(0, 4).map((o) => (
              <li key={o.id} className="flex items-center gap-3">
                <Avatar name={o.customer} size="sm" />
                <span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium text-slate-900">{o.customer}</span><span className="block text-xs text-slate-500">{o.id} · {o.date}</span></span>
                <span className="text-xs font-semibold tabular-nums text-slate-900">{formatPrice(o.total)}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}

/* ---------------------------------- Products ---------------------------------- */

export function AdminProductsView() {
  const [dept, setDept] = useState<'All' | 'Men' | 'Women' | 'Accessories'>('All');
  const [query, setQuery] = useState('');
  const [published, setPublished] = useState<Record<string, boolean>>({});
  const list = useMemo(() => PRODUCTS.filter((p) => (dept === 'All' || p.department === dept) && p.name.toLowerCase().includes(query.trim().toLowerCase())), [dept, query]);
  return (
    <>
      <PageHeading title="Products" description={`${list.length} of ${PRODUCTS.length} products shown`}>
        <button type="button" className="inline-flex h-9 items-center gap-2 rounded-lg bg-[var(--demo-accent)] px-3.5 text-sm font-semibold text-white hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]">+ New product</button>
      </PageHeading>
      <div className="mb-3 flex flex-wrap items-center gap-2.5">
        <label className="relative min-w-48 flex-1 sm:max-w-xs">
          <span className="sr-only">Search products</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products" className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm placeholder:text-slate-400 focus:border-[color:var(--demo-accent)] focus:outline-2 focus:outline-[color:var(--demo-accent)]" />
        </label>
        <div className="ml-auto"><Tabs label="Department" value={dept} onChange={setDept} tabs={(['All', 'Men', 'Women', 'Accessories'] as const).map((d) => ({ id: d, label: d }))} /></div>
      </div>
      <div className="demo-rise overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50 text-xs font-medium text-slate-500">
            <tr><th scope="col" className="px-4 py-3">Product</th><th scope="col" className="px-4 py-3">Department</th><th scope="col" className="px-4 py-3">Price</th><th scope="col" className="px-4 py-3">Stock</th><th scope="col" className="px-4 py-3">Status</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {list.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/70">
                <td className="px-4 py-3"><span className="flex items-center gap-3"><span className="size-10 shrink-0 rounded-lg bg-[var(--demo-accent-soft)] p-1"><GarmentArt art={p.art} colour={p.colours[0].hex === '#111111' ? '#2b2b2b' : p.colours[0].hex} label={p.name} className="size-full" /></span><span className="font-medium text-slate-900">{p.name}</span></span></td>
                <td className="px-4 py-3 text-slate-600">{p.department}</td>
                <td className="px-4 py-3 tabular-nums text-slate-700">{formatPrice(p.price)}</td>
                <td className="px-4 py-3 tabular-nums text-slate-700">{p.stock}</td>
                <td className="px-4 py-3">
                  <button type="button" aria-pressed={published[p.id] ?? true} onClick={() => setPublished((s) => ({ ...s, [p.id]: !(s[p.id] ?? true) }))} className="focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)] rounded-full">
                    <Pill tone={(published[p.id] ?? true) ? 'green' : 'slate'}>{(published[p.id] ?? true) ? 'Published' : 'Hidden'}</Pill>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ---------------------------------- Orders ---------------------------------- */

export function AdminOrdersView() {
  const [status, setStatus] = useState<'All' | Order['status']>('All');
  const [channel, setChannel] = useState<'All channels' | 'Website' | 'App'>('All channels');
  const [overrides, setOverrides] = useState<Record<string, Order['status']>>({});
  const orders = ORDERS.map((o) => ({ ...o, status: overrides[o.id] ?? o.status }));
  const list = orders.filter((o) => (status === 'All' || o.status === status) && (channel === 'All channels' || o.channel === channel));
  const count = (s: Order['status']) => orders.filter((o) => o.status === s).length;
  return (
    <>
      <PageHeading title="Orders" description="Move orders through packing, shipping and delivery." />
      <div className="mb-3 flex flex-wrap items-center gap-2.5">
        <Tabs label="Order status" value={status} onChange={setStatus} tabs={[{ id: 'All', label: 'All', count: orders.length }, ...ORDER_STATUS.map((s) => ({ id: s, label: s, count: count(s) }))]} />
        <div className="ml-auto"><SelectMenu label="Channel" value={channel} options={['All channels', 'Website', 'App'] as const} onChange={setChannel} className="w-36" align="right" /></div>
      </div>
      <div className="demo-rise overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50 text-xs font-medium text-slate-500">
            <tr><th scope="col" className="px-4 py-3">Order</th><th scope="col" className="px-4 py-3">Customer</th><th scope="col" className="px-4 py-3">Channel</th><th scope="col" className="px-4 py-3">Total</th><th scope="col" className="px-4 py-3">Status</th><th scope="col" className="px-4 py-3"><span className="sr-only">Action</span></th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {list.map((o) => (
              <tr key={o.id} className="hover:bg-slate-50/70">
                <td className="px-4 py-3 font-medium text-slate-900">{o.id}<span className="block text-xs font-normal text-slate-500">{o.date} · {o.items} items</span></td>
                <td className="px-4 py-3 text-slate-700">{o.customer}</td>
                <td className="px-4 py-3 text-slate-600">{o.channel}</td>
                <td className="px-4 py-3 tabular-nums text-slate-900">{formatPrice(o.total)}</td>
                <td className="px-4 py-3"><Pill tone={tone(o.status)}>{o.status}</Pill></td>
                <td className="px-4 py-3 text-right">
                  {NEXT[o.status] && <button type="button" onClick={() => setOverrides((s) => ({ ...s, [o.id]: NEXT[o.status]! }))} className="rounded-lg bg-[var(--demo-accent)] px-2.5 py-1 text-xs font-semibold text-white hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]">Mark {NEXT[o.status]!.toLowerCase()}</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && <p className="py-10 text-center text-sm text-slate-500">No orders match.</p>}
      </div>
    </>
  );
}

/* ---------------------------------- Customers ---------------------------------- */

export function AdminCustomersView() {
  const [tier, setTier] = useState<'All' | 'VIP' | 'Loyal' | 'New'>('All');
  const list = CUSTOMERS.filter((c) => tier === 'All' || c.tier === tier);
  return (
    <>
      <PageHeading title="Customers" description="Who buys, how often and how much." />
      <div className="mb-3"><Tabs label="Customer tier" value={tier} onChange={setTier} tabs={(['All', 'VIP', 'Loyal', 'New'] as const).map((t) => ({ id: t, label: t }))} /></div>
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((c, i) => (
          <li key={c.id} className="demo-rise rounded-xl border border-slate-200 bg-white p-4 transition-shadow hover:shadow-md" style={{ ['--i' as string]: i }}>
            <div className="flex items-center gap-3"><Avatar name={c.name} /><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-900">{c.name}</p><p className="text-xs text-slate-500">{c.city}</p></div><Pill tone={tone(c.tier)}>{c.tier}</Pill></div>
            <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 text-xs">
              <div><p className="text-slate-500">Orders</p><p className="font-semibold tabular-nums text-slate-900">{c.orders}</p></div>
              <div><p className="text-slate-500">Lifetime spend</p><p className="font-semibold tabular-nums text-slate-900">{formatPrice(c.spend)}</p></div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

/* ---------------------------------- Inventory ---------------------------------- */

export function AdminInventoryView() {
  const [restocked, setRestocked] = useState<Record<string, boolean>>({});
  const rows = STOCK.map((s) => ({ ...s, level: restocked[s.id] ? 40 : s.stock, low: !restocked[s.id] && s.stock <= s.reorderAt }));
  const alerts = rows.filter((r) => r.low);
  return (
    <>
      <PageHeading title="Inventory" description="Stock on hand against the reorder point." />
      {alerts.length > 0 && <div role="status" className="demo-rise mb-3 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-sm text-amber-900"><AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden /><p><span className="font-semibold">{alerts.length} products are below their reorder point.</span></p></div>}
      <div className="demo-rise overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full min-w-[36rem] text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50 text-xs font-medium text-slate-500">
            <tr><th scope="col" className="px-4 py-3">Product</th><th scope="col" className="px-4 py-3">SKU</th><th scope="col" className="px-4 py-3">Units</th><th scope="col" className="px-4 py-3">Level</th><th scope="col" className="px-4 py-3">Action</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="px-4 py-3 font-medium text-slate-900">{r.name}</td>
                <td className="px-4 py-3 font-mono text-xs text-slate-500">{r.sku}</td>
                <td className="px-4 py-3 tabular-nums text-slate-700">{r.level}</td>
                <td className="w-40 px-4 py-3"><ProgressBar value={Math.min(100, (r.level / 60) * 100)} tone={r.low ? 'blue' : 'emerald'} /></td>
                <td className="px-4 py-3">
                  {r.low ? <button type="button" onClick={() => setRestocked((s) => ({ ...s, [r.id]: true }))} className="rounded-lg bg-[var(--demo-accent)] px-2.5 py-1 text-xs font-semibold text-white hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]">Restock</button> : restocked[r.id] ? <Pill tone="green">Restocked</Pill> : <Pill tone="green">OK</Pill>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ---------------------------------- Discounts ---------------------------------- */

export function AdminDiscountsView() {
  const [active, setActive] = useState<Record<string, boolean>>(() => Object.fromEntries(DISCOUNTS.map((d) => [d.code, d.active])));
  return (
    <>
      <PageHeading title="Discounts" description="Codes and campaigns. Switch a code on or off instantly." />
      <ul className="grid gap-3 md:grid-cols-2">
        {DISCOUNTS.map((d, i) => (
          <li key={d.code} className="demo-rise flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4" style={{ ['--i' as string]: i }}>
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[var(--demo-good-soft)] text-[color:var(--demo-good-ink)]"><Tag className="size-5" aria-hidden /></span>
            <div className="min-w-0 flex-1">
              <p className="font-mono text-sm font-semibold text-slate-900">{d.code}</p>
              <p className="truncate text-xs text-slate-500">{d.label}</p>
              <p className="mt-1 text-xs text-slate-600">{d.uses.toLocaleString('en-US')} uses · {d.ends}</p>
            </div>
            <button type="button" role="switch" aria-checked={!!active[d.code]} aria-label={`${d.code} active`} onClick={() => setActive((s) => ({ ...s, [d.code]: !s[d.code] }))} className={cn('relative h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]', active[d.code] ? 'bg-[var(--demo-accent)]' : 'bg-slate-300')}>
              <span aria-hidden className={cn('absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow transition-transform duration-200', active[d.code] && 'translate-x-5')} />
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

/* ---------------------------------- Analytics & settings ---------------------------------- */

export function AdminAnalyticsView() {
  return (
    <>
      <PageHeading title="Analytics" description="Where sales come from and what converts." />
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <DashboardCard index={0} label="Conversion rate" value="3.8%" delta={{ value: '+0.4 pts', up: true }} icon={BarChart3} />
        <DashboardCard index={1} label="Average order" value="$196" icon={CreditCard} tone="emerald" />
        <DashboardCard index={2} label="Return rate" value="4.1%" delta={{ value: '-0.6 pts', up: true }} icon={Package} tone="amber" />
        <DashboardCard index={3} label="Repeat customers" value="46%" icon={Check} tone="slate" />
      </div>
      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        <Panel index={4} title="Sales by department" className="lg:col-span-2"><BarChart data={CATEGORY_MIX.map((c) => ({ label: c.label, value: c.value }))} label="Share of sales by department" unit="%" highlight={0} className="h-40" /></Panel>
        <Panel index={5} title="Channel mix"><div className="flex items-center gap-4"><Donut label="Channel mix" segments={[{ label: 'Website', value: 68, tone: 'blue' }, { label: 'App', value: 32, tone: 'emerald' }]} size={104}><span className="text-sm font-semibold text-slate-900">68%</span></Donut><p className="text-xs text-slate-600">Website 68%<br />App 32%</p></div></Panel>
      </div>
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

export function AdminSettingsView() {
  return (
    <>
      <PageHeading title="Settings" description="Store details, checkout and delivery rules." />
      <div className="grid gap-3 lg:grid-cols-2">
        <Panel title="Store" index={0}>
          <dl className="space-y-3 text-sm">
            {[['Store name', 'Maison Vale'], ['Currency', 'USD'], ['Free delivery from', '$200']].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0"><dt className="text-slate-500">{k}</dt><dd className="font-medium text-slate-900">{v}</dd></div>
            ))}
          </dl>
        </Panel>
        <Panel title="Checkout" index={1}>
          <ul className="divide-y divide-slate-100">
            <Switch label="Guest checkout" description="Let shoppers pay without an account." defaultOn />
            <Switch label="Wallet payments" description="Show one-tap wallet buttons at checkout." defaultOn />
            <Switch label="Free returns" description="Offer prepaid return labels within 30 days." defaultOn />
            <Switch label="Back-in-stock alerts" description="Email customers when a saved item returns." />
          </ul>
        </Panel>
      </div>
    </>
  );
}
