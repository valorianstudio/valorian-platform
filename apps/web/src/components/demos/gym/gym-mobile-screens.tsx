'use client';

import { Activity, Bell, Calendar, Check, ChevronRight, ClipboardList, Clock, CreditCard, Dumbbell, Flame, House, Lock, LogOut, Mail, MessageCircle, Send, Settings, ShieldCheck, Star, Trophy, UserRound, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useId, useState } from 'react';
import { Avatar, Pill } from '@/components/demos/shared/app-ui';
import { AppHeader, Body, Card } from '@/components/demos/shared/mobile-kit';
import { CHAT, CLASSES, MEMBERS, PROGRESS, TODAY_WORKOUT } from '@/data/gym/app';
import { cn } from '@/lib/cn';
import { GymLogo } from './gym-logo';
import { tone } from './gym-cards';

/** Screens of the member and trainer mobile apps. Compact, touch-sized and driven by dummy data. */

export type MemberScreen = 'splash' | 'login' | 'home' | 'workout' | 'chat' | 'progress' | 'booking' | 'profile';
export type TrainerScreen = 'dashboard' | 'clients' | 'assign' | 'schedule';

export const MEMBER_NAV: { id: Exclude<MemberScreen, 'splash' | 'login'>; label: string; icon: LucideIcon }[] = [
  { id: 'home', label: 'Home', icon: House },
  { id: 'workout', label: 'Workout', icon: Dumbbell },
  { id: 'booking', label: 'Classes', icon: Calendar },
  { id: 'progress', label: 'Progress', icon: Activity },
  { id: 'profile', label: 'Profile', icon: UserRound },
];

export const TRAINER_NAV: { id: TrainerScreen; label: string; icon: LucideIcon }[] = [
  { id: 'dashboard', label: 'Home', icon: House },
  { id: 'clients', label: 'Clients', icon: Users },
  { id: 'assign', label: 'Assign', icon: ClipboardList },
  { id: 'schedule', label: 'Schedule', icon: Calendar },
];

const primary = 'flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[var(--demo-accent)] text-sm font-semibold text-white hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]';

/* ---------------------------------- Member app ---------------------------------- */

export function MemberSplash({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center bg-gym px-6 pb-8 pt-16 text-center">
      <span className="grid size-20 animate-pulse-soft place-items-center rounded-3xl bg-gym-blue text-white shadow-[0_20px_40px_-12px_rgb(37_99_235/0.6)]">
        <Dumbbell className="size-9" aria-hidden />
      </span>
      <h3 className="mt-8 text-2xl font-bold tracking-tight text-white">FORGE</h3>
      <p className="mt-2 text-[13px] text-white/70">Train smarter. Show up stronger.</p>
      <button type="button" onClick={onStart} className="mt-auto h-11 w-full rounded-xl bg-white text-sm font-semibold text-gym hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
        Get started
      </button>
    </div>
  );
}

export function MemberLogin({ onSignIn }: { onSignIn: () => void }) {
  const field = 'flex h-10 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-[13px] text-slate-500';
  return (
    <div className="flex flex-1 flex-col bg-white px-5 pb-6 pt-6">
      <GymLogo />
      <h3 className="mt-8 text-xl font-bold tracking-tight text-slate-900">Welcome back</h3>
      <p className="mt-1 text-[13px] text-slate-500">Sign in to book classes and track progress.</p>
      <div className="mt-6 space-y-3">
        <div className={field}>
          <Mail className="size-4 text-slate-400" aria-hidden /> hannah.l@mail.example
        </div>
        <div className={field}>
          <Lock className="size-4 text-slate-400" aria-hidden /> ••••••••••
        </div>
      </div>
      <button type="button" onClick={onSignIn} className={cn(primary, 'mt-auto')}>
        Sign in
      </button>
      <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
        <ShieldCheck className="size-3.5" aria-hidden /> Demo app: tap Sign in to continue.
      </p>
    </div>
  );
}

export function MemberHome({ go }: { go: (s: MemberScreen) => void }) {
  const me = MEMBERS[0];
  return (
    <>
      <AppHeader subtitle="Good morning" title="Hannah" right={<Avatar name={me.name} />} />
      <Body>
        <div className="rounded-2xl bg-gym p-4 text-white">
          <p className="text-[11px] font-medium text-white/70">Your streak</p>
          <p className="mt-1 flex items-center gap-2 text-2xl font-bold tabular-nums">
            <Flame className="size-6 text-gym-orange" aria-hidden /> {me.streak} days
          </p>
          <div className="mt-3 flex gap-1.5">
            {me.visits.map((v, i) => (
              <span key={i} className={cn('h-2 flex-1 rounded-full', v ? 'bg-gym-green' : 'bg-white/20')} />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <Card>
            <p className="text-[11px] text-slate-500">Check-ins</p>
            <p className="text-lg font-bold tabular-nums text-slate-900">{me.checkIns}</p>
          </Card>
          <Card>
            <p className="text-[11px] text-slate-500">Goal</p>
            <p className="text-lg font-bold tabular-nums text-slate-900">{me.progress}%</p>
          </Card>
        </div>
        <Card className="border-[color:var(--demo-accent-ring)] bg-[var(--demo-accent-soft)]">
          <p className="text-[11px] font-medium text-[color:var(--demo-accent-ink)]">Next class · 18:30</p>
          <p className="mt-0.5 text-sm font-semibold text-slate-900">Run Club</p>
          <p className="text-xs text-slate-600">Marco Rossi · Track · 8 of 30 spots left</p>
        </Card>
        <div className="grid grid-cols-4 gap-2">
          {[
            ['Workout', Dumbbell, 'workout'],
            ['Classes', Calendar, 'booking'],
            ['Coach', MessageCircle, 'chat'],
            ['Progress', Trophy, 'progress'],
          ].map(([label, Icon, target]) => {
            const IconCmp = Icon as LucideIcon;
            return (
              <button key={label as string} type="button" onClick={() => go(target as MemberScreen)} className="flex flex-col items-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2.5 text-[10px] font-medium text-slate-700 active:scale-95 focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]">
                <span className="grid size-8 place-items-center rounded-lg bg-[var(--demo-accent-soft)] text-[color:var(--demo-accent)]">
                  <IconCmp className="size-4" aria-hidden />
                </span>
                {label as string}
              </button>
            );
          })}
        </div>
      </Body>
    </>
  );
}

export function MemberWorkout() {
  const [done, setDone] = useState<Record<string, boolean>>(() => Object.fromEntries(TODAY_WORKOUT.map((w) => [w.name, w.done])));
  const count = Object.values(done).filter(Boolean).length;
  return (
    <>
      <AppHeader subtitle="Strength · Week 3" title="Today's workout" right={<Pill tone="green">{count}/{TODAY_WORKOUT.length}</Pill>} />
      <Body>
        {TODAY_WORKOUT.map((w) => (
          <button key={w.name} type="button" aria-pressed={!!done[w.name]} onClick={() => setDone((s) => ({ ...s, [w.name]: !s[w.name] }))} className="block w-full text-left focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]">
            <Card className={cn('flex items-center gap-3 transition-colors', done[w.name] && 'border-[color:var(--demo-good-ring)] bg-[var(--demo-good-soft)]')}>
              <span className={cn('grid size-8 shrink-0 place-items-center rounded-full', done[w.name] ? 'bg-[var(--demo-good)] text-white' : 'bg-slate-100 text-slate-400')}>
                <Check className="size-4" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-semibold text-slate-900">{w.name}</span>
                <span className="block text-[11px] text-slate-500">
                  {w.sets} · {w.weight}
                </span>
              </span>
            </Card>
          </button>
        ))}
        <button type="button" className={cn(primary, 'mt-1')}>
          Start workout
        </button>
      </Body>
    </>
  );
}

export function MemberChat() {
  const [messages, setMessages] = useState(CHAT);
  const [draft, setDraft] = useState('');
  const id = useId();
  const send = () => {
    if (!draft.trim()) return;
    setMessages((m) => [...m, { from: 'me', text: draft.trim(), time: '08:30' }]);
    setDraft('');
  };
  return (
    <>
      <AppHeader subtitle="Online now" title="Jordan Blake" right={<Avatar name="Jordan Blake" />} />
      <div className="flex-1 space-y-2.5 overflow-y-auto bg-slate-50 p-3.5">
        {messages.map((m, i) => (
          <div key={i} className={cn('demo-rise flex', m.from === 'me' ? 'justify-end' : 'justify-start')} style={{ ['--i' as string]: i % 3 }}>
            <p className={cn('max-w-[78%] rounded-2xl px-3 py-2 text-[12px] leading-snug', m.from === 'me' ? 'rounded-br-md bg-[var(--demo-accent)] text-white' : 'rounded-bl-md bg-white text-slate-800 ring-1 ring-slate-200')}>
              {m.text}
              <span className={cn('mt-0.5 block text-[9px]', m.from === 'me' ? 'text-white/70' : 'text-slate-400')}>{m.time}</span>
            </p>
          </div>
        ))}
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          send();
        }}
        className="flex shrink-0 items-center gap-2 border-t border-slate-200 bg-white p-2.5"
      >
        <label htmlFor={id} className="sr-only">
          Message your trainer
        </label>
        <input id={id} value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Message your trainer" className="h-9 min-w-0 flex-1 rounded-full border border-slate-200 bg-slate-50 px-3 text-[12px] text-slate-900 placeholder:text-slate-400 focus:border-[color:var(--demo-accent)] focus:outline-2 focus:outline-[color:var(--demo-accent)]" />
        <button type="submit" aria-label="Send" disabled={!draft.trim()} className="grid size-9 shrink-0 place-items-center rounded-full bg-[var(--demo-accent)] text-white disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]">
          <Send className="size-4" aria-hidden />
        </button>
      </form>
    </>
  );
}

export function MemberProgress() {
  const first = PROGRESS.weight[0];
  const last = PROGRESS.weight[PROGRESS.weight.length - 1];
  const min = Math.min(...PROGRESS.weight);
  const max = Math.max(...PROGRESS.weight);
  const points = PROGRESS.weight.map((w, i) => `${(i / (PROGRESS.weight.length - 1)) * 100},${100 - ((w - min) / (max - min || 1)) * 80 - 10}`).join(' ');
  return (
    <>
      <AppHeader subtitle="Last 8 weeks" title="Progress" />
      <Body>
        <Card>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[11px] text-slate-500">Body weight</p>
              <p className="text-xl font-bold tabular-nums text-slate-900">{last} kg</p>
            </div>
            <Pill tone="green">−{(first - last).toFixed(1)} kg</Pill>
          </div>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label={`Weight from ${first} kg to ${last} kg`} className="mt-3 h-24 w-full overflow-visible">
            <polyline points={points} fill="none" stroke="var(--demo-accent)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          </svg>
        </Card>
        <Card>
          <p className="mb-2 text-xs font-semibold text-slate-900">Personal bests</p>
          <div className="space-y-2.5">
            {PROGRESS.lifts.map((lift) => (
              <div key={lift.name}>
                <div className="mb-1 flex justify-between text-[11px] text-slate-600">
                  <span>{lift.name}</span>
                  <span className="font-semibold tabular-nums text-slate-900">{lift.value} kg</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-[var(--demo-good)]" style={{ width: `${lift.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <Star className="size-5 text-gym-orange" aria-hidden />
          <p className="text-[12px] text-slate-700">New personal best on Back squat this week.</p>
        </Card>
      </Body>
    </>
  );
}

export function MemberBooking() {
  const [booked, setBooked] = useState<Record<string, boolean>>({});
  const list = CLASSES.filter((c) => c.day === 0);
  return (
    <>
      <AppHeader subtitle="Today" title="Class booking" />
      <Body>
        {list.map((c) => {
          const full = c.booked >= c.capacity && !booked[c.id];
          return (
            <Card key={c.id} className="flex items-center gap-3">
              <span className="w-12 text-xs font-semibold tabular-nums text-[color:var(--demo-accent)]">{c.time}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-slate-900">{c.name}</p>
                <p className="truncate text-[11px] text-slate-500">
                  {c.trainer} · {full ? 'Full' : `${c.capacity - c.booked - (booked[c.id] ? 1 : 0)} left`}
                </p>
              </div>
              <button type="button" aria-pressed={!!booked[c.id]} disabled={full} onClick={() => setBooked((s) => ({ ...s, [c.id]: !s[c.id] }))} className={cn('h-8 min-w-16 rounded-lg px-2.5 text-[11px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)] disabled:bg-slate-200 disabled:text-slate-500', booked[c.id] ? 'bg-[var(--demo-good-soft)] text-[color:var(--demo-good-ink)]' : 'bg-[var(--demo-accent)] text-white')}>
                {booked[c.id] ? 'Booked' : full ? 'Full' : 'Book'}
              </button>
            </Card>
          );
        })}
      </Body>
    </>
  );
}

export function MemberProfile({ onSignOut }: { onSignOut: () => void }) {
  const rows: [LucideIcon, string][] = [
    [Bell, 'Notifications'],
    [CreditCard, 'Membership: Standard'],
    [Settings, 'Settings'],
  ];
  return (
    <>
      <AppHeader subtitle="Member" title="Profile" />
      <Body>
        <Card className="flex flex-col items-center py-5 text-center">
          <Avatar name="Hannah Lindqvist" size="lg" />
          <p className="mt-3 text-base font-semibold text-slate-900">Hannah Lindqvist</p>
          <p className="text-xs text-slate-500">Premium member · Renews 12 Nov</p>
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


/* ---------------------------------- Trainer app ---------------------------------- */

export function TrainerHome({ go }: { go: (s: TrainerScreen) => void }) {
  return (
    <>
      <AppHeader subtitle="Good morning" title="Jordan Blake" right={<Avatar name="Jordan Blake" />} />
      <Body>
        <div className="grid grid-cols-3 gap-2">
          {[
            ['Sessions', '4'],
            ['Clients', '14'],
            ['Unread', '2'],
          ].map(([label, value]) => (
            <Card key={label} className="text-center">
              <p className="text-lg font-bold tabular-nums text-slate-900">{value}</p>
              <p className="text-[10px] text-slate-500">{label}</p>
            </Card>
          ))}
        </div>
        <p className="px-0.5 text-xs font-semibold text-slate-900">Next session</p>
        <Card className="border-[color:var(--demo-accent-ring)] bg-[var(--demo-accent-soft)]">
          <p className="text-[11px] font-medium text-[color:var(--demo-accent-ink)]">09:00 · Strength Foundations</p>
          <p className="mt-0.5 text-sm font-semibold text-slate-900">Hannah Lindqvist</p>
          <button type="button" onClick={() => go('assign')} className="mt-2.5 rounded-lg bg-[var(--demo-accent)] px-3 py-1.5 text-[11px] font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--demo-accent)]">
            Open workout
          </button>
        </Card>
        <p className="px-0.5 text-xs font-semibold text-slate-900">Messages</p>
        <Card className="flex items-center gap-3">
          <Avatar name="Marcus Reed" size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-slate-900">Marcus Reed</p>
            <p className="truncate text-[11px] text-slate-500">Can we add more leg work?</p>
          </div>
        </Card>
      </Body>
    </>
  );
}

export function TrainerClients() {
  const mine = MEMBERS.filter((m) => m.trainer === 'Jordan Blake');
  return (
    <>
      <AppHeader subtitle={`${mine.length} assigned`} title="My clients" />
      <Body>
        {mine.map((m) => (
          <Card key={m.id} className="flex items-center gap-3">
            <Avatar name={m.name} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold text-slate-900">{m.name}</p>
              <p className="truncate text-[11px] text-slate-500">{m.goal}</p>
            </div>
            <Pill tone={tone(m.status)}>{m.status}</Pill>
          </Card>
        ))}
      </Body>
    </>
  );
}

export function TrainerAssign() {
  const [sent, setSent] = useState(false);
  return (
    <>
      <AppHeader subtitle="Hannah Lindqvist" title="Assign workout" />
      <Body>
        {TODAY_WORKOUT.slice(0, 4).map((w) => (
          <Card key={w.name} className="flex items-center gap-3 py-2.5">
            <Dumbbell className="size-4 text-slate-400" aria-hidden />
            <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-slate-900">{w.name}</span>
            <span className="text-[11px] text-slate-500">{w.sets}</span>
          </Card>
        ))}
        <button type="button" onClick={() => setSent(true)} className={cn(primary, sent && 'bg-[var(--demo-good)] hover:bg-[var(--demo-good)]')}>
          {sent ? (
            <>
              <Check className="size-4" aria-hidden /> Sent to Hannah
            </>
          ) : (
            'Send to member'
          )}
        </button>
      </Body>
    </>
  );
}

export function TrainerSchedule() {
  const [day, setDay] = useState(0);
  const list = CLASSES.filter((c) => c.trainer === 'Jordan Blake' || c.trainer === 'Priya Shah').slice(0, 4);
  return (
    <>
      <AppHeader subtitle="This week" title="Schedule" />
      <div role="tablist" aria-label="Day" className="flex shrink-0 gap-1.5 border-b border-slate-200 bg-white px-3.5 py-2.5">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((d, i) => (
          <button key={d} role="tab" type="button" aria-selected={day === i} onClick={() => setDay(i)} className={cn('flex-1 rounded-lg py-1.5 text-xs font-semibold focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]', day === i ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600')}>
            {d}
          </button>
        ))}
      </div>
      <Body>
        <div key={day} className="demo-slide space-y-2">
          {list.map((c) => (
            <Card key={c.id} className="flex items-center gap-3 border-l-[3px] border-l-[color:var(--demo-accent)]">
              <span className="w-12 text-xs font-semibold tabular-nums text-[color:var(--demo-accent)]">{c.time}</span>
              <div className="min-w-0">
                <p className="truncate text-[13px] font-medium text-slate-900">{c.name}</p>
                <p className="truncate text-[11px] text-slate-500">
                  {c.room} · {c.booked}/{c.capacity} booked
                </p>
              </div>
            </Card>
          ))}
          <p className="flex items-center gap-1.5 px-0.5 pt-1 text-[11px] text-slate-500">
            <Clock className="size-3" aria-hidden /> Times are local to the gym.
          </p>
        </div>
      </Body>
    </>
  );
}

