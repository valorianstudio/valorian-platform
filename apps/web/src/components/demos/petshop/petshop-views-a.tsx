'use client';

import { Package, PawPrint, Search, ShoppingBag, Users, Wallet } from 'lucide-react';
import { useMemo, useState } from 'react';
import { AreaChart, BarChart, Donut } from '@/components/demos/shared/charts';
import { DashboardCard, Panel } from '@/components/demos/shared/dashboard-card';
import { Avatar, PageHeading, Pill, SelectMenu, Tabs } from '@/components/demos/shared/app-ui';
import { APPOINTMENTS, CUSTOMER_GROWTH, CUSTOMERS, DASHBOARD_STATS, PETS, PRODUCTS, SALES_WEEK, STOCK_MIX } from '@/data/petshop/catalog';
import type { Category, Pet } from '@/data/petshop/catalog';
import { cn } from '@/lib/cn';
import { PetCard, ProductCard, tone } from './petshop-cards';

/* ---------------------------------- Dashboard ---------------------------------- */

export function PetshopDashboardHome() {
  const { customers, products, appointmentsToday, orders, revenue } = DASHBOARD_STATS;
  return (
    <>
      <PageHeading title="Dashboard" description="Good morning. Two grooms and a vet visit are on today’s schedule." />
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-5">
        <DashboardCard index={0} label="Total customers" value={customers.toLocaleString('en-US')} delta={{ value: '+29 this month', up: true }} icon={Users} />
        <DashboardCard index={1} label="Available products" value={String(products)} icon={Package} tone="emerald" />
        <DashboardCard index={2} label="Today's appointments" value={String(appointmentsToday)} delta={{ value: '3 checked in', up: true }} icon={PawPrint} tone="amber" />
        <DashboardCard index={3} label="Orders" value={String(orders)} delta={{ value: '+12 today', up: true }} icon={ShoppingBag} tone="slate" />
        <DashboardCard index={4} label="Revenue (Oct)" value={`$${revenue.toLocaleString('en-US')}`} delta={{ value: '+7.2% vs Sep', up: true }} icon={Wallet} />
      </div>
      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        <Panel index={5} title="Sales this week (USD, thousands)" className="lg:col-span-2"><BarChart data={SALES_WEEK} label="Sales by day" highlight={5} className="h-40" /></Panel>
        <Panel index={6} title="Stock by category">
          <div className="flex items-center gap-4 lg:flex-col lg:items-start xl:flex-row xl:items-center">
            <Donut label="Stock by category" segments={STOCK_MIX} size={104}><span><span className="block text-lg font-semibold tabular-nums text-slate-900">186</span><span className="block text-[11px] text-slate-500">items</span></span></Donut>
            <ul className="space-y-2 text-sm">{STOCK_MIX.map((s) => <li key={s.label} className="flex items-center gap-2 text-slate-600"><span aria-hidden className={cn('size-2.5 rounded-full', s.tone === 'blue' ? 'bg-[var(--demo-good)]' : s.tone === 'emerald' ? 'bg-[var(--demo-accent)]' : s.tone === 'amber' ? 'bg-[var(--demo-orange)]' : 'bg-slate-300')} />{s.label}<span className="ml-auto pl-3 font-medium tabular-nums text-slate-900">{s.value}%</span></li>)}</ul>
          </div>
        </Panel>
        <Panel index={7} title="Customer growth" className="lg:col-span-2" action={<Pill tone="green">+180 since April</Pill>}><AreaChart data={CUSTOMER_GROWTH} label="Customers per month" min={380} max={620} /></Panel>
        <Panel index={8} title="Today's appointments">
          <ul className="space-y-3">{APPOINTMENTS.slice(0, 4).map((a) => <li key={a.id} className="flex items-center gap-3"><span className="w-11 text-xs font-semibold tabular-nums text-[color:var(--demo-accent)]">{a.time}</span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium text-slate-900">{a.pet}</span><span className="block truncate text-xs text-slate-500">{a.kind}</span></span><Pill tone={tone(a.status)}>{a.status}</Pill></li>)}</ul>
        </Panel>
      </div>
    </>
  );
}

/* ---------------------------------- Pets ---------------------------------- */

function PetProfile({ pet, onClose }: { pet: Pet; onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-[1px]" onClick={onClose}>
      <aside role="dialog" aria-modal="true" aria-label={`${pet.name} profile`} className="demo-slide flex h-full w-full max-w-md flex-col overflow-y-auto bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h3 className="text-sm font-semibold text-slate-900">Pet profile</h3>
          <button type="button" onClick={onClose} aria-label="Close profile" className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]">Close</button>
        </div>
        <div className="px-5 pt-5">
          <p className="text-xl font-semibold text-slate-900">{pet.name}</p>
          <p className="text-sm text-slate-500">{pet.breed} · {pet.species} · {pet.age} years · {pet.weight} kg</p>
          <div className="mt-3 flex flex-wrap gap-1.5"><Pill tone={pet.vaccinated ? 'green' : 'red'}>{pet.vaccinated ? 'Vaccinated' : 'Vaccination due'}</Pill>{pet.allergies.map((a) => <Pill key={a} tone="amber">Allergy: {a}</Pill>)}</div>
        </div>
        <dl className="mt-5 space-y-2.5 px-5 text-sm">
          <div className="flex justify-between gap-3 border-b border-slate-100 pb-2.5"><dt className="text-slate-500">Owner</dt><dd className="font-medium text-slate-900">{pet.owner}</dd></div>
          <div className="flex justify-between gap-3 border-b border-slate-100 pb-2.5"><dt className="text-slate-500">Next visit</dt><dd className="font-medium text-slate-900">{pet.next}</dd></div>
        </dl>
        <div className="px-5 py-5">
          <p className="text-xs font-semibold text-slate-500">Visit history</p>
          <ol className="mt-3 space-y-4 border-l border-slate-200 pl-4">{pet.visits.map((v) => <li key={v.date + v.note} className="relative"><span aria-hidden className="absolute -left-[1.4rem] top-1.5 size-2.5 rounded-full bg-[var(--demo-accent)] ring-4 ring-white" /><p className="text-xs text-slate-500">{v.date}</p><p className="text-sm text-slate-700">{v.note}</p></li>)}</ol>
        </div>
      </aside>
    </div>
  );
}

export function PetshopPetsView() {
  const [query, setQuery] = useState('');
  const [species, setSpecies] = useState<'All species' | Pet['species']>('All species');
  const [selected, setSelected] = useState<Pet | null>(null);
  const list = useMemo(() => PETS.filter((p) => (species === 'All species' || p.species === species) && (p.name + p.owner).toLowerCase().includes(query.trim().toLowerCase())), [query, species]);
  return (
    <>
      <PageHeading title="Pets" description={`${list.length} of ${PETS.length} pets shown`} />
      <div className="mb-4 flex flex-wrap items-center gap-2.5">
        <label className="relative min-w-48 flex-1 sm:max-w-xs">
          <span className="sr-only">Search pets</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search pets or owners" className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm placeholder:text-slate-400 focus:border-[color:var(--demo-accent)] focus:outline-2 focus:outline-[color:var(--demo-accent)]" />
        </label>
        <div className="ml-auto"><SelectMenu label="Species" value={species} options={['All species', 'Dog', 'Cat', 'Bird', 'Rabbit'] as const} onChange={setSpecies} className="w-40" align="right" /></div>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{list.map((p, i) => <li key={p.id}><PetCard pet={p} index={i} onOpen={() => setSelected(p)} /></li>)}</ul>
      {list.length === 0 && <p className="rounded-xl border border-dashed border-slate-300 bg-white py-10 text-center text-sm text-slate-500">No pets match.</p>}
      {selected && <PetProfile pet={selected} onClose={() => setSelected(null)} />}
    </>
  );
}

/* ---------------------------------- Customers ---------------------------------- */

export function PetshopCustomersView() {
  const [tier, setTier] = useState<'All' | 'Gold' | 'Regular' | 'New'>('All');
  const list = CUSTOMERS.filter((c) => tier === 'All' || c.tier === tier);
  return (
    <>
      <PageHeading title="Customers" description="Owners, their pets and what they buy." />
      <div className="mb-3"><Tabs label="Customer tier" value={tier} onChange={setTier} tabs={(['All', 'Gold', 'Regular', 'New'] as const).map((t) => ({ id: t, label: t }))} /></div>
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((c, i) => (
          <li key={c.id} className="demo-rise rounded-xl border border-slate-200 bg-white p-4 transition-shadow hover:shadow-md" style={{ ['--i' as string]: i }}>
            <div className="flex items-center gap-3"><Avatar name={c.name} /><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-900">{c.name}</p><p className="text-xs text-slate-500">{c.pets} pet{c.pets > 1 ? 's' : ''} · last visit {c.last}</p></div><Pill tone={tone(c.tier)}>{c.tier}</Pill></div>
            <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 text-xs"><div><p className="text-slate-500">Orders</p><p className="font-semibold tabular-nums text-slate-900">{c.orders}</p></div><div><p className="text-slate-500">Spend</p><p className="font-semibold tabular-nums text-slate-900">${c.spend.toLocaleString('en-US')}</p></div></div>
          </li>
        ))}
      </ul>
    </>
  );
}

/* ---------------------------------- Products ---------------------------------- */

const CATEGORY_OPTIONS: (Category | 'All')[] = ['All', 'Dogs', 'Cats', 'Birds', 'Accessories'];

export function PetshopProductsView() {
  const [category, setCategory] = useState<Category | 'All'>('All');
  const [stock, setStock] = useState<'All stock' | 'Low stock'>('All stock');
  const [query, setQuery] = useState('');
  const [cart, setCart] = useState<Record<string, number>>({});
  const list = PRODUCTS.filter((p) => (category === 'All' || p.category === category) && (stock === 'All stock' || p.stock <= p.reorderAt) && p.name.toLowerCase().includes(query.trim().toLowerCase()));
  const count = (c: Category | 'All') => PRODUCTS.filter((p) => c === 'All' || p.category === c).length;
  const items = Object.values(cart).reduce((a, b) => a + b, 0);
  return (
    <>
      <PageHeading title="Products" description={`${list.length} of ${PRODUCTS.length} products shown${items ? ` · ${items} added to a new order` : ''}`} />
      <div className="mb-3 flex flex-wrap items-center gap-2.5">
        <label className="relative min-w-48 flex-1 sm:max-w-xs">
          <span className="sr-only">Search products</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products" className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm placeholder:text-slate-400 focus:border-[color:var(--demo-accent)] focus:outline-2 focus:outline-[color:var(--demo-accent)]" />
        </label>
        <div className="ml-auto"><SelectMenu label="Stock" value={stock} options={['All stock', 'Low stock'] as const} onChange={setStock} className="w-36" align="right" /></div>
      </div>
      <div className="mb-4"><Tabs label="Product category" value={category} onChange={setCategory} tabs={CATEGORY_OPTIONS.map((c) => ({ id: c, label: c, count: count(c) }))} /></div>
      <ul key={`${category}-${stock}`} className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {list.map((p, i) => <li key={p.id}><ProductCard product={p} index={i} action={{ label: cart[p.id] ? `Added (${cart[p.id]})` : 'Add to order', onClick: () => setCart((c) => ({ ...c, [p.id]: (c[p.id] ?? 0) + 1 })) }} /></li>)}
      </ul>
      {list.length === 0 && <p className="rounded-xl border border-dashed border-slate-300 bg-white py-10 text-center text-sm text-slate-500">No products match.</p>}
    </>
  );
}

