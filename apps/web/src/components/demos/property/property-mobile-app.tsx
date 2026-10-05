'use client';

import { useState } from 'react';
import { Tabs } from '@/components/demos/shared/app-ui';
import { MobileFrame } from '@/components/demos/shared/mobile-frame';
import { BottomNav } from '@/components/demos/shared/mobile-kit';
import { PROPERTY_THEME } from '@/data/property/meta';
import { cn } from '@/lib/cn';
import {
  MANAGER_NAV,
  ManagerDashboard,
  ManagerPayments,
  ManagerProperties,
  ManagerRequests,
  ManagerTenants,
  RESIDENT_NAV,
  ResidentAnnouncements,
  ResidentHome,
  ResidentLogin,
  ResidentMaintenance,
  ResidentProfile,
  ResidentProperty,
  ResidentRent,
  ResidentSplash,
  ResidentVisitors,
} from './property-mobile-screens';
import type { ManagerScreen, ResidentScreen } from './property-mobile-screens';

type App = 'resident' | 'manager';

const RESIDENT_SCREENS: { id: ResidentScreen; label: string; note: string }[] = [
  { id: 'splash', label: 'Splash', note: 'Branded welcome screen.' },
  { id: 'login', label: 'Login / Register', note: 'Sign in or join your building.' },
  { id: 'home', label: 'Home dashboard', note: 'Rent status, repairs and announcements.' },
  { id: 'property', label: 'Property details', note: 'Your unit, smart home and lease.' },
  { id: 'maintenance', label: 'Maintenance request', note: 'Report a repair and track it.' },
  { id: 'rent', label: 'Rent payment', note: 'Pay by direct debit or transfer.' },
  { id: 'announcements', label: 'Announcements', note: 'Notices from the building team.' },
  { id: 'visitors', label: 'Visitor approval', note: 'Approve guests in one tap.' },
  { id: 'profile', label: 'Profile', note: 'Lease, payments and household.' },
];

const MANAGER_SCREENS: { id: ManagerScreen; label: string; note: string }[] = [
  { id: 'dashboard', label: 'Manager dashboard', note: 'Occupancy, requests and rent at a glance.' },
  { id: 'properties', label: 'Properties', note: 'Buildings and their occupancy.' },
  { id: 'tenants', label: 'Tenants', note: 'Residents, leases and rent status.' },
  { id: 'requests', label: 'Requests', note: 'Triage and resolve repairs.' },
  { id: 'payments', label: 'Payments', note: 'Rent collected and overdue.' },
];

/**
 * Interactive phone preview: a resident app and a manager app share one phone frame. Sending a repair shows a confirmation, approving a
 * visitor updates the list, and resolving a request in the manager app changes its status, so the preview behaves like the real product.
 */
export function PropertyMobileApp() {
  const [app, setApp] = useState<App>('resident');
  const [resident, setResident] = useState<ResidentScreen>('splash');
  const [manager, setManager] = useState<ManagerScreen>('dashboard');

  const screens = app === 'resident' ? RESIDENT_SCREENS : MANAGER_SCREENS;
  const current = app === 'resident' ? resident : manager;
  const select = (id: string) => (app === 'resident' ? setResident(id as ResidentScreen) : setManager(id as ManagerScreen));
  const splash = app === 'resident' && resident === 'splash';
  const navValue = (['maintenance', 'rent', 'visitors', 'profile'] as const).includes(resident as 'rent') ? resident : 'home';

  return (
    <div style={PROPERTY_THEME} className="grid items-start gap-10 lg:grid-cols-[1fr_auto] lg:gap-16">
      <div className="order-2 min-w-0 lg:order-1">
        <Tabs label="App" value={app} onChange={setApp} tabs={[{ id: 'resident', label: 'Resident app', count: RESIDENT_SCREENS.length }, { id: 'manager', label: 'Manager app', count: MANAGER_SCREENS.length }]} />
        <h2 className="mt-6 text-2xl font-semibold tracking-tight text-slate-900">{app === 'resident' ? 'The resident app' : 'The manager app'}</h2>
        <p className="mt-2 max-w-md text-slate-600">{app === 'resident' ? 'Pay rent, report repairs, approve visitors and read building news from your phone.' : 'Run the portfolio, triage repairs and follow rent collection from anywhere.'}</p>
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
        <MobileFrame label={`${app === 'resident' ? 'Resident' : 'Manager'} app preview`} tone={splash ? 'light' : 'dark'} screenClassName={splash ? 'bg-[var(--demo-header)]' : 'bg-white'}>
          <div key={`${app}-${current}`} className="demo-slide flex min-h-0 flex-1 flex-col">
            {app === 'resident' ? (
              <>
                {resident === 'splash' && <ResidentSplash onStart={() => setResident('login')} />}
                {resident === 'login' && <ResidentLogin onSignIn={() => setResident('home')} />}
                {resident === 'home' && <ResidentHome go={setResident} />}
                {resident === 'property' && <ResidentProperty />}
                {resident === 'maintenance' && <ResidentMaintenance />}
                {resident === 'rent' && <ResidentRent />}
                {resident === 'announcements' && <ResidentAnnouncements />}
                {resident === 'visitors' && <ResidentVisitors />}
                {resident === 'profile' && <ResidentProfile onSignOut={() => setResident('login')} />}
              </>
            ) : (
              <>
                {manager === 'dashboard' && <ManagerDashboard go={setManager} />}
                {manager === 'properties' && <ManagerProperties />}
                {manager === 'tenants' && <ManagerTenants />}
                {manager === 'requests' && <ManagerRequests />}
                {manager === 'payments' && <ManagerPayments />}
              </>
            )}
          </div>
          {app === 'resident' && resident !== 'splash' && resident !== 'login' && <BottomNav label="Resident app" items={RESIDENT_NAV} value={navValue} onChange={setResident} />}
          {app === 'manager' && <BottomNav label="Manager app" items={MANAGER_NAV} value={manager} onChange={setManager} />}
        </MobileFrame>
      </div>
    </div>
  );
}
