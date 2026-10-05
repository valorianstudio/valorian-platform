'use client';

import { useState } from 'react';
import { Tabs } from '@/components/demos/shared/app-ui';
import { MobileFrame } from '@/components/demos/shared/mobile-frame';
import { BottomNav } from '@/components/demos/shared/mobile-kit';
import { PETSHOP_THEME } from '@/data/petshop/meta';
import { cn } from '@/lib/cn';
import {
  CUSTOMER_NAV,
  CustomerBook,
  CustomerHome,
  CustomerLogin,
  CustomerNotifications,
  CustomerPet,
  CustomerProfile,
  CustomerShop,
  CustomerSplash,
  CustomerTrack,
  STAFF_NAV,
  StaffAppointments,
  StaffCustomers,
  StaffDashboard,
  StaffServices,
} from './petshop-mobile-screens';
import type { CustomerScreen, StaffScreen } from './petshop-mobile-screens';

type App = 'customer' | 'staff';

const CUSTOMER_SCREENS: { id: CustomerScreen; label: string; note: string }[] = [
  { id: 'splash', label: 'Splash', note: 'Branded welcome screen.' },
  { id: 'login', label: 'Login / Register', note: 'Sign in or create an account.' },
  { id: 'home', label: 'Home', note: 'Upcoming visits, quick actions and picks.' },
  { id: 'pet', label: 'Pet profile', note: 'Weight, allergies and visit history.' },
  { id: 'grooming', label: 'Book grooming', note: 'Pick a day and a time slot.' },
  { id: 'vet', label: 'Veterinary appointment', note: 'Book a checkup with the clinic.' },
  { id: 'shop', label: 'Product shopping', note: 'Browse by pet and fill the bag.' },
  { id: 'track', label: 'Order tracking', note: 'Follow an order step by step.' },
  { id: 'notifications', label: 'Notifications', note: 'Reminders and confirmations.' },
  { id: 'profile', label: 'Profile', note: 'Membership and account settings.' },
];

const STAFF_SCREENS: { id: StaffScreen; label: string; note: string }[] = [
  { id: 'dashboard', label: 'Staff dashboard', note: 'The day at a glance.' },
  { id: 'appointments', label: 'Pet appointments', note: 'Check pets in and move visits along.' },
  { id: 'customers', label: 'Customer records', note: 'Owners and their pets.' },
  { id: 'services', label: 'Service management', note: 'Turn services on and off.' },
];

/**
 * Interactive phone preview: a customer app and a staff app share one phone frame. Booking a visit appears as a confirmation, and moving a
 * visit forward in the staff app changes its status, so the preview behaves like the real product.
 */
export function PetshopMobileApp() {
  const [app, setApp] = useState<App>('customer');
  const [customer, setCustomer] = useState<CustomerScreen>('splash');
  const [staff, setStaff] = useState<StaffScreen>('dashboard');

  const screens = app === 'customer' ? CUSTOMER_SCREENS : STAFF_SCREENS;
  const current = app === 'customer' ? customer : staff;
  const select = (id: string) => (app === 'customer' ? setCustomer(id as CustomerScreen) : setStaff(id as StaffScreen));
  const splash = app === 'customer' && customer === 'splash';
  const navValue = (['shop', 'pet', 'track', 'profile'] as const).includes(customer as 'shop') ? customer : 'home';

  return (
    <div style={PETSHOP_THEME} className="grid items-start gap-10 lg:grid-cols-[1fr_auto] lg:gap-16">
      <div className="order-2 min-w-0 lg:order-1">
        <Tabs label="App" value={app} onChange={setApp} tabs={[{ id: 'customer', label: 'Customer app', count: CUSTOMER_SCREENS.length }, { id: 'staff', label: 'Staff app', count: STAFF_SCREENS.length }]} />
        <h2 className="mt-6 text-2xl font-semibold tracking-tight text-slate-900">{app === 'customer' ? 'The customer app' : 'The staff app'}</h2>
        <p className="mt-2 max-w-md text-slate-600">{app === 'customer' ? 'Keep every pet’s care in one place: book grooming and vet visits, shop and track orders.' : 'Check pets in, run the day’s visits and keep customer records and services up to date.'}</p>
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
        <MobileFrame label={`${app === 'customer' ? 'Customer' : 'Staff'} app preview`} tone={splash ? 'light' : 'dark'} screenClassName={splash ? 'bg-[var(--demo-accent)]' : 'bg-white'}>
          <div key={`${app}-${current}`} className="demo-slide flex min-h-0 flex-1 flex-col">
            {app === 'customer' ? (
              <>
                {customer === 'splash' && <CustomerSplash onStart={() => setCustomer('login')} />}
                {customer === 'login' && <CustomerLogin onSignIn={() => setCustomer('home')} />}
                {customer === 'home' && <CustomerHome go={setCustomer} />}
                {customer === 'pet' && <CustomerPet />}
                {customer === 'grooming' && <CustomerBook kind="grooming" onBook={() => undefined} />}
                {customer === 'vet' && <CustomerBook kind="vet" onBook={() => undefined} />}
                {customer === 'shop' && <CustomerShop />}
                {customer === 'track' && <CustomerTrack />}
                {customer === 'notifications' && <CustomerNotifications />}
                {customer === 'profile' && <CustomerProfile onSignOut={() => setCustomer('login')} />}
              </>
            ) : (
              <>
                {staff === 'dashboard' && <StaffDashboard go={setStaff} />}
                {staff === 'appointments' && <StaffAppointments />}
                {staff === 'customers' && <StaffCustomers />}
                {staff === 'services' && <StaffServices />}
              </>
            )}
          </div>
          {app === 'customer' && customer !== 'splash' && customer !== 'login' && <BottomNav label="Customer app" items={CUSTOMER_NAV} value={navValue} onChange={setCustomer} />}
          {app === 'staff' && <BottomNav label="Staff app" items={STAFF_NAV} value={staff} onChange={setStaff} />}
        </MobileFrame>
      </div>
    </div>
  );
}
