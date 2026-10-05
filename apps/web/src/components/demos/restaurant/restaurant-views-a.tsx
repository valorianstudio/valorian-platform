'use client';

import { Armchair, ChefHat, ReceiptText, Search, Star, TrendingUp, Users, Wallet } from 'lucide-react';
import { useMemo, useState } from 'react';
import { AreaChart, BarChart, Donut } from '@/components/demos/shared/charts';
import { DashboardCard, Panel } from '@/components/demos/shared/dashboard-card';
import { PageHeading, Pill, ProgressBar, SelectMenu, Tabs } from '@/components/demos/shared/app-ui';
import { AREAS, CATEGORY_MIX, CUSTOMER_GROWTH, DASHBOARD_STATS, HOURLY_SALES, MENU, MENU_CATEGORIES, ORDERS, ORDER_FLOW, ORDER_TYPES, POPULAR, TABLES } from '@/data/restaurant/app';
import type { DiningTable, MenuItem, Order, OrderStatus, TableStatus } from '@/data/restaurant/app';
import { cn } from '@/lib/cn';
import { DishArt } from './dish-art';
import { OrderCard, tone } from './restaurant-cards';

const money = (value: number) => `$${value.toLocaleString('en-US')}`;

/* ---------------------------------- Dashboard ---------------------------------- */

export function RestaurantDashboardHome() {
  const { sales, orders, activeTables, tablesTotal, revenue } = DASHBOARD_STATS;
  return (
    <>
      <PageHeading title="Dashboard" description="Friday service at Ember & Oak. Here is how tonight is going." />
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <DashboardCard index={0} label="Today's sales" value={money(sales)} delta={{ value: '+12.4% vs last Fri', up: true }} icon={Wallet} />
        <DashboardCard index={1} label="Orders" value={String(orders)} delta={{ value: '+9 in the last hour', up: true }} icon={ReceiptText} tone="emerald" />
        <DashboardCard index={2} label="Active tables" value={`${activeTables} / ${tablesTotal}`} icon={Armchair} tone="slate" />
        <DashboardCard index={3} label="Revenue (Oct)" value={money(revenue)} delta={{ value: '+8.7% vs Sep', up: true }} icon={TrendingUp} tone="amber" />
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        <Panel index={4} title="Sales by hour (USD)" className="lg:col-span-2" action={<Pill tone="green">Peak 20:00</Pill>}>
          <BarChart data={HOURLY_SALES} label="Sales by hour" highlight={6} className="h-40" />
        </Panel>
        <Panel index={5} title="Sales mix">
          <div className="flex items-center gap-4 lg:flex-col lg:items-start xl:flex-row xl:items-center">
            <Donut label="Sales mix by category" segments={CATEGORY_MIX} size={104}>
              <span>
                <span className="block text-lg font-semibold tabular-nums text-slate-900">128</span>
                <span className="block text-[11px] text-slate-500">orders</span>
              </span>
            </Donut>
            <ul className="space-y-2 text-sm">
              {CATEGORY_MIX.map((item) => (
                <li key={item.label} className="flex items-center gap-2 text-slate-600">
                  <span aria-hidden className={cn('size-2.5 rounded-full', item.tone === 'emerald' ? 'bg-[var(--demo-good)]' : item.tone === 'blue' ? 'bg-[var(--demo-accent)]' : item.tone === 'amber' ? 'bg-amber-500' : 'bg-slate-300')} />
                  {item.label}
                  <span className="ml-auto pl-3 font-medium tabular-nums text-slate-900">{item.value}%</span>
                </li>
              ))}
            </ul>
          </div>
        </Panel>
        <Panel index={6} title="Customer growth" className="lg:col-span-2" action={<Pill tone="green">+1,310 guests</Pill>}>
          <AreaChart data={CUSTOMER_GROWTH} label="Returning guests per month" min={700} max={1400} />
        </Panel>
        <Panel index={7} title="Popular dishes">
          <ul className="space-y-3.5">
            {POPULAR.map((dish) => (
              <li key={dish.name}>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="truncate font-medium text-slate-900">{dish.name}</span>
                  <span className="tabular-nums text-slate-500">{dish.sold}</span>
                </div>
                <ProgressBar value={(dish.sold / 50) * 100} tone="emerald" />
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}

/* ---------------------------------- Orders ---------------------------------- */

export function RestaurantOrdersView() {
  const [tab, setTab] = useState<'All' | OrderStatus>('All');
  const [type, setType] = useState<(typeof ORDER_TYPES)[number]>('All types');
  const [overrides, setOverrides] = useState<Record<string, OrderStatus>>({});
  const orders: Order[] = ORDERS.map((o) => ({ ...o, status: overrides[o.id] ?? o.status }));
  const base = orders.filter((o) => type === 'All types' || o.type === type);
  const list = base.filter((o) => tab === 'All' || o.status === tab);
  const count = (s: OrderStatus) => base.filter((o) => o.status === s).length;

  return (
    <>
      <PageHeading title="Orders" description="Every order from the floor, the counter and delivery.">
        <SelectMenu label="Order type" value={type} options={ORDER_TYPES} onChange={setType} className="w-40" align="right" />
      </PageHeading>
      <Tabs label="Order status" value={tab} onChange={setTab} tabs={[{ id: 'All', label: 'All', count: base.length }, ...(['New', 'Preparing', 'Ready', 'Served'] as const).map((s) => ({ id: s, label: s, count: count(s) }))]} />
      <ul key={`${tab}-${type}`} className="mt-4 grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
        {list.map((order, i) => (
          <li key={order.id}>
            <OrderCard order={order} index={i} onAdvance={(o) => ORDER_FLOW[o.status] && setOverrides((c) => ({ ...c, [o.id]: ORDER_FLOW[o.status]!.to }))} />
          </li>
        ))}
        {list.length === 0 && <li className="rounded-xl border border-dashed border-slate-300 bg-white py-10 text-center text-sm text-slate-500 md:col-span-2">No orders here right now.</li>}
      </ul>
    </>
  );
}

/* ---------------------------------- Menu ---------------------------------- */

export function RestaurantMenuView() {
  const [tab, setTab] = useState<(typeof MENU_CATEGORIES)[number]>('All');
  const [query, setQuery] = useState('');
  const [off, setOff] = useState<Record<string, boolean>>(() => Object.fromEntries(MENU.map((m) => [m.id, !m.available])));
  const list = useMemo(() => MENU.filter((m) => (tab === 'All' || m.category === tab) && m.name.toLowerCase().includes(query.trim().toLowerCase())), [tab, query]);

  return (
    <>
      <PageHeading title="Menu" description={`${MENU.length} dishes. Switch a dish off when the kitchen runs out.`}>
        <button type="button" className="inline-flex h-9 items-center gap-2 rounded-lg bg-[var(--demo-accent)] px-3.5 text-sm font-semibold text-white hover:brightness-125 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]">
          + Add dish
        </button>
      </PageHeading>
      <div className="mb-4 flex flex-wrap items-center gap-2.5">
        <Tabs label="Menu category" value={tab} onChange={setTab} tabs={MENU_CATEGORIES.map((c) => ({ id: c, label: c }))} />
        <label className="relative ml-auto min-w-44 flex-1 sm:max-w-56">
          <span className="sr-only">Search the menu</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search dishes" className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[color:var(--demo-accent)] focus:outline-2 focus:outline-[color:var(--demo-accent)]" />
        </label>
      </div>
      <ul key={tab} className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((item: MenuItem, i) => (
          <li key={item.id} className="demo-rise overflow-hidden rounded-xl border border-slate-200 bg-white transition-shadow hover:shadow-md" style={{ ['--i' as string]: i }}>
            <DishArt art={item.art} label={item.name} className={cn('h-32', off[item.id] && 'opacity-40 grayscale')} />
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                <p className="text-sm font-semibold tabular-nums text-slate-900">${item.price}</p>
              </div>
              <p className="mt-1 line-clamp-2 text-xs text-slate-500">{item.description}</p>
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <Pill tone="slate">{item.category}</Pill>
                {item.tag && <Pill tone="amber">{item.tag}</Pill>}
                <span className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-slate-700">
                  <Star className="size-3.5 fill-amber-400 text-amber-400" aria-hidden /> {item.rating}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="text-xs text-slate-500">{off[item.id] ? 'Sold out' : `${item.prep} min prep`}</span>
                <button type="button" role="switch" aria-checked={!off[item.id]} aria-label={`${item.name} available`} onClick={() => setOff((c) => ({ ...c, [item.id]: !c[item.id] }))} className={cn('relative h-6 w-11 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]', off[item.id] ? 'bg-slate-300' : 'bg-[var(--demo-good)]')}>
                  <span aria-hidden className={cn('absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow transition-transform duration-200', !off[item.id] && 'translate-x-5')} />
                </button>
              </div>
            </div>
          </li>
        ))}
        {list.length === 0 && <li className="rounded-xl border border-dashed border-slate-300 bg-white py-10 text-center text-sm text-slate-500 sm:col-span-2 xl:col-span-3">No dishes match your search.</li>}
      </ul>
    </>
  );
}

/* ---------------------------------- Tables ---------------------------------- */

const TABLE_STYLE: Record<TableStatus, string> = {
  Available: 'border-[color:var(--demo-good)] bg-[var(--demo-good-soft)] text-slate-900',
  Occupied: 'border-slate-900 bg-slate-900 text-white',
  Reserved: 'border-amber-500 bg-amber-50 text-slate-900',
  Cleaning: 'border-dashed border-slate-300 bg-slate-50 text-slate-500',
};

const TABLE_ACTION: Record<TableStatus, { to: TableStatus; label: string }> = {
  Available: { to: 'Occupied', label: 'Seat guests' },
  Occupied: { to: 'Cleaning', label: 'Close and clear' },
  Reserved: { to: 'Occupied', label: 'Seat reservation' },
  Cleaning: { to: 'Available', label: 'Mark ready' },
};

export function RestaurantTablesView() {
  const [area, setArea] = useState<(typeof AREAS)[number]>('All areas');
  const [status, setStatus] = useState<Record<string, TableStatus>>({});
  const [selected, setSelected] = useState('T7');
  const tables: DiningTable[] = TABLES.map((t) => ({ ...t, status: status[t.id] ?? t.status }));
  const shown = tables.filter((t) => area === 'All areas' || t.area === area);
  const table = tables.find((t) => t.id === selected) ?? tables[0];
  const count = (s: TableStatus) => tables.filter((t) => t.status === s).length;
  const action = TABLE_ACTION[table.status];

  return (
    <>
      <PageHeading title="Tables" description="Live floor plan. Select a table to seat, clear or reset it.">
        <SelectMenu label="Area" value={area} options={AREAS} onChange={setArea} className="w-40" align="right" />
      </PageHeading>
      <div className="mb-3 flex flex-wrap gap-2">
        {(['Available', 'Occupied', 'Reserved', 'Cleaning'] as const).map((s) => (
          <span key={s} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700">
            <span aria-hidden className={cn('size-2.5 rounded-full border', s === 'Available' ? 'border-[color:var(--demo-good)] bg-[var(--demo-good)]' : s === 'Occupied' ? 'border-slate-900 bg-slate-900' : s === 'Reserved' ? 'border-amber-500 bg-amber-400' : 'border-dashed border-slate-400 bg-slate-100')} />
            {s} <span className="tabular-nums text-slate-500">{count(s)}</span>
          </span>
        ))}
      </div>
      <div className="grid gap-3 xl:grid-cols-[1fr_17rem]">
        <ul key={area} className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
          {shown.map((t, i) => (
            <li key={t.id} className="demo-rise" style={{ ['--i' as string]: i }}>
              <button type="button" aria-pressed={t.id === selected} onClick={() => setSelected(t.id)} className={cn('flex aspect-[5/4] w-full flex-col justify-between rounded-2xl border-2 p-3 text-left transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]', TABLE_STYLE[t.status], t.id === selected && 'ring-2 ring-offset-2 ring-amber-500')}>
                <span className="flex items-center justify-between">
                  <span className="text-base font-semibold">{t.id}</span>
                  <span className="inline-flex items-center gap-1 text-xs opacity-80">
                    <Users className="size-3" aria-hidden /> {t.seats}
                  </span>
                </span>
                <span className="text-xs font-medium">
                  {t.status}
                  {t.status === 'Occupied' && t.guests ? ` · ${t.guests} guests` : ''}
                  {t.status === 'Reserved' && t.since ? ` · ${t.since}` : ''}
                </span>
              </button>
            </li>
          ))}
        </ul>
        <Panel title={`Table ${table.id}`} index={2} className="self-start" action={<Pill tone={tone(table.status)}>{table.status}</Pill>}>
          <dl className="space-y-2.5 text-sm">
            {[
              ['Area', table.area],
              ['Seats', String(table.seats)],
              ['Guests', table.guests ? String(table.guests) : '—'],
              ['Server', table.server ?? '—'],
              ['Since', table.since ?? '—'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 border-b border-slate-100 pb-2.5 last:border-0 last:pb-0">
                <dt className="text-slate-500">{k}</dt>
                <dd className="font-medium text-slate-900">{v}</dd>
              </div>
            ))}
          </dl>
          <button type="button" onClick={() => setStatus((c) => ({ ...c, [table.id]: action.to }))} className="mt-4 h-10 w-full rounded-lg bg-slate-900 text-sm font-semibold text-white hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]">
            {action.label}
          </button>
          <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
            <ChefHat className="size-3.5" aria-hidden /> Updates sync to the kitchen display.
          </p>
        </Panel>
      </div>
    </>
  );
}
