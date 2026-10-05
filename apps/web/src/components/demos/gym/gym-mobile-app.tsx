'use client';

import { useState } from 'react';
import { Tabs } from '@/components/demos/shared/app-ui';
import { MobileFrame } from '@/components/demos/shared/mobile-frame';
import { BottomNav } from '@/components/demos/shared/mobile-kit';
import { GYM_THEME } from '@/data/gym/meta';
import { cn } from '@/lib/cn';
import {
  MEMBER_NAV,
  MemberBooking,
  MemberChat,
  MemberHome,
  MemberLogin,
  MemberProfile,
  MemberProgress,
  MemberSplash,
  MemberWorkout,
  TRAINER_NAV,
  TrainerAssign,
  TrainerClients,
  TrainerHome,
  TrainerSchedule,
} from './gym-mobile-screens';
import type { MemberScreen, TrainerScreen } from './gym-mobile-screens';

type App = 'member' | 'trainer';

const MEMBER_SCREENS: { id: MemberScreen; label: string; note: string }[] = [
  { id: 'splash', label: 'Splash', note: 'Branded welcome screen.' },
  { id: 'login', label: 'Login', note: 'Secure sign-in for members.' },
  { id: 'home', label: 'Home dashboard', note: 'Streak, goal progress and your next class.' },
  { id: 'workout', label: 'Workout plan', note: 'Today’s exercises with tap-to-complete.' },
  { id: 'chat', label: 'Trainer chat', note: 'Message your coach, anytime.' },
  { id: 'progress', label: 'Progress tracking', note: 'Weight trend and personal bests.' },
  { id: 'booking', label: 'Class booking', note: 'Book or join the waitlist in one tap.' },
  { id: 'profile', label: 'Profile', note: 'Membership, notifications and sign out.' },
];

const TRAINER_SCREENS: { id: TrainerScreen; label: string; note: string }[] = [
  { id: 'dashboard', label: 'Dashboard', note: "Today's sessions and messages." },
  { id: 'clients', label: 'Clients', note: 'Your assigned members and their goals.' },
  { id: 'assign', label: 'Workout assignment', note: 'Send a plan to a member.' },
  { id: 'schedule', label: 'Schedule', note: 'Your classes and sessions by day.' },
];

/**
 * Interactive phone preview. A member app and a trainer app share one phone frame. Booking a class and sending a chat message
 * update in place, so the preview feels like the real product rather than a set of pictures.
 */
export function GymMobileApp() {
  const [app, setApp] = useState<App>('member');
  const [member, setMember] = useState<MemberScreen>('splash');
  const [trainer, setTrainer] = useState<TrainerScreen>('dashboard');

  const screens = app === 'member' ? MEMBER_SCREENS : TRAINER_SCREENS;
  const current = app === 'member' ? member : trainer;
  const select = (id: string) => (app === 'member' ? setMember(id as MemberScreen) : setTrainer(id as TrainerScreen));
  const splash = app === 'member' && member === 'splash';

  return (
    <div style={GYM_THEME} className="grid items-start gap-10 lg:grid-cols-[1fr_auto] lg:gap-16">
      <div className="order-2 min-w-0 lg:order-1">
        <Tabs
          label="App"
          value={app}
          onChange={setApp}
          tabs={[
            { id: 'member', label: 'Member app', count: MEMBER_SCREENS.length },
            { id: 'trainer', label: 'Trainer app', count: TRAINER_SCREENS.length },
          ]}
        />
        <h2 className="mt-6 text-2xl font-bold tracking-tight text-slate-900">{app === 'member' ? 'The member app' : 'The trainer app'}</h2>
        <p className="mt-2 max-w-md text-slate-600">{app === 'member' ? 'Book classes, follow your plan and check in to the gym from one phone.' : 'Assign workouts, follow clients and keep every session on schedule.'}</p>

        <ol aria-label="Screens" className="mt-6 grid gap-2 sm:grid-cols-2">
          {screens.map((screen, index) => {
            const on = screen.id === current;
            return (
              <li key={screen.id}>
                <button type="button" aria-current={on ? 'true' : undefined} onClick={() => select(screen.id)} className={cn('flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]', on ? 'border-[color:var(--demo-accent)] bg-[var(--demo-accent-soft)]' : 'border-slate-200 bg-white hover:border-slate-300')}>
                  <span className={cn('mt-0.5 grid size-6 shrink-0 place-items-center rounded-full text-xs font-semibold tabular-nums', on ? 'bg-[var(--demo-accent)] text-white' : 'bg-slate-100 text-slate-600')}>{index + 1}</span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-slate-900">{screen.label}</span>
                    <span className="block text-xs text-slate-500">{screen.note}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="order-1 w-full lg:sticky lg:top-40 lg:order-2 lg:w-[19rem]">
        <MobileFrame label={`${app === 'member' ? 'Member' : 'Trainer'} app preview`} tone={splash ? 'light' : 'dark'} screenClassName={splash ? 'bg-gym' : 'bg-white'}>
          <div key={`${app}-${current}`} className="demo-slide flex min-h-0 flex-1 flex-col">
            {app === 'member' ? (
              <>
                {member === 'splash' && <MemberSplash onStart={() => setMember('login')} />}
                {member === 'login' && <MemberLogin onSignIn={() => setMember('home')} />}
                {member === 'home' && <MemberHome go={setMember} />}
                {member === 'workout' && <MemberWorkout />}
                {member === 'chat' && <MemberChat />}
                {member === 'progress' && <MemberProgress />}
                {member === 'booking' && <MemberBooking />}
                {member === 'profile' && <MemberProfile onSignOut={() => setMember('login')} />}
              </>
            ) : (
              <>
                {trainer === 'dashboard' && <TrainerHome go={setTrainer} />}
                {trainer === 'clients' && <TrainerClients />}
                {trainer === 'assign' && <TrainerAssign />}
                {trainer === 'schedule' && <TrainerSchedule />}
              </>
            )}
          </div>
          {app === 'member' && member !== 'splash' && member !== 'login' && <BottomNav label="Member app" items={MEMBER_NAV} value={member === 'home' || member === 'workout' || member === 'chat' || member === 'progress' || member === 'booking' || member === 'profile' ? (member as (typeof MEMBER_NAV)[number]['id']) : 'home'} onChange={setMember} />}
          {app === 'trainer' && <BottomNav label="Trainer app" items={TRAINER_NAV} value={trainer} onChange={setTrainer} />}
        </MobileFrame>
      </div>
    </div>
  );
}
