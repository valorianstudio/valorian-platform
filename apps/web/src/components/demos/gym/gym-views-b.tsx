'use client';

import { AlertTriangle, Check, Clock, Dumbbell, FileText, Plus, Search, ShieldCheck, Users, Wallet } from 'lucide-react';
import { useState } from 'react';
import { BarChart, Donut, Ring } from '@/components/demos/shared/charts';
import { DashboardCard, Panel } from '@/components/demos/shared/dashboard-card';
import { Avatar, PageHeading, Pill, ProgressBar, SelectMenu, Tabs } from '@/components/demos/shared/app-ui';
import { EXERCISES, INVOICES, MEMBERS, PLANS, PLANS_WORKOUT, REVENUE_MONTHS, WEEK_ATTENDANCE } from '@/data/gym/app';
import type { Exercise, Invoice, InvoiceStatus, WorkoutPlan } from '@/data/gym/app';
import { cn } from '@/lib/cn';
import { tone } from './gym-cards';

const money = (value: number) => `$${value.toLocaleString('en-US')}`;

/* ---------------------------------- Workouts ---------------------------------- */

const MUSCLES = ['All', 'Legs', 'Chest', 'Back', 'Core', 'Cardio'] as const;

export function GymWorkoutsView() {
  const [tab, setTab] = useState<'plans' | 'library'>('plans');
  const [muscle, setMuscle] = useState<(typeof MUSCLES)[number]>('All');
  const [query, setQuery] = useState('');
  const [assigned, setAssigned] = useState<Record<string, boolean>>({});
  const exercises: Exercise[] = EXERCISES.filter((e) => (muscle === 'All' || e.muscle === muscle) && e.name.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <>
      <PageHeading title="Workout plans" description="Programmes you build once and assign to any member.">
        <button type="button" className="inline-flex h-9 items-center gap-2 rounded-lg bg-[var(--demo-accent)] px-3.5 text-sm font-semibold text-white hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]">
          <Plus className="size-4" aria-hidden /> New plan
        </button>
      </PageHeading>
      <Tabs label="Workout section" value={tab} onChange={setTab} tabs={[{ id: 'plans', label: 'Plans', count: PLANS_WORKOUT.length }, { id: 'library', label: 'Exercise library', count: EXERCISES.length }]} />
      <div key={tab} className="demo-rise mt-4">
        {tab === 'plans' ? (
          <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {PLANS_WORKOUT.map((plan: WorkoutPlan, i) => (
              <li key={plan.id} className="demo-rise flex flex-col rounded-xl border border-slate-200 bg-white p-4" style={{ ['--i' as string]: i }}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">{plan.name}</p>
                    <p className="text-xs text-slate-500">
                      {plan.weeks} weeks · {plan.sessions} sessions a week
                    </p>
                  </div>
                  <Pill tone="blue">{plan.level}</Pill>
                </div>
                <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
                  {plan.exercises.map((e) => (
                    <li key={e} className="flex items-center gap-2">
                      <Dumbbell className="size-3.5 text-slate-400" aria-hidden /> {e}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                  <span className="text-xs text-slate-500">{plan.members + (assigned[plan.id] ? 1 : 0)} members</span>
                  <button type="button" aria-pressed={!!assigned[plan.id]} onClick={() => setAssigned((s) => ({ ...s, [plan.id]: !s[plan.id] }))} className={cn('rounded-lg px-3 py-1.5 text-xs font-semibold focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]', assigned[plan.id] ? 'bg-[var(--demo-good-soft)] text-[color:var(--demo-good-ink)]' : 'bg-slate-900 text-white hover:bg-slate-700')}>
                    {assigned[plan.id] ? 'Assigned to Hannah' : 'Assign to member'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <>
            <div className="mb-3 flex flex-wrap items-center gap-2.5">
              <label className="relative min-w-48 flex-1 sm:max-w-xs">
                <span className="sr-only">Search exercises</span>
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search exercises" className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[color:var(--demo-accent)] focus:outline-2 focus:outline-[color:var(--demo-accent)]" />
              </label>
              <div className="ml-auto">
                <SelectMenu label="Muscle group" value={muscle} options={MUSCLES} onChange={setMuscle} className="w-36" align="right" />
              </div>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {exercises.map((e, i) => (
                <li key={e.id} className="demo-rise rounded-xl border border-slate-200 bg-white p-4 transition-shadow hover:shadow-md" style={{ ['--i' as string]: i }}>
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900">{e.name}</p>
                    <Pill tone={e.muscle === 'Cardio' ? 'amber' : 'blue'}>{e.muscle}</Pill>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    {e.equipment} · {e.sets}
                  </p>
                </li>
              ))}
              {exercises.length === 0 && <li className="rounded-xl border border-dashed border-slate-300 bg-white py-10 text-center text-sm text-slate-500 sm:col-span-2 xl:col-span-3">No exercises match.</li>}
            </ul>
          </>
        )}
      </div>
    </>
  );
}

/* ---------------------------------- Memberships ---------------------------------- */

export function GymMembershipsView() {
  const [editing, setEditing] = useState<string | null>(null);
  const [prices, setPrices] = useState<Record<string, number>>(() => Object.fromEntries(PLANS.map((p) => [p.name, p.price])));
  return (
    <>
      <PageHeading title="Memberships" description="Plans, prices and how many members are on each." />
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {PLANS.map((plan, i) => {
          const isEditing = editing === plan.name;
          return (
            <li key={plan.name} className={cn('demo-rise flex flex-col rounded-xl border bg-white p-4', plan.name === 'Standard' ? 'border-[color:var(--demo-accent)] ring-1 ring-[color:var(--demo-accent)]' : 'border-slate-200')} style={{ ['--i' as string]: i }}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900">{plan.name}</p>
                {plan.name === 'Standard' && <Pill tone="blue">Most popular</Pill>}
              </div>
              <div className="mt-3 flex items-baseline gap-1">
                {isEditing ? (
                  <>
                    <span className="text-sm text-slate-500">$</span>
                    <input
                      type="number"
                      min={1}
                      aria-label={`${plan.name} monthly price`}
                      value={prices[plan.name]}
                      onChange={(event) => setPrices((p) => ({ ...p, [plan.name]: Math.max(1, Number(event.target.value) || 1) }))}
                      className="h-10 w-24 rounded-lg border border-slate-300 px-2 text-2xl font-semibold tabular-nums text-slate-900 focus:border-[color:var(--demo-accent)] focus:outline-2 focus:outline-[color:var(--demo-accent)]"
                    />
                  </>
                ) : (
                  <span className="text-3xl font-semibold tabular-nums text-slate-900">${prices[plan.name]}</span>
                )}
                <span className="text-sm text-slate-500">/ month</span>
              </div>
              <p className="mt-2 text-xs text-slate-500">{plan.members} members</p>
              <ul className="mt-3 flex-1 space-y-1.5 text-xs text-slate-600">
                {plan.perks.map((perk) => (
                  <li key={perk} className="flex items-center gap-2">
                    <Check className="size-3.5 text-[color:var(--demo-good-ink)]" aria-hidden /> {perk}
                  </li>
                ))}
              </ul>
              <button type="button" onClick={() => setEditing(isEditing ? null : plan.name)} className="mt-4 h-9 rounded-lg border border-slate-300 text-xs font-semibold text-slate-900 hover:border-slate-900 focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]">
                {isEditing ? 'Save price' : 'Edit price'}
              </button>
            </li>
          );
        })}
      </ul>
    </>
  );
}

/* ---------------------------------- Payments ---------------------------------- */

export function GymPaymentsView() {
  const [tab, setTab] = useState<'All' | InvoiceStatus>('All');
  const [paid, setPaid] = useState<Record<string, boolean>>({});
  const invoices: Invoice[] = INVOICES.map((i) => (paid[i.id] ? { ...i, status: 'Paid' } : i));
  const sum = (s: InvoiceStatus) => invoices.filter((i) => i.status === s).reduce((t, i) => t + i.amount, 0);
  const list = invoices.filter((i) => tab === 'All' || i.status === tab);

  return (
    <>
      <PageHeading title="Payments" description="Invoices, direct debits and failed payments to follow up." />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <DashboardCard index={0} label="Collected" value={money(sum('Paid'))} delta={{ value: 'This month', up: true }} icon={Wallet} tone="emerald" />
        <DashboardCard index={1} label="Due" value={money(sum('Due'))} icon={Clock} />
        <DashboardCard index={2} label="Overdue" value={money(sum('Overdue'))} delta={{ value: 'Retry scheduled', up: false }} icon={AlertTriangle} tone="amber" />
      </div>
      <div className="mt-3 grid gap-3 xl:grid-cols-[1fr_1.7fr]">
        <Panel index={3} title="Revenue (USD, thousands)" className="self-start">
          <BarChart data={REVENUE_MONTHS} label="Revenue by month" highlight={5} className="h-36" />
          <div className="mt-4 flex items-center gap-4 border-t border-slate-100 pt-4">
            <Donut label="Payment status" segments={[{ label: 'Paid', value: 86, tone: 'emerald' }, { label: 'Due', value: 9, tone: 'amber' }, { label: 'Overdue', value: 5, tone: 'slate' }]} size={76} />
            <p className="text-xs text-slate-600">86% of invoices paid on time this month.</p>
          </div>
        </Panel>
        <Panel index={4} title="Invoices">
          <Tabs label="Invoice status" value={tab} onChange={setTab} tabs={(['All', 'Paid', 'Due', 'Overdue'] as const).map((t) => ({ id: t, label: t }))} />
          <ul key={tab} className="mt-3 divide-y divide-slate-100">
            {list.map((inv, i) => (
              <li key={inv.id} className="demo-rise flex flex-wrap items-center gap-3 py-3" style={{ ['--i' as string]: i }}>
                <Avatar name={inv.member} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">{inv.member}</p>
                  <p className="truncate text-xs text-slate-500">
                    {inv.id} · {inv.item} · {inv.date}
                  </p>
                </div>
                <span className="text-sm font-semibold tabular-nums text-slate-900">${inv.amount}</span>
                <Pill tone={tone(inv.status)}>{inv.status}</Pill>
                {inv.status !== 'Paid' && (
                  <button type="button" onClick={() => setPaid((s) => ({ ...s, [inv.id]: true }))} className="rounded-md bg-slate-900 px-2.5 py-1 text-xs font-semibold text-white hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]">
                    Mark paid
                  </button>
                )}
              </li>
            ))}
            {list.length === 0 && <li className="py-8 text-center text-sm text-slate-500">Nothing here.</li>}
          </ul>
        </Panel>
      </div>
    </>
  );
}

/* ---------------------------------- Attendance, reports, settings ---------------------------------- */

export function GymAttendanceView() {
  const [checked, setChecked] = useState<Record<string, boolean>>(() => Object.fromEntries(MEMBERS.map((m) => [m.id, m.visits[0] === 1])));
  const [query, setQuery] = useState('');
  const inside = Object.values(checked).filter(Boolean).length;
  const list = MEMBERS.filter((m) => m.name.toLowerCase().includes(query.trim().toLowerCase()));
  return (
    <>
      <PageHeading title="Attendance" description="Check members in at the desk, or let them scan in from the app.">
        <span className="text-xs text-slate-500">Live: {inside} in the gym</span>
      </PageHeading>
      <div className="grid gap-3 lg:grid-cols-[1fr_1.4fr]">
        <Panel index={0} title="Check-ins this week" className="self-start">
          <BarChart data={WEEK_ATTENDANCE} label="Check-ins by day" highlight={4} className="h-40" />
          <div className="mt-4 flex items-center gap-4 border-t border-slate-100 pt-4">
            <Ring value={78.4} size={64} stroke={8} label="Attendance rate" />
            <p className="text-xs text-slate-600">78% of booked members attend. Target is 80%.</p>
          </div>
        </Panel>
        <Panel index={1} title="Check-in desk">
          <label className="relative mb-3 block">
            <span className="sr-only">Find a member</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a member" className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[color:var(--demo-accent)] focus:outline-2 focus:outline-[color:var(--demo-accent)]" />
          </label>
          <ul className="divide-y divide-slate-100">
            {list.map((m) => (
              <li key={m.id} className="flex items-center gap-3 py-2.5">
                <Avatar name={m.name} size="sm" />
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-900">{m.name}</span>
                <button type="button" aria-pressed={!!checked[m.id]} onClick={() => setChecked((s) => ({ ...s, [m.id]: !s[m.id] }))} className={cn('h-8 min-w-24 rounded-lg px-3 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]', checked[m.id] ? 'bg-[var(--demo-good)] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200')}>
                  {checked[m.id] ? 'Checked in' : 'Check in'}
                </button>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}

const REPORTS = ['Membership retention', 'Revenue summary', 'Class fill rates', 'Trainer performance', 'Churn and cancellations', 'Attendance by hour'];

export function GymReportsView() {
  const [ready, setReady] = useState<Record<string, boolean>>({});
  return (
    <>
      <PageHeading title="Reports" description="Printable reports for the owner and your investors." />
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {REPORTS.map((name, i) => (
          <li key={name} className="demo-rise flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4" style={{ ['--i' as string]: i }}>
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-lg bg-[var(--demo-accent-soft)] text-[color:var(--demo-accent)]">
                <FileText className="size-4" aria-hidden />
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-900">{name}</p>
                <p className="text-xs text-slate-500">PDF · October 2026</p>
              </div>
            </div>
            <button type="button" onClick={() => setReady((s) => ({ ...s, [name]: true }))} className={cn('inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]', ready[name] ? 'bg-[var(--demo-good-soft)] text-[color:var(--demo-good-ink)]' : 'bg-slate-900 text-white hover:bg-slate-700')}>
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

const HOURS = ['05:00 – 23:00', '06:00 – 22:00', '24/7 access'] as const;

export function GymSettingsView() {
  const [hours, setHours] = useState<(typeof HOURS)[number]>(HOURS[2]);
  return (
    <>
      <PageHeading title="Settings" description="Gym profile, booking rules and notifications." />
      <div className="grid gap-3 lg:grid-cols-2">
        <Panel title="Gym profile" index={0}>
          <dl className="space-y-3 text-sm">
            {[
              ['Name', 'Iron Parish Gym'],
              ['Address', '12 Mill Street, Riverside'],
              ['Phone', '+1 555 0199'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                <dt className="text-slate-500">{k}</dt>
                <dd className="text-right font-medium text-slate-900">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-4">
            <span className="mb-1.5 block text-xs font-medium text-slate-500">Access hours</span>
            <SelectMenu label="Access hours" value={hours} options={HOURS} onChange={setHours} />
          </div>
        </Panel>
        <Panel title="Preferences" index={1}>
          <ul className="divide-y divide-slate-100">
            <Switch label="Online class booking" description="Let members book classes from the app and website." defaultOn />
            <Switch label="Waitlists" description="Offer a waitlist when a class is full." defaultOn />
            <Switch label="Failed-payment retries" description="Retry declined direct debits automatically." defaultOn />
            <Switch label="Expiry reminders" description="Message members 7 days before a membership ends." />
          </ul>
        </Panel>
      </div>
      <p className="mt-4 flex items-center gap-2 text-xs text-slate-500">
        <Users className="size-3.5" aria-hidden /> Changes apply to every location on your plan.
      </p>
    </>
  );
}
