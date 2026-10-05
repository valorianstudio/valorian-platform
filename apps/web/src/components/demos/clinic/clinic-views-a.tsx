'use client';

import { CalendarCheck, CalendarDays, LayoutGrid, List, Mail, Phone, Search, ShieldCheck, Star, Stethoscope, Users, Wallet, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AreaChart, BarChart, Donut } from '@/components/demos/shared/charts';
import { DashboardCard, Panel } from '@/components/demos/shared/dashboard-card';
import { Avatar, PageHeading, Pill, SelectMenu, Tabs } from '@/components/demos/shared/app-ui';
import { APPOINTMENTS, CALENDAR_DOCTORS, DASHBOARD_STATS, DOCTORS, DOCTOR_NAMES, INITIAL_TEETH, PATIENTS, PATIENT_GROWTH, REVENUE_MONTHS, TREATMENTS, TREATMENT_MIX } from '@/data/clinic/app';
import type { Appointment, AppointmentStatus, Patient } from '@/data/clinic/app';
import { cn } from '@/lib/cn';
import { AppointmentCard, PatientCard, tone } from './clinic-cards';
import { ToothChart, ToothLegend } from './tooth-chart';

const money = (value: number) => `$${value.toLocaleString('en-US')}`;

/* ---------------------------------- Dashboard ---------------------------------- */

export function ClinicDashboardHome() {
  const { patients, today, doctors, revenue } = DASHBOARD_STATS;
  return (
    <>
      <PageHeading title="Dashboard" description="Good morning, Dr. Costa. Here is Brightsmile Dental today." />
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <DashboardCard index={0} label="Total patients" value={patients.toLocaleString('en-US')} delta={{ value: '+8.4% this month', up: true }} icon={Users} />
        <DashboardCard index={1} label="Today's appointments" value={String(today)} delta={{ value: '4 waiting now', up: true }} icon={CalendarCheck} tone="emerald" />
        <DashboardCard index={2} label="Doctors" value={String(doctors)} icon={Stethoscope} tone="slate" />
        <DashboardCard index={3} label="Revenue (Oct)" value={money(revenue)} delta={{ value: '+9.1% vs Sep', up: true }} icon={Wallet} tone="amber" />
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        <Panel index={4} title="Patient growth" className="lg:col-span-2" action={<Pill tone="green">+341 new in Oct</Pill>}>
          <AreaChart data={PATIENT_GROWTH} label="New patients per month" min={180} max={360} />
        </Panel>
        <Panel index={5} title="Treatment mix">
          <div className="flex items-center gap-4 lg:flex-col lg:items-start xl:flex-row xl:items-center">
            <Donut label="Treatment mix" segments={TREATMENT_MIX} size={104}>
              <span>
                <span className="block text-lg font-semibold tabular-nums text-slate-900">1.9k</span>
                <span className="block text-[11px] text-slate-500">visits</span>
              </span>
            </Donut>
            <ul className="space-y-2 text-sm">
              {TREATMENT_MIX.map((item) => (
                <li key={item.label} className="flex items-center gap-2 text-slate-600">
                  <span aria-hidden className={cn('size-2.5 rounded-full', item.tone === 'emerald' ? 'bg-[var(--demo-good)]' : item.tone === 'blue' ? 'bg-[var(--demo-accent)]' : item.tone === 'amber' ? 'bg-amber-500' : 'bg-slate-300')} />
                  {item.label}
                  <span className="ml-auto pl-3 font-medium tabular-nums text-slate-900">{item.value}%</span>
                </li>
              ))}
            </ul>
          </div>
        </Panel>
        <Panel index={6} title="Revenue (USD, thousands)" className="lg:col-span-2">
          <BarChart data={REVENUE_MONTHS} label="Revenue by month" highlight={5} className="h-36" />
        </Panel>
        <Panel index={7} title="Up next">
          <ul className="space-y-3">
            {APPOINTMENTS.filter((a) => ['Checked in', 'Confirmed'].includes(a.status))
              .slice(0, 3)
              .map((a) => (
                <li key={a.id} className="flex items-center gap-3">
                  <span className="w-11 text-xs font-semibold tabular-nums text-[color:var(--demo-accent)]">{a.time}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-slate-900">{a.patient}</span>
                    <span className="block truncate text-xs text-slate-500">{a.type}</span>
                  </span>
                  <Pill tone={tone(a.status)}>{a.status}</Pill>
                </li>
              ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}

/* ---------------------------------- Patients ---------------------------------- */

function PatientProfile({ patient, onClose }: { patient: Patient; onClose: () => void }) {
  const [tab, setTab] = useState<'overview' | 'history' | 'treatments' | 'chart'>('overview');
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="absolute inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-[1px]" onClick={onClose}>
      <aside role="dialog" aria-modal="true" aria-label={`${patient.name} profile`} className="demo-slide flex h-full w-full max-w-md flex-col overflow-y-auto bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h3 className="text-sm font-semibold text-slate-900">Patient profile</h3>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Close profile" className="grid size-8 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]">
            <X className="size-4" aria-hidden />
          </button>
        </div>
        <div className="flex items-center gap-4 px-5 pt-5">
          <Avatar name={patient.name} size="lg" />
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold text-slate-900">{patient.name}</p>
            <p className="text-sm text-slate-500">
              {patient.age} yrs · {patient.gender}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Pill tone={tone(patient.status)}>{patient.status}</Pill>
              {patient.balance > 0 && <Pill tone="amber">Balance {money(patient.balance)}</Pill>}
            </div>
          </div>
        </div>
        <div className="mt-5 px-5">
          <Tabs
            label="Profile sections"
            value={tab}
            onChange={setTab}
            tabs={[
              { id: 'overview', label: 'Overview' },
              { id: 'history', label: 'History' },
              { id: 'treatments', label: 'Treatments' },
              { id: 'chart', label: 'Chart' },
            ]}
            className="w-full [&>button]:flex-1"
          />
        </div>
        <div className="space-y-5 px-5 py-5">
          {tab === 'overview' && (
            <>
              <dl className="space-y-3 text-sm">
                {[
                  [Phone, 'Phone', patient.phone],
                  [Mail, 'Email', patient.email],
                  [ShieldCheck, 'Insurance', patient.insurance],
                  [CalendarDays, 'Next visit', patient.nextVisit],
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
              <div>
                <p className="mb-2 text-xs font-semibold text-slate-500">Allergies</p>
                <div className="flex flex-wrap gap-1.5">
                  {patient.allergies.length ? patient.allergies.map((a) => <Pill key={a} tone="red">{a}</Pill>) : <span className="text-sm text-slate-500">None recorded</span>}
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold text-slate-500">Conditions</p>
                <div className="flex flex-wrap gap-1.5">
                  {patient.conditions.length ? patient.conditions.map((c) => <Pill key={c} tone="amber">{c}</Pill>) : <span className="text-sm text-slate-500">None recorded</span>}
                </div>
              </div>
            </>
          )}
          {tab === 'history' && (
            <ol className="space-y-4 border-l border-slate-200 pl-4">
              {patient.history.map((h) => (
                <li key={h.date + h.title} className="relative">
                  <span aria-hidden className="absolute -left-[1.4rem] top-1.5 size-2.5 rounded-full bg-[var(--demo-accent)] ring-4 ring-white" />
                  <p className="text-xs text-slate-500">{h.date}</p>
                  <p className="text-sm font-semibold text-slate-900">{h.title}</p>
                  <p className="mt-0.5 text-sm text-slate-600">{h.note}</p>
                </li>
              ))}
            </ol>
          )}
          {tab === 'treatments' && (
            <ul className="divide-y divide-slate-100">
              {TREATMENTS.slice(0, 4).map((t) => (
                <li key={t.date + t.procedure} className="flex items-center gap-3 py-2.5">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[var(--demo-accent-soft)] text-xs font-semibold text-[color:var(--demo-accent)]">{t.tooth}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-slate-900">{t.procedure}</span>
                    <span className="block text-xs text-slate-500">{t.date}</span>
                  </span>
                  <span className="text-sm tabular-nums text-slate-700">{money(t.cost)}</span>
                </li>
              ))}
            </ul>
          )}
          {tab === 'chart' && (
            <div>
              <ToothChart teeth={INITIAL_TEETH} />
              <div className="mt-3">
                <ToothLegend />
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

export function ClinicPatientsView() {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<'All' | Patient['status']>('All');
  const [doctor, setDoctor] = useState<(typeof DOCTOR_NAMES)[number]>('All doctors');
  const [layout, setLayout] = useState<'table' | 'cards'>('table');
  const [selected, setSelected] = useState<Patient | null>(null);

  const base = useMemo(() => PATIENTS.filter((p) => (doctor === 'All doctors' || p.doctor === doctor) && p.name.toLowerCase().includes(query.trim().toLowerCase())), [doctor, query]);
  const list = base.filter((p) => tab === 'All' || p.status === tab);
  const count = (status: Patient['status']) => base.filter((p) => p.status === status).length;

  return (
    <>
      <PageHeading title="Patients" description={`${list.length} of ${PATIENTS.length} patients shown`}>
        <button type="button" className="inline-flex h-9 items-center gap-2 rounded-lg bg-[var(--demo-accent)] px-3.5 text-sm font-semibold text-white hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]">
          + New patient
        </button>
      </PageHeading>

      <div className="mb-3 flex flex-wrap items-center gap-2.5">
        <label className="relative min-w-48 flex-1 sm:max-w-xs">
          <span className="sr-only">Search patients</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search patients" className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[color:var(--demo-accent)] focus:outline-2 focus:outline-[color:var(--demo-accent)]" />
        </label>
        <SelectMenu label="Dentist" value={doctor} options={DOCTOR_NAMES} onChange={setDoctor} className="w-44" />
        <div role="group" aria-label="Layout" className="ml-auto inline-flex rounded-lg bg-slate-100 p-1">
          {[
            ['table', List, 'Table'],
            ['cards', LayoutGrid, 'Cards'],
          ].map(([id, Icon, text]) => {
            const IconCmp = Icon as typeof List;
            return (
              <button key={id as string} type="button" aria-pressed={layout === id} onClick={() => setLayout(id as 'table' | 'cards')} className={cn('inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]', layout === id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600')}>
                <IconCmp className="size-4" aria-hidden />
                <span className="hidden sm:inline">{text as string}</span>
                <span className="sr-only sm:hidden">{text as string}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="mb-4">
        <Tabs label="Patient status" value={tab} onChange={setTab} tabs={[{ id: 'All', label: 'All', count: base.length }, { id: 'Active', label: 'Active', count: count('Active') }, { id: 'New', label: 'New', count: count('New') }, { id: 'Follow-up', label: 'Follow-up', count: count('Follow-up') }]} />
      </div>

      {list.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center text-sm text-slate-500">No patients match your search.</p>
      ) : layout === 'table' ? (
        <div className="demo-rise overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs font-medium text-slate-500">
              <tr>
                <th scope="col" className="px-4 py-3">Patient</th>
                <th scope="col" className="px-4 py-3">Dentist</th>
                <th scope="col" className="px-4 py-3">Last visit</th>
                <th scope="col" className="px-4 py-3">Next visit</th>
                <th scope="col" className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {list.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3">
                    <button type="button" onClick={() => setSelected(p)} className="flex items-center gap-3 rounded-md text-left focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]">
                      <Avatar name={p.name} />
                      <span>
                        <span className="block font-medium text-slate-900">{p.name}</span>
                        <span className="block text-xs text-slate-500">{p.age} yrs</span>
                      </span>
                    </button>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{p.doctor}</td>
                  <td className="px-4 py-3 text-slate-600">{p.lastVisit}</td>
                  <td className="px-4 py-3 text-slate-600">{p.nextVisit}</td>
                  <td className="px-4 py-3">
                    <Pill tone={tone(p.status)}>{p.status}</Pill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((p, i) => (
            <li key={p.id}>
              <PatientCard patient={p} index={i} onOpen={() => setSelected(p)} />
            </li>
          ))}
        </ul>
      )}
      {selected && <PatientProfile patient={selected} onClose={() => setSelected(null)} />}
    </>
  );
}

/* ---------------------------------- Appointments ---------------------------------- */

const MONTH_OFFSET = 3; // 1 October 2026 is a Thursday; weeks start on Monday.
const isClosed = (date: number) => (date - 1 + MONTH_OFFSET) % 7 === 6;
const HOURS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00'];

function appointmentsFor(date: number): Appointment[] {
  return isClosed(date) ? [] : APPOINTMENTS.filter((_, index) => (index + date) % 4 !== 0);
}

const NEXT_STATUS: Partial<Record<AppointmentStatus, { to: AppointmentStatus; label: string }>> = {
  Pending: { to: 'Confirmed', label: 'Confirm' },
  Confirmed: { to: 'Checked in', label: 'Check in' },
  'Checked in': { to: 'In progress', label: 'Start' },
  'In progress': { to: 'Completed', label: 'Complete' },
};

export function ClinicAppointmentsView() {
  const [date, setDate] = useState(5);
  const [doctor, setDoctor] = useState<(typeof DOCTOR_NAMES)[number]>('All doctors');
  const [tab, setTab] = useState<'schedule' | 'cards'>('schedule');
  const [overrides, setOverrides] = useState<Record<string, AppointmentStatus>>({});

  const day = appointmentsFor(date)
    .filter((a) => doctor === 'All doctors' || a.doctor === doctor)
    .map((a) => ({ ...a, status: overrides[a.id] ?? a.status }));
  const advance = (a: Appointment) => {
    const next = NEXT_STATUS[a.status];
    if (next) setOverrides((current) => ({ ...current, [a.id]: next.to }));
  };
  const cells = [...Array(MONTH_OFFSET).fill(null), ...Array.from({ length: 31 }, (_, i) => i + 1)];

  return (
    <>
      <PageHeading title="Appointments" description={`${day.length} appointment${day.length === 1 ? '' : 's'} on ${date} October`}>
        <SelectMenu label="Dentist" value={doctor} options={DOCTOR_NAMES} onChange={setDoctor} className="w-44" />
      </PageHeading>
      <div className="grid gap-3 xl:grid-cols-[17rem_1fr]">
        <Panel title="October 2026" index={0} className="self-start">
          <div className="grid grid-cols-7 gap-1 text-center">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
              <span key={i} className="pb-1 text-[11px] font-medium text-slate-500">
                {d}
              </span>
            ))}
            {cells.map((d, i) =>
              d === null ? (
                <span key={`blank-${i}`} />
              ) : (
                <button
                  key={d}
                  type="button"
                  aria-pressed={d === date}
                  aria-label={`${d} October${isClosed(d) ? ', closed' : ''}`}
                  disabled={isClosed(d)}
                  onClick={() => setDate(d)}
                  className={cn('relative grid aspect-square place-items-center rounded-lg text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]', d === date ? 'bg-[var(--demo-accent)] text-white' : isClosed(d) ? 'text-slate-300' : 'text-slate-700 hover:bg-slate-100')}
                >
                  {d}
                  {!isClosed(d) && d !== date && <span aria-hidden className="absolute bottom-1 size-1 rounded-full bg-[var(--demo-good)]" />}
                </button>
              ),
            )}
          </div>
          <p className="mt-3 text-[11px] text-slate-500">Sundays are closed.</p>
        </Panel>

        <div className="min-w-0">
          <Tabs label="Appointment view" value={tab} onChange={setTab} tabs={[{ id: 'schedule', label: 'Day schedule' }, { id: 'cards', label: 'Appointment cards', count: day.length }]} />
          <div key={`${tab}-${date}-${doctor}`} className="demo-rise mt-3">
            {day.length === 0 ? (
              <p className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center text-sm text-slate-500">{isClosed(date) ? 'The clinic is closed on Sundays.' : 'No appointments for this selection.'}</p>
            ) : tab === 'schedule' ? (
              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                <div className="grid min-w-[34rem] grid-cols-[3.5rem_repeat(3,1fr)] text-xs">
                  <div className="border-b border-slate-100 bg-slate-50 px-2 py-2.5" />
                  {CALENDAR_DOCTORS.map((d) => (
                    <div key={d.id} className="border-b border-l border-slate-100 bg-slate-50 px-3 py-2.5 font-semibold text-slate-700">
                      {d.name}
                    </div>
                  ))}
                  {HOURS.map((hour) => (
                    <div key={hour} className="contents">
                      <div className="border-b border-slate-100 px-2 py-3 tabular-nums text-slate-500">{hour}</div>
                      {CALENDAR_DOCTORS.map((d) => {
                        const slot = day.filter((a) => a.doctor === d.name && a.time.slice(0, 2) === hour.slice(0, 2));
                        return (
                          <div key={d.id} className="min-h-14 space-y-1 border-b border-l border-slate-100 p-1">
                            {slot.map((a) => (
                              <button key={a.id} type="button" onClick={() => advance(a)} title={NEXT_STATUS[a.status] ? `${NEXT_STATUS[a.status]?.label}` : a.status} className={cn('block w-full rounded-md border-l-[3px] px-2 py-1.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]', a.status === 'Completed' ? 'border-slate-300 bg-slate-100 text-slate-600' : a.status === 'Pending' ? 'border-amber-400 bg-amber-50 text-amber-900' : 'border-[color:var(--demo-accent)] bg-[var(--demo-accent-soft)] text-slate-900')}>
                                <span className="block truncate font-semibold">
                                  {a.time} · {a.patient}
                                </span>
                                <span className="block truncate text-[11px] opacity-80">{a.type}</span>
                              </button>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                {day.map((a, i) => (
                  <li key={a.id}>
                    <AppointmentCard appointment={a} index={i} action={NEXT_STATUS[a.status] ? { label: NEXT_STATUS[a.status]!.label, onClick: () => advance(a) } : undefined} />
                  </li>
                ))}
              </ul>
            )}
            {tab === 'schedule' && day.length > 0 && <p className="mt-2 text-xs text-slate-500">Tip: select an appointment to move it to its next step.</p>}
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------------------------------- Doctors ---------------------------------- */

const WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function ClinicDoctorsView() {
  const [selected, setSelected] = useState(DOCTORS[0].id);
  const doctor = DOCTORS.find((d) => d.id === selected) ?? DOCTORS[0];
  const todays = APPOINTMENTS.filter((a) => a.doctor === doctor.name);
  return (
    <>
      <PageHeading title="Doctors" description="Select a doctor to see their weekly schedule." />
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {DOCTORS.map((d, i) => (
          <li key={d.id}>
            <button type="button" aria-pressed={d.id === selected} onClick={() => setSelected(d.id)} className={cn('demo-rise block w-full rounded-xl border bg-white p-4 text-left transition-[border-color,box-shadow] hover:shadow-md focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]', d.id === selected ? 'border-[color:var(--demo-accent)] ring-1 ring-[color:var(--demo-accent)]' : 'border-slate-200')} style={{ ['--i' as string]: i }}>
              <span className="flex items-center gap-3">
                <Avatar name={d.name} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-slate-900">{d.name}</span>
                  <span className="block truncate text-xs text-slate-500">{d.specialty}</span>
                </span>
                <Pill tone={tone(d.status)}>{d.status}</Pill>
              </span>
              <span className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
                <span>
                  {d.room} · {d.patientsToday} patients today
                </span>
                <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                  <Star className="size-3.5 fill-amber-400 text-amber-400" aria-hidden /> {d.rating}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <Panel title={`${doctor.name}: weekly schedule`} index={2}>
          <ul key={doctor.id} className="space-y-2">
            {WEEK.map((day, i) => {
              const works = doctor.days.includes(day);
              return (
                <li key={day} className="demo-rise flex items-center gap-3 text-sm" style={{ ['--i' as string]: i }}>
                  <span className="w-9 text-xs font-medium text-slate-500">{day}</span>
                  <span className={cn('flex-1 rounded-lg px-3 py-2 text-xs font-medium', works ? 'bg-[var(--demo-accent-soft)] text-[color:var(--demo-accent-ink)]' : 'bg-slate-100 text-slate-500')}>{works ? '09:00 – 17:00 · Surgery hours' : 'Not working'}</span>
                </li>
              );
            })}
          </ul>
        </Panel>
        <Panel title="Today" index={3} action={<span className="text-xs text-slate-500">{todays.length} appointments</span>}>
          {todays.length ? (
            <ul className="divide-y divide-slate-100">
              {todays.map((a) => (
                <li key={a.id} className="flex items-center gap-3 py-2.5">
                  <span className="w-11 text-xs font-semibold tabular-nums text-[color:var(--demo-accent)]">{a.time}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-slate-900">{a.patient}</span>
                    <span className="block truncate text-xs text-slate-500">{a.type}</span>
                  </span>
                  <Pill tone={tone(a.status)}>{a.status}</Pill>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-6 text-center text-sm text-slate-500">No appointments today.</p>
          )}
        </Panel>
      </div>
    </>
  );
}
