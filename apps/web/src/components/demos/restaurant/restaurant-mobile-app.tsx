'use client';

import { useState } from 'react';
import { Tabs } from '@/components/demos/shared/app-ui';
import { BottomNav } from '@/components/demos/shared/mobile-kit';
import { MobileFrame } from '@/components/demos/shared/mobile-frame';
import type { OrderStatus } from '@/data/restaurant/app';
import { RESTAURANT_THEME } from '@/data/restaurant/meta';
import { cn } from '@/lib/cn';
import {
  GUEST_NAV,
  GuestCart,
  GuestDetails,
  GuestHome,
  GuestLogin,
  GuestMenu,
  GuestProfile,
  GuestSplash,
  GuestTracking,
  STAFF_NAV,
  StaffDashboard,
  StaffKitchen,
  StaffOrders,
  StaffTables,
} from './restaurant-mobile-screens';
import type { Cart, GuestScreen, StaffScreen } from './restaurant-mobile-screens';
import { ORDERS } from '@/data/restaurant/app';

type App = 'guest' | 'staff';

const GUEST_SCREENS: { id: GuestScreen; label: string; note: string }[] = [
  { id: 'splash', label: 'Splash', note: 'Branded welcome screen.' },
  { id: 'login', label: 'Login', note: 'Sign in or continue as a guest.' },
  { id: 'home', label: 'Restaurant home', note: "Tonight's special and popular dishes." },
  { id: 'menu', label: 'Menu', note: 'Categories, dishes and one-tap add.' },
  { id: 'details', label: 'Food details', note: 'Description, rating and quantity.' },
  { id: 'cart', label: 'Cart', note: 'Review items, service and total.' },
  { id: 'tracking', label: 'Order tracking', note: 'Follow your order from kitchen to table.' },
  { id: 'profile', label: 'Profile', note: 'Rewards, history and sign out.' },
];

const STAFF_SCREENS: { id: StaffScreen; label: string; note: string }[] = [
  { id: 'dashboard', label: 'Dashboard', note: "Tonight's sales and what needs attention." },
  { id: 'orders', label: 'Orders', note: 'Every order with one-tap progress.' },
  { id: 'kitchen', label: 'Kitchen queue', note: 'Tickets in cooking order.' },
  { id: 'tables', label: 'Table status', note: 'Tap a table to seat or clear it.' },
];

/**
 * Interactive phone preview. A guest app and a staff app share one phone frame. The cart, the chosen dish, the order progress and the
 * kitchen tickets are shared across screens, so adding a dish really fills the cart and starting a ticket really updates the orders list.
 */
export function RestaurantMobileApp() {
  const [app, setApp] = useState<App>('guest');
  const [guest, setGuest] = useState<GuestScreen>('splash');
  const [staff, setStaff] = useState<StaffScreen>('dashboard');
  const [cart, setCart] = useState<Cart>({ m3: 1 });
  const [dishId, setDishId] = useState('m3');
  const [qty, setQty] = useState(1);
  const [placed, setPlaced] = useState(false);
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<Record<string, OrderStatus>>({});

  const screens = app === 'guest' ? GUEST_SCREENS : STAFF_SCREENS;
  const current = app === 'guest' ? guest : staff;
  const count = Object.values(cart).reduce((sum, n) => sum + n, 0);
  const open = Object.values(Object.fromEntries(ORDERS.map((o) => [o.id, status[o.id] ?? o.status]))).filter((s) => s !== 'Served').length;
  const select = (id: string) => (app === 'guest' ? setGuest(id as GuestScreen) : setStaff(id as StaffScreen));
  const add = (id: string, n = 1) => setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + n }));
  const advance = (id: string, to: OrderStatus) => setStatus((s) => ({ ...s, [id]: to }));
  const navValue = guest === 'details' ? 'menu' : (guest as (typeof GUEST_NAV)[number]['id']);
  const splash = app === 'guest' && guest === 'splash';

  return (
    <div style={RESTAURANT_THEME} className="grid items-start gap-10 lg:grid-cols-[1fr_auto] lg:gap-16">
      <div className="order-2 min-w-0 lg:order-1">
        <Tabs
          label="App"
          value={app}
          onChange={setApp}
          tabs={[
            { id: 'guest', label: 'Guest app', count: GUEST_SCREENS.length },
            { id: 'staff', label: 'Staff app', count: STAFF_SCREENS.length },
          ]}
        />
        <h2 className="mt-6 text-2xl font-semibold tracking-tight text-slate-900">{app === 'guest' ? 'The guest app' : 'The staff app'}</h2>
        <p className="mt-2 max-w-md text-slate-600">{app === 'guest' ? 'Browse the menu, build a cart and follow your order to the table.' : 'Run the pass: orders, the kitchen queue and the floor, from one phone.'}</p>

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
        <MobileFrame label={`${app === 'guest' ? 'Guest' : 'Staff'} app preview`} tone={splash ? 'light' : 'dark'} screenClassName={splash ? 'bg-resto' : 'bg-white'}>
          <div key={`${app}-${current}`} className="demo-slide flex min-h-0 flex-1 flex-col">
            {app === 'guest' ? (
              <>
                {guest === 'splash' && <GuestSplash onStart={() => setGuest('login')} />}
                {guest === 'login' && <GuestLogin onSignIn={() => setGuest('home')} />}
                {guest === 'home' && (
                  <GuestHome
                    go={setGuest}
                    onAdd={(id) => add(id)}
                    onOpen={(id) => {
                      setDishId(id);
                      setQty(1);
                      setGuest('details');
                    }}
                  />
                )}
                {guest === 'menu' && (
                  <GuestMenu
                    onAdd={(id) => add(id)}
                    count={count}
                    goCart={() => setGuest('cart')}
                    onOpen={(id) => {
                      setDishId(id);
                      setQty(1);
                      setGuest('details');
                    }}
                  />
                )}
                {guest === 'details' && (
                  <GuestDetails
                    id={dishId}
                    qty={qty}
                    onQty={setQty}
                    onAdd={(n) => {
                      add(dishId, n);
                      setGuest('cart');
                    }}
                  />
                )}
                {guest === 'cart' && (
                  <GuestCart
                    cart={cart}
                    onQty={(id, n) => setCart((c) => ({ ...c, [id]: Math.max(0, n) }))}
                    goMenu={() => setGuest('menu')}
                    onPlace={() => {
                      setPlaced(true);
                      setStep(1);
                      setCart({});
                      setGuest('tracking');
                    }}
                  />
                )}
                {guest === 'tracking' && <GuestTracking placed={placed} step={step} onAdvance={() => setStep((s) => Math.min(3, s + 1))} goMenu={() => setGuest('menu')} />}
                {guest === 'profile' && <GuestProfile onSignOut={() => setGuest('login')} />}
              </>
            ) : (
              <>
                {staff === 'dashboard' && <StaffDashboard go={setStaff} active={open} />}
                {staff === 'orders' && <StaffOrders status={status} onAdvance={advance} />}
                {staff === 'kitchen' && <StaffKitchen status={status} onAdvance={advance} />}
                {staff === 'tables' && <StaffTables />}
              </>
            )}
          </div>
          {app === 'guest' && guest !== 'splash' && guest !== 'login' && <BottomNav label="Guest app" items={GUEST_NAV.map((item) => (item.id === 'cart' ? { ...item, badge: count } : item))} value={navValue} onChange={setGuest} />}
          {app === 'staff' && <BottomNav label="Staff app" items={STAFF_NAV} value={staff} onChange={setStaff} />}
        </MobileFrame>
      </div>
    </div>
  );
}
