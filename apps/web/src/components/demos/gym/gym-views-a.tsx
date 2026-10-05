'use client';

import { CalendarDays, Check, Clock, Dumbbell, LayoutGrid, List, Mail, Phone, Search, ShieldCheck, Star, Users, Wallet, X } from 'lucide-react';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { AreaChart, BarChart, Donut, Ring } from '@/components/demos/shared/charts';
import { DashboardCard, Panel } from '@/components/demos/shared/dashboard-card';
import { Avatar, PageHeading, Pill, ProgressBar, SelectMenu, Tabs } from '@/components/demos/shared/app-ui';
import { CLASSES, DASHBOARD_STATS, DAYS, MEMBERS, MEMBER_GROWTH, PLAN_MIX, PLANS, REVENUE_MONTHS, TRAINERS, WEEK_ATTENDANCE } from '@/data/gym/app';
import type { GymClass, Member, MembershipStatus } from '@/data/gym/app';
import { cn } from '@/lib/cn';
import { MemberCard, tone } from './gym-cards';

const money = (value: number) => `$${value.toLocaleString('en-US')}`;
const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

/* ---------------------------------- Dashboard ---------------------------------- */

export function GymDashboardHome() {
  const { activeMembers, monthlyRevenue, classesToday, attendanceRate, trainers } = DASHBOARD_STATS;
  return (
    <>
      <PageHeading title="Dashboard" description="Good morning, Coach Rivera. Here is how the gym is doing today." />
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-5">
        <DashboardCard index={0} label="Active members" value={activeMembers.toLocaleString('en-US')} delta={{ value: '+28 this month', up: true }} icon={Users} />
        <DashboardCard index={1} label="Monthly revenue" value={money(monthlyRevenue)} delta={{ value: '+5.9% vs Sep', up: true }} icon={Wallet} tone="emerald" />
        <DashboardCard index={2} label="Today's classes" value={String(classesToday)} icon={CalendarDays} tone="amber" />
        <DashboardCard index={3} label="Attendance rate" value={`${attendanceRate}%`} delta={{ value: '+2.1% this week', up: true }} icon={Dumbbell} tone="slate" />
        <DashboardCard index={4} label="Trainers" value={String(trainers)} icon={ShieldCheck} />
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        <Panel index={5} title="Member growth" className="lg:col-span-2" action={<Pill tone="green">+260 since April</Pill>}>
          <AreaChart data={MEMBER_GROWTH} label="Active members per month" min={800} max={1200} />
        </Panel>
        <Panel index={6} title="Membership mix">
          <div className="flex items-center gap-4 lg:flex-col lg:items-start xl:flex-row xl:items-center">
            <Donut label="Membership mix" segments={PLAN_MIX} size={104}>
              <span>
                <span className="block text-lg font-semibold tabular-nums text-slate-900">1,140</span>
                <span className="block text-[11px] text-slate-500">members</span>
              </span>
            </Donut>
            <ul className="space-y-2 text-sm">
              {PLAN_MIX.map((item) => (
                <li key={item.label} className="flex items-center gap-2 text-slate-600">
                  <span aria-hidden className={cn('size-2.5 rounded-full', item.tone === 'emerald' ? 'bg-[var(--demo-good)]' : item.tone === 'blue' ? 'bg-[var(--demo-accent)]' : item.tone === 'amber' ? 'bg-amber-500' : 'bg-slate-300')} />
                  {item.label}
                  <span className="ml-auto pl-3 font-medium tabular-nums text-slate-900">{item.value}%</span>
                </li>
              ))}
            </ul>
          </div>
        </Panel>
        <Panel index={7} title="Check-ins this week" className="lg:col-span-2">
          <BarChart data={WEEK_ATTENDANCE} label="Check-ins by day" highlight={4} className="h-36" />
        </Panel>
        <Panel index={8} title="Revenue (USD, thousands)">
          <BarChart data={REVENUE_MONTHS} label="Revenue by month" highlight={5} className="h-36" />
        </Panel>
      </div>
    </>
  );
}

/* ---------------------------------- Members ---------------------------------- */

function MemberProfile({ member, onClose }: { member: Member; onClose: () => void }) {
  const [tab, setTab] = useState<'overview' | 'progress' | 'billing'>('overview');
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="absolute inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-[1px]" onClick={onClose}>
      <aside role="dialog" aria-modal="true" aria-label={`${member.name} profile`} className="demo-slide flex h-full w-full max-w-md flex-col overflow-y-auto bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h3 className="text-sm font-semibold text-slate-900">Member profile</h3>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Close profile" className="grid size-8 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]">
            <X className="size-4" aria-hidden />
          </button>
        </div>
        <div className="flex items-center gap-4 px-5 pt-5">
          <Avatar name={member.name} size="lg" />
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold text-slate-900">{member.name}</p>
            <p className="text-sm text-slate-500">
              {member.age} yrs · {member.plan} plan
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Pill tone={tone(member.status)}>{member.status}</Pill>
              <Pill tone="slate">Renews {member.renews}</Pill>
            </div>
          </div>
        </div>
        <div className="mt-5 px-5">
          <Tabs label="Profile sections" value={tab} onChange={setTab} tabs={[{ id: 'overview', label: 'Overview' }, { id: 'progress', label: 'Progress' }, { id: 'billing', label: 'Billing' }]} className="w-full [&>button]:flex-1" />
        </div>
        <div className="space-y-5 px-5 py-5">
          {tab === 'overview' && (
            <>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  ['Check-ins', String(member.checkIns)],
                  ['Streak', `${member.streak} d`],
                  ['Trainer', member.trainer === 'Unassigned' ? '—' : member.trainer.split(' ')[0]],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl bg-slate-50 p-3">
                    <p className="truncate text-sm font-semibold tabular-nums text-slate-900">{value}</p>
                    <p className="text-[11px] text-slate-500">{label}</p>
                  </div>
                ))}
              </div>
              <dl className="space-y-3 text-sm">
                {[
                  [Phone, 'Phone', member.phone],
                  [Mail, 'Email', member.email],
                  [Clock, 'Joined', member.joined],
                  [Dumbbell, 'Goal', member.goal],
                ].map(([Icon, label, value]) => {
                  const IconCmp = Icon as typeof Phone;
                  return (
                    <div key={label as string} className="flex items-center gap-3">
                      <dt className="grid size-8 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-600">
                        <IconCmp className="size-4" aria-hidden />
                        <span className="sr-only">{label as string}</span>
                      </dt>
                      <dd className="min-w-0 truncate text-slate-700">{value as string}</dd>
                    </div>
                  );
                })}
              </dl>
            </>
          )}
          {tab === 'progress' && (
            <div>
              <p className="mb-2 text-sm font-medium text-slate-900">Goal progress</p>
              <div className="mb-5 flex items-center gap-4">
                <Ring value={member.progress} size={72} stroke={9} label="Goal progress" />
                <p className="text-sm text-slate-600">{member.goal}: {member.progress}% of the way there.</p>
              </div>
              <p className="mb-2 text-sm font-medium text-slate-900">Visits this week</p>
              <div className="grid grid-cols-7 gap-1.5">
                {WEEK_DAYS.map((d, i) => (
                  <div key={`${d}${i}`} className="text-center">
                    <div className={cn('mx-auto mb-1 h-16 w-full rounded-md', member.visits[i] ? 'bg-[var(--demo-good)]' : 'bg-slate-100')} />
                    <span className="text-[10px] text-slate-500">{d}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {tab === 'billing' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{member.plan} membership</p>
                  <p className="text-xs text-slate-500">Next payment {member.renews}</p>
                </div>
                <ShieldCheck className="size-5 text-[color:var(--demo-good-ink)]" aria-hidden />
              </div>
              <p className="flex items-center gap-2 text-xs text-slate-500">
                <Check className="size-3.5" aria-hidden /> Paid by direct debit.
              </p>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

export function GymMembersView() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'All' | MembershipStatus>('All');
  const [trainer, setTrainer] = useState('All trainers');
  const [layout, setLayout] = useState<'cards' | 'table'>('cards');
  const [selected, setSelected] = useState<Member | null>(null);
  const trainers = ['All trainers', ...TRAINERS.map((t) => t.name)];

  const base = useMemo(() => MEMBERS.filter((m) => (trainer === 'All trainers' || m.trainer === trainer) && m.name.toLowerCase().includes(query.trim().toLowerCase())), [query, trainer]);
  const list = base.filter((m) => status === 'All' || m.status === status);
  const count = (s: MembershipStatus) => base.filter((m) => m.status === s).length;

  return (
    <>
      <PageHeading title="Members" description={`${list.length} of ${MEMBERS.length} members shown`}>
        <button type="button" className="inline-flex h-9 items-center gap-2 rounded-lg bg-[var(--demo-accent)] px-3.5 text-sm font-semibold text-white hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]">
          + New member
        </button>
      </PageHeading>
      <div className="mb-3 flex flex-wrap items-center gap-2.5">
        <label className="relative min-w-48 flex-1 sm:max-w-xs">
          <span className="sr-only">Search members</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search members" className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[color:var(--demo-accent)] focus:outline-2 focus:outline-[color:var(--demo-accent)]" />
        </label>
        <SelectMenu label="Trainer" value={trainer} options={trainers} onChange={setTrainer} className="w-44" />
        <div role="group" aria-label="Layout" className="ml-auto inline-flex rounded-lg bg-slate-100 p-1">
          {[
            ['cards', LayoutGrid, 'Cards'],
            ['table', List, 'Table'],
          ].map(([id, Icon, text]) => {
            const IconCmp = Icon as typeof List;
            return (
              <button key={id as string} type="button" aria-pressed={layout === id} onClick={() => setLayout(id as 'cards' | 'table')} className={cn('inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]', layout === id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600')}>
                <IconCmp className="size-4" aria-hidden />
                <span className="hidden sm:inline">{text as string}</span>
                <span className="sr-only sm:hidden">{text as string}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="mb-4">
        <Tabs label="Membership status" value={status} onChange={setStatus} tabs={[{ id: 'All', label: 'All', count: base.length }, { id: 'Active', label: 'Active', count: count('Active') }, { id: 'Expiring', label: 'Expiring', count: count('Expiring') }, { id: 'Expired', label: 'Expired', count: count('Expired') }, { id: 'Paused', label: 'Paused', count: count('Paused') }]} />
      </div>

      {list.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center text-sm text-slate-500">No members match these filters.</p>
      ) : layout === 'cards' ? (
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((m, i) => (
            <li key={m.id}>
              <MemberCard member={m} index={i} onOpen={() => setSelected(m)} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="demo-rise overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs font-medium text-slate-500">
              <tr>
                <th scope="col" className="px-4 py-3">Member</th>
                <th scope="col" className="px-4 py-3">Plan</th>
                <th scope="col" className="px-4 py-3">Trainer</th>
                <th scope="col" className="px-4 py-3">Renews</th>
                <th scope="col" className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {list.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3">
                    <button type="button" onClick={() => setSelected(m)} className="flex items-center gap-3 rounded-md text-left focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]">
                      <Avatar name={m.name} />
                      <span className="font-medium text-slate-900">{m.name}</span>
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <Pill tone={tone(m.plan)}>{m.plan}</Pill>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{m.trainer}</td>
                  <td className="px-4 py-3 text-slate-600">{m.renews}</td>
                  <td className="px-4 py-3">
                    <Pill tone={tone(m.status)}>{m.status}</Pill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {selected && <MemberProfile member={selected} onClose={() => setSelected(null)} />}
    </>
  );
}

/* ---------------------------------- Trainers ---------------------------------- */

export function GymTrainersView() {
  const [selected, setSelected] = useState(TRAINERS[0].id);
  const trainer = TRAINERS.find((t) => t.id === selected) ?? TRAINERS[0];
  const clients = MEMBERS.filter((m) => m.trainer === trainer.name);
  return (
    <>
      <PageHeading title="Trainers" description="Select a trainer to see their assigned clients." />
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {TRAINERS.map((t, i) => (
          <li key={t.id}>
            <button type="button" aria-pressed={t.id === selected} onClick={() => setSelected(t.id)} className={cn('demo-rise block w-full rounded-xl border bg-white p-4 text-left transition-[border-color,box-shadow] hover:shadow-md focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]', t.id === selected ? 'border-[color:var(--demo-accent)] ring-1 ring-[color:var(--demo-accent)]' : 'border-slate-200')} style={{ ['--i' as string]: i }}>
              <span className="flex items-center gap-3">
                <Avatar name={t.name} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-slate-900">{t.name}</span>
                  <span className="block truncate text-xs text-slate-500">{t.specialty}</span>
                </span>
                <Pill tone={tone(t.status)}>{t.status}</Pill>
              </span>
              <span className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
                <span>{t.clients} clients · ${t.rate}/session</span>
                <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                  <Star className="size-3.5 fill-amber-400 text-amber-400" aria-hidden /> {t.rating}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <Panel title={`${trainer.name}: assigned clients`} index={3} className="mt-3">
        {clients.length ? (
          <ul key={trainer.id} className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {clients.map((m, i) => (
              <li key={m.id}>
                <MemberCard member={m} index={i} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-6 text-center text-sm text-slate-500">No clients assigned yet. New members can pick a trainer from the app.</p>
        )}
      </Panel>
    </>
  );
}

/* ---------------------------------- Classes ---------------------------------- */

export function GymClassesView() {
  const [day, setDay] = useState(0);
  const [booked, setBooked] = useState<Record<string, boolean>>({});
  const id = useId();
  const list = CLASSES.filter((c) => c.day === day);
  const seatsLeft = (c: GymClass) => c.capacity - c.booked - (booked[c.id] ? 1 : 0);

  return (
    <>
      <PageHeading title="Classes" description="Weekly timetable with capacity, bookings and waitlists.">
        <span className="text-xs text-slate-500">Week of 5 October</span>
      </PageHeading>
      <div role="tablist" aria-label="Day of the week" className="mb-4 flex flex-wrap gap-1.5" id={id}>
        {DAYS.map((d, i) => (
          <button key={d} role="tab" type="button" aria-selected={day === i} onClick={() => setDay(i)} className={cn('min-w-14 rounded-lg px-3 py-1.5 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]', day === i ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 ring-1 ring-inset ring-slate-200 hover:ring-slate-300')}>
            {d}
          </button>
        ))}
      </div>
      <ul key={day} className="space-y-2.5">
        {list.length === 0 && <li className="rounded-xl border border-dashed border-slate-300 bg-white py-10 text-center text-sm text-slate-500">No classes scheduled on this day.</li>}
        {list.map((c, i) => {
          const left = seatsLeft(c);
          const full = left <= 0;
          const pct = Math.min(100, ((c.booked + (booked[c.id] ? 1 : 0)) / c.capacity) * 100);
          return (
            <li key={c.id} className="demo-rise flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:gap-4" style={{ ['--i' as string]: i }}>
              <span className="grid w-16 shrink-0 place-items-center rounded-lg bg-[var(--demo-accent-soft)] py-2 text-sm font-semibold tabular-nums text-[color:var(--demo-accent)]">{c.time}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900">{c.name}</p>
                <p className="truncate text-xs text-slate-500">
                  {c.trainer} · {c.room} · {c.level}
                </p>
                <div className="mt-2 max-w-xs">
                  <ProgressBar value={pct} tone={full ? 'blue' : 'emerald'} />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-right text-xs">
                  <span className="block font-semibold tabular-nums text-slate-900">
                    {c.booked + (booked[c.id] ? 1 : 0)}/{c.capacity}
                  </span>
                  <span className="text-slate-500">{full ? 'Full' : `${left} left`}</span>
                </span>
                <button
                  type="button"
                  disabled={full && !booked[c.id]}
                  aria-pressed={!!booked[c.id]}
                  onClick={() => setBooked((s) => ({ ...s, [c.id]: !s[c.id] }))}
                  className={cn('h-9 min-w-24 rounded-lg px-3 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)] disabled:bg-slate-200 disabled:text-slate-500', booked[c.id] ? 'bg-[var(--demo-good-soft)] text-[color:var(--demo-good-ink)] ring-1 ring-inset ring-[color:var(--demo-good-ring)]' : 'bg-[var(--demo-accent)] text-white hover:brightness-110')}
                >
                  {booked[c.id] ? (
                    <span className="inline-flex items-center gap-1">
                      <Check className="size-3.5" aria-hidden /> Booked
                    </span>
                  ) : full ? (
                    'Join waitlist'
                  ) : (
                    'Book class'
                  )}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}

