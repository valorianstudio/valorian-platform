'use client';

import { useState } from 'react';
import { Tabs } from '@/components/demos/shared/app-ui';
import { MobileFrame } from '@/components/demos/shared/mobile-frame';
import { BottomNav } from '@/components/demos/shared/mobile-kit';
import { DELIVERY_THEME } from '@/data/delivery/meta';
import { cn } from '@/lib/cn';
import {
  CUSTOMER_NAV,
  CustomerAddress,
  CustomerBook,
  CustomerHistory,
  CustomerHome,
  CustomerLogin,
  CustomerPayment,
  CustomerProfile,
  CustomerSplash,
  CustomerTrack,
  RIDER_NAV,
  RiderDashboard,
  RiderEarnings,
  RiderOrders,
  RiderRoute,
  RiderStatus,
} from './delivery-mobile-screens';
import type { CustomerScreen, RiderScreen } from './delivery-mobile-screens';

type App = 'customer' | 'rider';

const CUSTOMER_SCREENS: { id: CustomerScreen; label: string; note: string }[] = [
  { id: 'splash', label: 'Splash', note: 'Branded welcome screen.' },
  { id: 'login', label: 'Login / Register', note: 'Sign in or create an account.' },
  { id: 'home', label: 'Home', note: 'Live delivery, services and search.' },
  { id: 'book', label: 'Delivery booking', note: 'Choose a service and the route.' },
  { id: 'address', label: 'Address selection', note: 'Pick a saved address on the map.' },
  { id: 'track', label: 'Order tracking', note: 'Follow the rider on the live map.' },
  { id: 'payment', label: 'Payment', note: 'Wallet or card, one tap to pay.' },
  { id: 'history', label: 'Delivery history', note: 'Past and current deliveries.' },
  { id: 'profile', label: 'Profile', note: 'Membership, safety and settings.' },
];

const RIDER_SCREENS: { id: RiderScreen; label: string; note: string }[] = [
  { id: 'dashboard', label: 'Rider dashboard', note: 'Shift progress and the next order.' },
  { id: 'orders', label: 'New orders', note: 'Accept a nearby delivery.' },
  { id: 'route', label: 'Navigation', note: 'Turn-by-turn with the route on the map.' },
  { id: 'status', label: 'Delivery status', note: 'Pickup, on the way and delivered.' },
  { id: 'earnings', label: 'Earnings', note: 'This week and the next payout.' },
];

/**
 * Interactive phone preview. A customer app and a rider app share one phone frame. Booking a delivery leads to tracking, and accepting
 * an order in the rider app moves the status forward, so the preview behaves like the real product.
 */
export function DeliveryMobileApp() {
  const [app, setApp] = useState<App>('customer');
  const [customer, setCustomer] = useState<CustomerScreen>('splash');
  const [rider, setRider] = useState<RiderScreen>('dashboard');

  const screens = app === 'customer' ? CUSTOMER_SCREENS : RIDER_SCREENS;
  const current = app === 'customer' ? customer : rider;
  const select = (id: string) => (app === 'customer' ? setCustomer(id as CustomerScreen) : setRider(id as RiderScreen));
  const splash = app === 'customer' && customer === 'splash';
  const navValue: 'home' | 'book' | 'track' | 'history' | 'profile' = customer === 'address' || customer === 'payment' ? 'book' : customer === 'splash' || customer === 'login' ? 'home' : (customer as 'home' | 'book' | 'track' | 'history' | 'profile');

  return (
    <div style={DELIVERY_THEME} className="grid items-start gap-10 lg:grid-cols-[1fr_auto] lg:gap-16">
      <div className="order-2 min-w-0 lg:order-1">
        <Tabs label="App" value={app} onChange={setApp} tabs={[{ id: 'customer', label: 'Customer app', count: CUSTOMER_SCREENS.length }, { id: 'rider', label: 'Rider app', count: RIDER_SCREENS.length }]} />
        <h2 className="mt-6 text-2xl font-semibold tracking-tight text-slate-900">{app === 'customer' ? 'The customer app' : 'The rider app'}</h2>
        <p className="mt-2 max-w-md text-slate-600">{app === 'customer' ? 'Book a delivery, pick the address and follow it live until it arrives.' : 'Accept orders, follow the route and track earnings from the bike.'}</p>
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
        <MobileFrame label={`${app === 'customer' ? 'Customer' : 'Rider'} app preview`} tone={splash ? 'light' : 'dark'} screenClassName={splash ? 'bg-[var(--demo-accent)]' : 'bg-white'}>
          <div key={`${app}-${current}`} className="demo-slide flex min-h-0 flex-1 flex-col">
            {app === 'customer' ? (
              <>
                {customer === 'splash' && <CustomerSplash onStart={() => setCustomer('login')} />}
                {customer === 'login' && <CustomerLogin onSignIn={() => setCustomer('home')} />}
                {customer === 'home' && <CustomerHome go={setCustomer} />}
                {customer === 'book' && <CustomerBook onNext={() => setCustomer('address')} />}
                {customer === 'address' && <CustomerAddress onPick={() => setCustomer('payment')} />}
                {customer === 'track' && <CustomerTrack />}
                {customer === 'payment' && <CustomerPayment onPaid={() => setCustomer('track')} />}
                {customer === 'history' && <CustomerHistory />}
                {customer === 'profile' && <CustomerProfile onSignOut={() => setCustomer('login')} />}
              </>
            ) : (
              <>
                {rider === 'dashboard' && <RiderDashboard go={setRider} />}
                {rider === 'orders' && <RiderOrders onAccept={() => setRider('route')} />}
                {rider === 'route' && <RiderRoute />}
                {rider === 'status' && <RiderStatus />}
                {rider === 'earnings' && <RiderEarnings />}
              </>
            )}
          </div>
          {app === 'customer' && customer !== 'splash' && customer !== 'login' && <BottomNav label="Customer app" items={CUSTOMER_NAV} value={navValue} onChange={setCustomer} />}
          {app === 'rider' && <BottomNav label="Rider app" items={RIDER_NAV} value={rider} onChange={setRider} />}
        </MobileFrame>
      </div>
    </div>
  );
}
