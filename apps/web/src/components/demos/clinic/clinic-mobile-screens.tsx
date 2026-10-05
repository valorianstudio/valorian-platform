'use client';

import { Bell, CalendarCheck, CalendarDays, Check, ChevronRight, ClipboardList, FileHeart, House, Lock, LogOut, Mail, Pill as PillIcon, Search, Settings, ShieldCheck, Stethoscope, Star, UserRound, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useId, useState } from 'react';
import { Avatar, Pill } from '@/components/demos/shared/app-ui';
import { AppHeader, Body, Card } from '@/components/demos/shared/mobile-kit';
import { APPOINTMENTS, DOCTORS, DOCTOR_SPECIALTY, INITIAL_TEETH, PATIENTS, PRESCRIPTIONS, SLOTS, SPECIALTIES } from '@/data/clinic/app';
import { cn } from '@/lib/cn';
import { ClinicLogo } from './clinic-logo';
import { tone } from './clinic-cards';
import { ToothChart, ToothLegend } from './tooth-chart';

/** Screens of the patient and doctor mobile apps. Compact, touch-sized and driven by dummy data. */

export type PatientScreen = 'login' | 'home' | 'book' | 'doctors' | 'records' | 'prescription' | 'profile';
export type DoctorScreen = 'home' | 'patients' | 'schedule' | 'notes';

export const PATIENT_NAV: { id: Exclude<PatientScreen, 'login' | 'prescription'>; label: string; icon: LucideIcon }[] = [
  { id: 'home', label: 'Home', icon: House },
  { id: 'doctors', label: 'Doctors', icon: Stethoscope },
  { id: 'book', label: 'Book', icon: CalendarCheck },
  { id: 'records', label: 'Records', icon: FileHeart },
  { id: 'profile', label: 'Profile', icon: UserRound },
];

export const DOCTOR_NAV: { id: DoctorScreen; label: string; icon: LucideIcon }[] = [
  { id: 'home', label: 'Home', icon: House },
  { id: 'patients', label: 'Patients', icon: Users },
  { id: 'schedule', label: 'Schedule', icon: CalendarDays },
  { id: 'notes', label: 'Notes', icon: ClipboardList },
];

const primaryButton = 'flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[var(--demo-accent)] text-sm font-semibold text-white hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]';

/* ---------------------------------- Patient app ---------------------------------- */

export function PatientLogin({ onSignIn }: { onSignIn: () => void }) {
  const field = 'flex h-10 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-[13px] text-slate-500';
  return (
    <div className="flex flex-1 flex-col bg-white px-5 pb-6 pt-6">
      <ClinicLogo />
      <h3 className="mt-8 text-xl font-semibold tracking-tight text-slate-900">Welcome back</h3>
      <p className="mt-1 text-[13px] text-slate-500">Sign in to manage your visits and records.</p>
      <div className="mt-6 space-y-3">
        <div className={field}>
          <Mail className="size-4 text-slate-400" aria-hidden /> hannah.l@mail.example
        </div>
        <div className={field}>
          <Lock className="size-4 text-slate-400" aria-hidden /> ••••••••••
        </div>
      </div>
      <p className="mt-3 text-right text-xs font-medium text-[color:var(--demo-accent)]">Forgot password?</p>
      <button type="button" onClick={onSignIn} className={cn(primaryButton, 'mt-auto')}>
        Sign in
      </button>
      <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
        <ShieldCheck className="size-3.5" aria-hidden /> Demo app: tap Sign in to continue.
      </p>
    </div>
  );
}

export function PatientHome({ go }: { go: (screen: PatientScreen) => void }) {
  const actions: { id: PatientScreen; label: string; icon: LucideIcon }[] = [
    { id: 'book', label: 'Book', icon: CalendarCheck },
    { id: 'doctors', label: 'Doctors', icon: Stethoscope },
    { id: 'records', label: 'Records', icon: FileHeart },
    { id: 'prescription', label: 'Rx', icon: PillIcon },
  ];
  return (
    <>
      <AppHeader subtitle="Good morning" title="Hannah Lindqvist" right={<button type="button" aria-label="Open profile" onClick={() => go('profile')} className="rounded-full focus-visible:outline-2 focus-visible:outline-white"><Avatar name="Hannah Lindqvist" /></button>} />
      <Body>
        <div className="rounded-xl bg-clinic-teal-ink p-3.5 text-white">
          <p className="text-[11px] font-medium text-white/80">Next appointment</p>
          <p className="mt-1 text-sm font-semibold">Check-up · Dr. Amara Okoye</p>
          <p className="mt-0.5 text-xs text-white/80">Mon 12 Oct · 10:30 · Room 1</p>
          <div className="mt-3 flex gap-2">
            <span className="rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-semibold">Confirmed</span>
            <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-clinic-teal-ink">Reschedule</span>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {actions.map(({ id, label, icon: Icon }) => (
            <button key={id} type="button" onClick={() => go(id)} className="flex flex-col items-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2.5 text-[10px] font-medium text-slate-700 active:scale-95 focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]">
              <span className="grid size-8 place-items-center rounded-lg bg-[var(--demo-accent-soft)] text-[color:var(--demo-accent)]">
                <Icon className="size-4" aria-hidden />
              </span>
              {label}
            </button>
          ))}
        </div>
        <Card>
          <p className="text-xs font-semibold text-slate-900">Reminder</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-600">Fluoride gel nightly until 24 Oct. Floss before brushing for best results.</p>
        </Card>
        <Card className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-lg bg-[var(--demo-good-soft)] text-[color:var(--demo-good-ink)]">
            <Bell className="size-4" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-900">Invoice paid</p>
            <p className="text-[11px] text-slate-500">$120 · Scale and polish</p>
          </div>
        </Card>
      </Body>
    </>
  );
}

const DAYS = [
  { id: '12', label: 'Mon', date: '12' },
  { id: '13', label: 'Tue', date: '13' },
  { id: '14', label: 'Wed', date: '14' },
  { id: '15', label: 'Thu', date: '15' },
  { id: '16', label: 'Fri', date: '16' },
];

export function PatientBooking({ initialDoctor }: { initialDoctor: string }) {
  const [doctor, setDoctor] = useState(initialDoctor);
  const [day, setDay] = useState('12');
  const [slot, setSlot] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const picked = DOCTORS.find((d) => d.id === doctor) ?? DOCTORS[0];

  if (done) {
    return (
      <>
        <AppHeader subtitle="Appointment" title="Booked" />
        <Body>
          <Card className="demo-rise flex flex-col items-center py-8 text-center">
            <span className="grid size-12 place-items-center rounded-full bg-[var(--demo-good-soft)] text-[color:var(--demo-good-ink)]">
              <Check className="size-6" aria-hidden />
            </span>
            <p className="mt-3 text-base font-semibold text-slate-900">You are booked</p>
            <p className="mt-1 text-xs text-slate-600">
              {picked.name}
              <br />
              {DAYS.find((d) => d.id === day)?.label} {day} Oct · {slot}
            </p>
          </Card>
          <button type="button" onClick={() => { setDone(false); setSlot(null); }} className="h-10 w-full rounded-lg border border-slate-300 bg-white text-sm font-semibold text-slate-700 hover:border-slate-900 focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]">
            Book another
          </button>
        </Body>
      </>
    );
  }

  return (
    <>
      <AppHeader subtitle="Step by step" title="Book appointment" />
      <Body>
        <div>
          <p className="mb-1.5 text-xs font-semibold text-slate-900">Doctor</p>
          <div role="radiogroup" aria-label="Doctor" className="space-y-1.5">
            {DOCTORS.slice(0, 3).map((d) => (
              <button key={d.id} type="button" role="radio" aria-checked={d.id === doctor} onClick={() => setDoctor(d.id)} className={cn('flex w-full items-center gap-2.5 rounded-xl border bg-white p-2.5 text-left focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]', d.id === doctor ? 'border-[color:var(--demo-accent)] ring-1 ring-[color:var(--demo-accent)]' : 'border-slate-200')}>
                <Avatar name={d.name} size="sm" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-semibold text-slate-900">{d.name}</span>
                  <span className="block truncate text-[11px] text-slate-500">{d.specialty}</span>
                </span>
                {d.id === doctor && <Check className="size-4 text-[color:var(--demo-accent)]" aria-hidden />}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-1.5 text-xs font-semibold text-slate-900">Date</p>
          <div role="radiogroup" aria-label="Date" className="grid grid-cols-5 gap-1.5">
            {DAYS.map((d) => (
              <button key={d.id} type="button" role="radio" aria-checked={d.id === day} onClick={() => setDay(d.id)} className={cn('rounded-lg py-1.5 text-center focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]', d.id === day ? 'bg-[var(--demo-accent)] text-white' : 'bg-white text-slate-700 ring-1 ring-inset ring-slate-200')}>
                <span className="block text-[10px] opacity-80">{d.label}</span>
                <span className="block text-sm font-semibold tabular-nums">{d.date}</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-1.5 text-xs font-semibold text-slate-900">Time</p>
          <div role="radiogroup" aria-label="Time" className="grid grid-cols-3 gap-1.5">
            {SLOTS.map((s) => (
              <button key={s} type="button" role="radio" aria-checked={s === slot} onClick={() => setSlot(s)} className={cn('rounded-lg py-1.5 text-xs font-semibold tabular-nums focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]', s === slot ? 'bg-[var(--demo-accent)] text-white' : 'bg-white text-slate-700 ring-1 ring-inset ring-slate-200')}>
                {s}
              </button>
            ))}
          </div>
        </div>
        <button type="button" disabled={!slot} onClick={() => setDone(true)} className={cn(primaryButton, 'disabled:opacity-40')}>
          Confirm booking
        </button>
      </Body>
    </>
  );
}

export function PatientDoctors({ onBook }: { onBook: (doctorId: string) => void }) {
  const [query, setQuery] = useState('');
  const [specialty, setSpecialty] = useState<(typeof SPECIALTIES)[number]>('All');
  const id = useId();
  const list = DOCTORS.filter((d) => (specialty === 'All' || DOCTOR_SPECIALTY[d.id] === specialty) && `${d.name} ${d.specialty}`.toLowerCase().includes(query.trim().toLowerCase()));
  return (
    <>
      <AppHeader subtitle="Find a specialist" title="Doctors" />
      <div className="shrink-0 space-y-2.5 border-b border-slate-200 bg-white px-3.5 py-3">
        <label htmlFor={id} className="relative block">
          <span className="sr-only">Search doctors</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden />
          <input id={id} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search doctors" className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-[13px] text-slate-900 placeholder:text-slate-400 focus:border-[color:var(--demo-accent)] focus:outline-2 focus:outline-[color:var(--demo-accent)]" />
        </label>
        <div role="group" aria-label="Specialty" className="-mx-0.5 flex gap-1.5 overflow-x-auto px-0.5">
          {SPECIALTIES.map((s) => (
            <button key={s} type="button" aria-pressed={s === specialty} onClick={() => setSpecialty(s)} className={cn('shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]', s === specialty ? 'bg-[var(--demo-accent)] text-white' : 'bg-slate-100 text-slate-600')}>
              {s}
            </button>
          ))}
        </div>
      </div>
      <Body>
        {list.length === 0 && <p className="py-8 text-center text-xs text-slate-500">No doctors match your search.</p>}
        {list.map((d) => (
          <Card key={d.id} className="flex items-center gap-2.5">
            <Avatar name={d.name} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold text-slate-900">{d.name}</p>
              <p className="truncate text-[11px] text-slate-500">{d.specialty}</p>
              <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-medium text-slate-700">
                <Star className="size-3 fill-amber-400 text-amber-400" aria-hidden /> {d.rating}
              </p>
            </div>
            <button type="button" onClick={() => onBook(d.id)} disabled={d.status === 'Off today'} className="rounded-lg bg-[var(--demo-accent)] px-3 py-1.5 text-[11px] font-semibold text-white hover:brightness-110 disabled:bg-slate-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]">
              Book
            </button>
          </Card>
        ))}
      </Body>
    </>
  );
}

export function PatientRecords({ go }: { go: (screen: PatientScreen) => void }) {
  const [tab, setTab] = useState<'visits' | 'chart'>('visits');
  const patient = PATIENTS[0];
  return (
    <>
      <AppHeader subtitle="Hannah Lindqvist" title="Medical records" />
      <div role="tablist" aria-label="Records" className="flex shrink-0 gap-1.5 border-b border-slate-200 bg-white px-3.5 py-2.5">
        {(['visits', 'chart'] as const).map((t) => (
          <button key={t} role="tab" type="button" aria-selected={tab === t} onClick={() => setTab(t)} className={cn('flex-1 rounded-lg py-1.5 text-xs font-semibold focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]', tab === t ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600')}>
            {t === 'visits' ? 'Visits' : 'Dental chart'}
          </button>
        ))}
      </div>
      <Body>
        <div key={tab} className="demo-slide space-y-2.5">
          {tab === 'visits' ? (
            <>
              {patient.history.map((h) => (
                <Card key={h.date + h.title}>
                  <p className="text-[11px] text-slate-500">{h.date}</p>
                  <p className="text-[13px] font-semibold text-slate-900">{h.title}</p>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-slate-600">{h.note}</p>
                </Card>
              ))}
              <button type="button" onClick={() => go('prescription')} className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white p-3 text-left focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]">
                <span className="flex items-center gap-2.5 text-[13px] font-semibold text-slate-900">
                  <PillIcon className="size-4 text-[color:var(--demo-accent)]" aria-hidden /> My prescriptions
                </span>
                <ChevronRight className="size-4 text-slate-400" aria-hidden />
              </button>
            </>
          ) : (
            <Card>
              <ToothChart teeth={INITIAL_TEETH} />
              <div className="mt-2">
                <ToothLegend />
              </div>
            </Card>
          )}
        </div>
      </Body>
    </>
  );
}

export function PatientPrescriptions() {
  const [refills, setRefills] = useState<Record<string, boolean>>({});
  const mine = PRESCRIPTIONS.filter((p) => p.patient === 'Hannah Lindqvist' || p.patient === 'Grace Whitmore').slice(0, 3);
  return (
    <>
      <AppHeader subtitle="From your dentist" title="Prescriptions" />
      <Body>
        {mine.map((p) => (
          <Card key={p.id}>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold text-slate-900">{p.drug}</p>
                <p className="text-[11px] text-slate-600">{p.dose}</p>
              </div>
              <Pill tone={tone(p.status)}>{p.status}</Pill>
            </div>
            <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500">
              <span>
                {p.duration} · {p.date}
              </span>
              <button type="button" onClick={() => setRefills((r) => ({ ...r, [p.id]: true }))} className={cn('rounded-md px-2.5 py-1 font-semibold focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]', refills[p.id] ? 'bg-[var(--demo-good-soft)] text-[color:var(--demo-good-ink)]' : 'bg-slate-900 text-white')}>
                {refills[p.id] ? 'Refill requested' : 'Request refill'}
              </button>
            </div>
          </Card>
        ))}
      </Body>
    </>
  );
}

export function PatientProfile({ onSignOut }: { onSignOut: () => void }) {
  const rows: [LucideIcon, string][] = [
    [ShieldCheck, 'Insurance: BlueShield Plus'],
    [Bell, 'Notifications'],
    [Settings, 'Settings'],
  ];
  return (
    <>
      <AppHeader subtitle="Patient" title="Profile" />
      <Body>
        <Card className="flex flex-col items-center py-5 text-center">
          <Avatar name="Hannah Lindqvist" size="lg" />
          <p className="mt-3 text-base font-semibold text-slate-900">Hannah Lindqvist</p>
          <p className="text-xs text-slate-500">34 yrs · Patient ID BD-3108</p>
        </Card>
        <Card className="divide-y divide-slate-100 p-0">
          {rows.map(([Icon, label]) => (
            <div key={label} className="flex items-center gap-3 px-3 py-3 text-[13px] text-slate-700">
              <Icon className="size-4 text-slate-500" aria-hidden />
              {label}
              <ChevronRight className="ml-auto size-4 text-slate-300" aria-hidden />
            </div>
          ))}
        </Card>
        <button type="button" onClick={onSignOut} className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white text-sm font-semibold text-slate-700 hover:border-slate-900 focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]">
          <LogOut className="size-4" aria-hidden /> Sign out
        </button>
      </Body>
    </>
  );
}

/* ---------------------------------- Doctor app ---------------------------------- */

const MINE = APPOINTMENTS.filter((a) => a.doctor === 'Dr. Amara Okoye');

export function DoctorHome({ go }: { go: (screen: DoctorScreen) => void }) {
  const next = MINE.find((a) => a.status === 'In progress') ?? MINE[0];
  return (
    <>
      <AppHeader subtitle="Good morning" title="Dr. Amara Okoye" right={<Avatar name="Dr. Amara Okoye" />} />
      <Body>
        <div className="grid grid-cols-3 gap-2">
          {[
            ['Patients', '9'],
            ['Done', '2'],
            ['Waiting', '1'],
          ].map(([label, value]) => (
            <Card key={label} className="text-center">
              <p className="text-lg font-semibold tabular-nums text-slate-900">{value}</p>
              <p className="text-[10px] text-slate-500">{label}</p>
            </Card>
          ))}
        </div>
        <div className="rounded-xl bg-[var(--demo-accent)] p-3.5 text-white">
          <p className="text-[11px] font-medium text-white/80">In the chair now</p>
          <p className="mt-1 text-sm font-semibold">{next.patient}</p>
          <p className="text-xs text-white/80">
            {next.type} · {next.time}
          </p>
          <button type="button" onClick={() => go('notes')} className="mt-3 rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-[color:var(--demo-accent)] focus-visible:outline-2 focus-visible:outline-white">
            Add note
          </button>
        </div>
        <p className="px-0.5 text-xs font-semibold text-slate-900">Up next</p>
        {MINE.filter((a) => ['Confirmed', 'Pending'].includes(a.status))
          .slice(0, 3)
          .map((a) => (
            <Card key={a.id} className="flex items-center gap-3">
              <span className="w-10 text-xs font-semibold tabular-nums text-[color:var(--demo-accent)]">{a.time}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-slate-900">{a.patient}</p>
                <p className="truncate text-[11px] text-slate-500">{a.type}</p>
              </div>
              <Pill tone={tone(a.status)}>{a.status}</Pill>
            </Card>
          ))}
      </Body>
    </>
  );
}

export function DoctorPatients() {
  return (
    <>
      <AppHeader subtitle="Your patients" title="Patients" />
      <Body>
        {PATIENTS.filter((p) => p.doctor === 'Dr. Amara Okoye').map((p) => (
          <Card key={p.id} className="flex items-center gap-2.5">
            <Avatar name={p.name} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold text-slate-900">{p.name}</p>
              <p className="truncate text-[11px] text-slate-500">
                {p.age} yrs · Next {p.nextVisit}
              </p>
            </div>
            <Pill tone={tone(p.status)}>{p.status}</Pill>
          </Card>
        ))}
      </Body>
    </>
  );
}

const WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

export function DoctorSchedule() {
  const [day, setDay] = useState(0);
  const list = MINE.filter((_, i) => (i + day) % 4 !== 3);
  return (
    <>
      <AppHeader subtitle="Week of 5 October" title="Schedule" />
      <div role="tablist" aria-label="Day" className="flex shrink-0 gap-1.5 border-b border-slate-200 bg-white px-3.5 py-2.5">
        {WEEK.map((d, i) => (
          <button key={d} role="tab" type="button" aria-selected={day === i} onClick={() => setDay(i)} className={cn('flex-1 rounded-lg py-1.5 text-xs font-semibold focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]', day === i ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600')}>
            {d}
          </button>
        ))}
      </div>
      <Body>
        <div key={day} className="demo-slide space-y-2">
          {list.map((a) => (
            <Card key={a.id} className="flex items-center gap-3 border-l-[3px] border-l-[color:var(--demo-accent)]">
              <span className="w-10 text-xs font-semibold tabular-nums text-[color:var(--demo-accent)]">{a.time}</span>
              <div className="min-w-0">
                <p className="truncate text-[13px] font-medium text-slate-900">{a.patient}</p>
                <p className="truncate text-[11px] text-slate-500">
                  {a.type} · {a.room}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </Body>
    </>
  );
}

export function DoctorNotes() {
  const [draft, setDraft] = useState('');
  const [notes, setNotes] = useState<string[]>(['Marcus Reed: temporary crown stable. Final fit on 14 Oct.', 'Oliver Grant: advise soft diet for 48 h after molar repair.']);
  const id = useId();
  return (
    <>
      <AppHeader subtitle="Clinical notes" title="Notes" />
      <Body>
        <Card>
          <label htmlFor={id} className="sr-only">
            New note
          </label>
          <textarea id={id} rows={3} value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Write a note…" className="w-full resize-none rounded-lg border border-slate-200 px-2.5 py-2 text-[13px] text-slate-900 placeholder:text-slate-400 focus:border-[color:var(--demo-accent)] focus:outline-2 focus:outline-[color:var(--demo-accent)]" />
          <button
            type="button"
            disabled={!draft.trim()}
            onClick={() => {
              setNotes((n) => [draft.trim(), ...n]);
              setDraft('');
            }}
            className={cn(primaryButton, 'mt-2 h-9 disabled:opacity-40')}
          >
            Save note
          </button>
        </Card>
        {notes.map((note, i) => (
          <Card key={note + i} className="demo-rise border-l-[3px] border-l-[color:var(--demo-good)]">
            <p className="text-[12px] leading-relaxed text-slate-700">{note}</p>
          </Card>
        ))}
      </Body>
    </>
  );
}
