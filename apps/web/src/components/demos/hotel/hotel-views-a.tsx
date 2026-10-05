'use client';

import { BedDouble, CalendarCheck, DoorOpen, Percent, Wallet, Check } from 'lucide-react';
import { useMemo, useState } from 'react';
import { AreaChart, BarChart, Donut } from '@/components/demos/shared/charts';
import { DashboardCard, Panel } from '@/components/demos/shared/dashboard-card';
import { Avatar, PageHeading, Pill, SelectMenu, Tabs } from '@/components/demos/shared/app-ui';
import { DASHBOARD_STATS, OCCUPANCY_WEEK, REVENUE_MONTHS, RESERVATIONS, ROOMS, ROOM_MIX, TASKS } from '@/data/hotel/rooms';
import type { CleanStatus, Room, RoomCategory, RoomStatus } from '@/data/hotel/rooms';
import { cn } from '@/lib/cn';
import { BookingCard, RoomCard, tone } from './hotel-cards';

const money = (value: number) => `$${value.toLocaleString('en-US')}`;

/* ---------------------------------- Dashboard ---------------------------------- */

export function HotelDashboardHome() {
  const { bookings, availableRooms, checkIns, revenue, occupancy } = DASHBOARD_STATS;
  return (
    <>
      <PageHeading title="Dashboard" description="Good morning, Amelia. Here is how the hotel looks today." />
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-5">
        <DashboardCard index={0} label="Total bookings" value={bookings.toLocaleString('en-US')} delta={{ value: '+62 this week', up: true }} icon={CalendarCheck} />
        <DashboardCard index={1} label="Available rooms" value={String(availableRooms)} icon={BedDouble} tone="emerald" />
        <DashboardCard index={2} label="Today's check-ins" value={String(checkIns)} icon={DoorOpen} tone="slate" />
        <DashboardCard index={3} label="Revenue (Oct)" value={money(revenue)} delta={{ value: '+6.3% vs Sep', up: true }} icon={Wallet} tone="amber" />
        <DashboardCard index={4} label="Occupancy" value={`${occupancy}%`} delta={{ value: '+3.1 pts', up: true }} icon={Percent} />
      </div>
      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        <Panel index={5} title="Occupancy this week" className="lg:col-span-2" action={<Pill tone="green">Weekend peak 97%</Pill>}>
          <AreaChart data={OCCUPANCY_WEEK} label="Occupancy by day (%)" min={60} max={100} />
        </Panel>
        <Panel index={6} title="Room mix">
          <div className="flex items-center gap-4 lg:flex-col lg:items-start xl:flex-row xl:items-center">
            <Donut label="Room mix by category" segments={ROOM_MIX} size={104}>
              <span><span className="block text-lg font-semibold tabular-nums text-slate-900">10</span><span className="block text-[11px] text-slate-500">rooms</span></span>
            </Donut>
            <ul className="space-y-2 text-sm">
              {ROOM_MIX.map((item) => (
                <li key={item.label} className="flex items-center gap-2 text-slate-600">
                  <span aria-hidden className={cn('size-2.5 rounded-full', item.tone === 'emerald' ? 'bg-[var(--demo-good)]' : item.tone === 'blue' ? 'bg-[var(--demo-accent)]' : 'bg-[var(--demo-gold)]')} />
                  {item.label}<span className="ml-auto pl-3 font-medium tabular-nums text-slate-900">{item.value}%</span>
                </li>
              ))}
            </ul>
          </div>
        </Panel>
        <Panel index={7} title="Revenue (USD, thousands)" className="lg:col-span-2">
          <BarChart data={REVENUE_MONTHS} label="Revenue by month" highlight={5} className="h-36" />
        </Panel>
        <Panel index={8} title="Arrivals today">
          <ul className="space-y-3">
            {RESERVATIONS.filter((r) => r.checkIn === '5 Oct').map((r) => (
              <li key={r.id} className="flex items-center gap-3">
                <Avatar name={r.guest} size="sm" />
                <span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium text-slate-900">{r.guest}</span><span className="block text-xs text-slate-500">Room {r.room} · {r.nights} nights</span></span>
                <Pill tone={tone(r.status)}>{r.status}</Pill>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}

/* ---------------------------------- Reservations ---------------------------------- */

const DAY_NUMBERS = Array.from({ length: 14 }, (_, i) => 5 + i);

export function HotelReservationsView() {
  const [tab, setTab] = useState<'list' | 'calendar'>('list');
  const [status, setStatus] = useState<'All' | 'Confirmed' | 'Pending' | 'Checked in' | 'Checked out'>('All');
  const [channel, setChannel] = useState<'All channels' | 'Direct' | 'Booking platform' | 'Corporate'>('All channels');
  const [done, setDone] = useState<Record<string, string>>({});
  const list = RESERVATIONS.filter((r) => (status === 'All' || (done[r.id] ?? r.status) === status) && (channel === 'All channels' || r.channel === channel));

  return (
    <>
      <PageHeading title="Reservations" description={`${list.length} bookings shown`}>
        <button type="button" className="inline-flex h-9 items-center gap-2 rounded-lg bg-[var(--demo-accent)] px-3.5 text-sm font-semibold text-white hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]">+ New booking</button>
      </PageHeading>
      <div className="mb-3 flex flex-wrap items-center gap-2.5">
        <Tabs label="Reservation view" value={tab} onChange={setTab} tabs={[{ id: 'list', label: 'Booking cards' }, { id: 'calendar', label: 'Calendar' }]} />
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <SelectMenu label="Channel" value={channel} options={['All channels', 'Direct', 'Booking platform', 'Corporate'] as const} onChange={setChannel} className="w-44" align="right" />
        </div>
      </div>
      <div className="mb-4">
        <Tabs label="Booking status" value={status} onChange={setStatus} tabs={(['All', 'Confirmed', 'Pending', 'Checked in', 'Checked out'] as const).map((s) => ({ id: s, label: s }))} />
      </div>
      {tab === 'list' ? (
        <ul key={`${status}-${channel}`} className="space-y-3">
          {list.map((r, i) => (
            <li key={r.id}>
              <BookingCard booking={{ ...r, status: (done[r.id] ?? r.status) as typeof r.status }} index={i} action={(done[r.id] ?? r.status) === 'Pending' ? { label: 'Confirm', onClick: () => setDone((d) => ({ ...d, [r.id]: 'Confirmed' })) } : (done[r.id] ?? r.status) === 'Confirmed' ? { label: 'Check in', onClick: () => setDone((d) => ({ ...d, [r.id]: 'Checked in' })) } : undefined} />
            </li>
          ))}
          {list.length === 0 && <li className="rounded-xl border border-dashed border-slate-300 bg-white py-10 text-center text-sm text-slate-500">No bookings match these filters.</li>}
        </ul>
      ) : (
        <div className="demo-rise overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <div className="grid min-w-[60rem] grid-cols-[5.5rem_repeat(14,1fr)] text-[11px]">
            <div className="border-b border-slate-100 bg-slate-50 px-2 py-2 font-semibold text-slate-500">Room</div>
            {DAY_NUMBERS.map((d) => <div key={d} className="border-b border-l border-slate-100 bg-slate-50 py-2 text-center font-medium text-slate-500">{d} Oct</div>)}
            {ROOMS.slice(0, 7).map((room) => (
              <div key={room.id} className="contents">
                <div className="border-b border-slate-100 px-2 py-2.5 font-semibold text-slate-900">{room.number} <span className="font-normal text-slate-500">{room.category}</span></div>
                {DAY_NUMBERS.map((d) => {
                  const b = RESERVATIONS.find((x) => x.room === room.number && Number(x.checkIn.split(' ')[0]) <= d && Number(x.checkOut.split(' ')[0]) > d);
                  return (
                    <div key={d} className="relative min-h-10 border-b border-l border-slate-100 p-0.5">
                      {b && Number(b.checkIn.split(' ')[0]) === d && (
                        <span className="absolute inset-y-1 left-0.5 right-[-100%] z-10 flex items-center truncate rounded-md bg-[var(--demo-accent)] px-2 text-[10px] font-semibold text-white" title={`${b.guest} · ${b.status}`}>{b.guest.split(' ')[0]}</span>
                      )}
                      {b && Number(b.checkIn.split(' ')[0]) !== d && <span aria-hidden className="block h-full rounded-none bg-[var(--demo-accent-soft)]" />}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

/* ---------------------------------- Rooms ---------------------------------- */

const ROOM_STATUSES: RoomStatus[] = ['Available', 'Occupied', 'Reserved', 'Cleaning', 'Maintenance'];

export function HotelRoomsView() {
  const [category, setCategory] = useState<'All' | RoomCategory>('All');
  const [status, setStatus] = useState<Record<string, RoomStatus>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const rooms: Room[] = ROOMS.map((r) => ({ ...r, status: status[r.id] ?? r.status }));
  const list = rooms.filter((r) => category === 'All' || r.category === category);
  const current = rooms.find((r) => r.id === selected);
  const count = (s: RoomStatus) => rooms.filter((r) => r.status === s).length;

  return (
    <>
      <PageHeading title="Rooms" description="Live availability, categories and cleaning status. Select a room to change its state." />
      <div className="mb-3 flex flex-wrap items-center gap-2.5">
        <Tabs label="Room category" value={category} onChange={setCategory} tabs={(['All', 'Deluxe', 'Suite', 'Family'] as const).map((c) => ({ id: c, label: c }))} />
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        {ROOM_STATUSES.map((s) => (
          <span key={s} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700">
            <Pill tone={tone(s)}>{s}</Pill><span className="tabular-nums text-slate-500">{count(s)}</span>
          </span>
        ))}
      </div>
      <div className="grid gap-3 xl:grid-cols-[1fr_18rem]">
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
          {list.map((r, i) => (
            <li key={r.id}><RoomCard room={r} index={i} onOpen={() => setSelected(r.id)} /></li>
          ))}
        </ul>
        {current && (
          <Panel title={`Room ${current.number}`} index={2} className="h-fit xl:sticky xl:top-4" action={<Pill tone={tone(current.status)}>{current.status}</Pill>}>
            <dl className="space-y-2.5 text-sm">
              {[['Category', current.category], ['Beds', current.beds], ['Size', `${current.size} m²`], ['View', current.view], ['Rate', `$${current.rate} / night`], ['Cleaning', current.clean]].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3 border-b border-slate-100 pb-2 last:border-0 last:pb-0"><dt className="text-slate-500">{k}</dt><dd className="text-right font-medium text-slate-900">{v}</dd></div>
              ))}
            </dl>
            <div className="mt-4 flex flex-wrap gap-1.5">{current.features.map((f) => <span key={f} className="rounded-full bg-[var(--demo-accent-soft)] px-2.5 py-1 text-[11px] font-medium text-slate-800">{f}</span>)}</div>
            <p className="mt-4 text-[11px] font-semibold text-slate-500">Set status</p>
            <div role="group" aria-label={`Status for room ${current.number}`} className="mt-2 grid grid-cols-2 gap-1.5">
              {ROOM_STATUSES.map((s) => (
                <button key={s} type="button" aria-pressed={current.status === s} onClick={() => setStatus((m) => ({ ...m, [current.id]: s }))} className={cn('rounded-lg px-2 py-1.5 text-[11px] font-semibold focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]', current.status === s ? 'bg-[var(--demo-accent)] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200')}>{s}</button>
              ))}
            </div>
          </Panel>
        )}
      </div>
    </>
  );
}

/* ---------------------------------- Housekeeping ---------------------------------- */

export function HotelHousekeepingView() {
  const [clean, setClean] = useState<Record<string, CleanStatus>>({});
  const [done, setDone] = useState<Record<string, boolean>>(() => Object.fromEntries(TASKS.map((t) => [t.id, t.done])));
  const rooms = ROOMS.map((r) => ({ ...r, clean: clean[r.id] ?? r.clean }));
  const next: Record<CleanStatus, CleanStatus> = { Dirty: 'In progress', 'In progress': 'Clean', Clean: 'Inspected', Inspected: 'Inspected' };
  const dirty = rooms.filter((r) => r.clean === 'Dirty').length;
  return (
    <>
      <PageHeading title="Housekeeping" description={`${dirty} rooms need cleaning today`} />
      <div className="grid gap-3 xl:grid-cols-[1.4fr_1fr]">
        <ul className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((r, i) => (
            <li key={r.id} className="demo-rise rounded-xl border border-slate-200 bg-white p-3.5" style={{ ['--i' as string]: i }}>
              <div className="flex items-center justify-between"><p className="text-sm font-semibold text-slate-900">Room {r.number}</p><Pill tone={tone(r.clean)}>{r.clean}</Pill></div>
              <p className="mt-0.5 text-xs text-slate-500">{r.category} · floor {r.floor}</p>
              <button type="button" disabled={r.clean === 'Inspected'} onClick={() => setClean((c) => ({ ...c, [r.id]: next[r.clean] }))} className="mt-3 h-8 w-full rounded-lg bg-[var(--demo-accent)] text-[11px] font-semibold text-white hover:bg-slate-700 disabled:bg-slate-200 disabled:text-slate-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]">
                {r.clean === 'Dirty' ? 'Start cleaning' : r.clean === 'In progress' ? 'Mark clean' : r.clean === 'Clean' ? 'Send to inspection' : 'Inspected'}
              </button>
            </li>
          ))}
        </ul>
        <Panel title="Tasks" index={6}>
          <ul className="divide-y divide-slate-100">
            {TASKS.map((t) => (
              <li key={t.id} className="flex items-start gap-3 py-3">
                <button type="button" role="checkbox" aria-checked={!!done[t.id]} aria-label={t.title} onClick={() => setDone((d) => ({ ...d, [t.id]: !d[t.id] }))} className={cn('mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]', done[t.id] ? 'border-[color:var(--demo-good)] bg-[var(--demo-good)] text-white' : 'border-slate-300')}>{done[t.id] && <Check className="size-3.5" aria-hidden />}</button>
                <div className="min-w-0 flex-1">
                  <p className={cn('text-sm font-medium', done[t.id] ? 'text-slate-400 line-through' : 'text-slate-900')}>{t.title}</p>
                  <p className="text-xs text-slate-500">{t.room ? `Room ${t.room} · ` : ''}{t.assignee} · due {t.due}</p>
                </div>
                {t.priority === 'High' && !done[t.id] && <Pill tone="red">High</Pill>}
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}

