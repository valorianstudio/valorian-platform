'use client';

import { useState } from 'react';
import { Tabs } from '@/components/demos/shared/app-ui';
import { MobileFrame } from '@/components/demos/shared/mobile-frame';
import { BottomNav } from '@/components/demos/shared/mobile-kit';
import { HOTEL_THEME } from '@/data/hotel/meta';
import { ROOMS } from '@/data/hotel/rooms';
import { cn } from '@/lib/cn';
import {
  GUEST_NAV,
  GuestBooking,
  GuestDetails,
  GuestHistory,
  GuestHome,
  GuestLogin,
  GuestPayment,
  GuestProfile,
  GuestSearch,
  GuestSplash,
  STAFF_NAV,
  StaffDashboard,
  StaffReservations,
  StaffRooms,
  StaffTasks,
} from './hotel-mobile-screens';
import type { GuestScreen, StaffScreen } from './hotel-mobile-screens';

type App = 'guest' | 'staff';

const GUEST_SCREENS: { id: GuestScreen; label: string; note: string }[] = [
  { id: 'splash', label: 'Splash', note: 'Branded welcome screen.' },
  { id: 'login', label: 'Login', note: 'Sign in to your hotel account.' },
  { id: 'home', label: 'Hotel home', note: 'Your stay, dining and what is on today.' },
  { id: 'search', label: 'Room search', note: 'Pick a category and the number of nights.' },
  { id: 'details', label: 'Room details', note: 'Features, size, view and nightly rate.' },
  { id: 'booking', label: 'Booking', note: 'Adjust nights and guests, see the total.' },
  { id: 'payment', label: 'Payment preview', note: 'Choose how you pay and confirm.' },
  { id: 'history', label: 'Booking history', note: 'Past and upcoming stays.' },
  { id: 'profile', label: 'Profile', note: 'Membership, notifications and sign out.' },
];

const STAFF_SCREENS: { id: StaffScreen; label: string; note: string }[] = [
  { id: 'dashboard', label: 'Dashboard', note: 'Arrivals, occupancy and open tasks.' },
  { id: 'reservations', label: 'Reservations', note: 'Today’s arrivals and departures.' },
  { id: 'rooms', label: 'Room status', note: 'Tap a room to change its state.' },
  { id: 'tasks', label: 'Tasks', note: 'Cleaning and maintenance, checked off.' },
];

/**
 * Interactive phone preview. A guest app and a staff app share one phone frame. Choosing a room carries through to booking and payment,
 * and confirming the booking adds it to the stay history, so the preview behaves like the real app.
 */
export function HotelMobileApp() {
  const [app, setApp] = useState<App>('guest');
  const [guest, setGuest] = useState<GuestScreen>('splash');
  const [staff, setStaff] = useState<StaffScreen>('dashboard');
  const [roomId, setRoomId] = useState('r302');
  const [nights, setNights] = useState(2);

  const screens = app === 'guest' ? GUEST_SCREENS : STAFF_SCREENS;
  const current = app === 'guest' ? guest : staff;
  const select = (id: string) => (app === 'guest' ? setGuest(id as GuestScreen) : setStaff(id as StaffScreen));
  const splash = app === 'guest' && guest === 'splash';
  const room = ROOMS.find((r) => r.id === roomId) ?? ROOMS[0];
  const navValue: 'home' | 'search' | 'history' | 'profile' = guest === 'details' || guest === 'booking' || guest === 'payment' ? 'search' : guest === 'splash' || guest === 'login' ? 'home' : (guest as 'home' | 'search' | 'history' | 'profile');

  return (
    <div style={HOTEL_THEME} className="grid items-start gap-10 lg:grid-cols-[1fr_auto] lg:gap-16">
      <div className="order-2 min-w-0 lg:order-1">
        <Tabs label="App" value={app} onChange={setApp} tabs={[{ id: 'guest', label: 'Guest app', count: GUEST_SCREENS.length }, { id: 'staff', label: 'Staff app', count: STAFF_SCREENS.length }]} />
        <h2 className="mt-6 text-2xl font-semibold tracking-tight text-slate-900">{app === 'guest' ? 'The guest app' : 'The staff app'}</h2>
        <p className="mt-2 max-w-md text-slate-600">{app === 'guest' ? 'Find a room, book it and manage every stay from the phone in your pocket.' : 'Check arrivals, track room status and keep tasks moving from anywhere in the hotel.'}</p>
        <ol aria-label="Screens" className="mt-6 grid gap-2 sm:grid-cols-2">
          {screens.map((screen, index) => {
            const on = screen.id === current;
            return (
              <li key={screen.id}>
                <button type="button" aria-current={on ? 'true' : undefined} onClick={() => select(screen.id)} className={cn('flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]', on ? 'border-[color:var(--demo-accent)] bg-[var(--demo-accent-soft)]' : 'border-slate-200 bg-white hover:border-slate-300')}>
                  <span className={cn('mt-0.5 grid size-6 shrink-0 place-items-center rounded-full text-xs font-semibold tabular-nums', on ? 'bg-[var(--demo-accent)] text-white' : 'bg-slate-100 text-slate-600')}>{index + 1}</span>
                  <span className="min-w-0"><span className="block text-sm font-semibold text-slate-900">{screen.label}</span><span className="block text-xs text-slate-500">{screen.note}</span></span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="order-1 w-full lg:sticky lg:top-40 lg:order-2 lg:w-[19rem]">
        <MobileFrame label={`${app === 'guest' ? 'Guest' : 'Staff'} app preview`} tone={splash ? 'light' : 'dark'} screenClassName={splash ? 'bg-[var(--demo-accent)]' : 'bg-white'}>
          <div key={`${app}-${current}-${roomId}`} className="demo-slide flex min-h-0 flex-1 flex-col">
            {app === 'guest' ? (
              <>
                {guest === 'splash' && <GuestSplash onStart={() => setGuest('login')} />}
                {guest === 'login' && <GuestLogin onSignIn={() => setGuest('home')} />}
                {guest === 'home' && <GuestHome go={setGuest} />}
                {guest === 'search' && <GuestSearch onOpen={(id) => { setRoomId(id); setGuest('details'); }} />}
                {guest === 'details' && <GuestDetails id={roomId} onBook={() => setGuest('booking')} />}
                {guest === 'booking' && <GuestBooking room={room} onPay={() => setGuest('payment')} />}
                {guest === 'payment' && <GuestPayment room={room} nights={nights} onConfirm={() => setGuest('history')} />}
                {guest === 'history' && <GuestHistory />}
                {guest === 'profile' && <GuestProfile onSignOut={() => setGuest('login')} />}
              </>
            ) : (
              <>
                {staff === 'dashboard' && <StaffDashboard go={setStaff} />}
                {staff === 'reservations' && <StaffReservations />}
                {staff === 'rooms' && <StaffRooms />}
                {staff === 'tasks' && <StaffTasks />}
              </>
            )}
          </div>
          {app === 'guest' && guest !== 'splash' && guest !== 'login' && <BottomNav label="Guest app" items={GUEST_NAV} value={navValue} onChange={setGuest} />}
          {app === 'staff' && <BottomNav label="Staff app" items={STAFF_NAV} value={staff} onChange={setStaff} />}
        </MobileFrame>
      </div>
    </div>
  );
}
