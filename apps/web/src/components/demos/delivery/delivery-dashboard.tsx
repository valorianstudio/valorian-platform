'use client';

import { BarChart3, Bike, CreditCard, FileBarChart, LayoutDashboard, MapPinned, Package, Route, Settings, UsersRound, Users } from 'lucide-react';
import { AppShell } from '@/components/demos/shared/app-shell';
import type { ShellNavItem } from '@/components/demos/shared/app-shell';
import { NOTIFICATIONS } from '@/data/delivery/operations';
import { DELIVERY_THEME } from '@/data/delivery/meta';
import { DeliveryDashboardHome, DeliveryOrdersView, DeliveryRidersView, DeliveryTrackingView } from './delivery-views-a';
import { DeliveryAnalyticsView, DeliveryCustomersView, DeliveryPaymentsView, DeliveryReportsView, DeliveryRoutesView, DeliverySettingsView } from './delivery-views-b';
import { DeliveryLogo } from './delivery-logo';

type Role = 'Dispatcher' | 'Fleet manager';
const ROLES: readonly Role[] = ['Dispatcher', 'Fleet manager'];

const NAV: Record<Role, ShellNavItem[]> = {
  Dispatcher: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, render: () => <DeliveryDashboardHome /> },
    { id: 'orders', label: 'Orders', icon: Package, render: () => <DeliveryOrdersView /> },
    { id: 'riders', label: 'Riders', icon: Bike, render: () => <DeliveryRidersView /> },
    { id: 'customers', label: 'Customers', icon: Users, render: () => <DeliveryCustomersView /> },
    { id: 'routes', label: 'Routes', icon: Route, render: () => <DeliveryRoutesView /> },
    { id: 'tracking', label: 'Tracking', icon: MapPinned, render: () => <DeliveryTrackingView /> },
    { id: 'payments', label: 'Payments', icon: CreditCard, render: () => <DeliveryPaymentsView /> },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, render: () => <DeliveryAnalyticsView /> },
    { id: 'reports', label: 'Reports', icon: FileBarChart, render: () => <DeliveryReportsView /> },
    { id: 'settings', label: 'Settings', icon: Settings, render: () => <DeliverySettingsView /> },
  ],
  'Fleet manager': [
    { id: 'riders', label: 'Riders', icon: UsersRound, render: () => <DeliveryRidersView /> },
    { id: 'tracking', label: 'Live tracking', icon: MapPinned, render: () => <DeliveryTrackingView /> },
    { id: 'routes', label: 'Routes', icon: Route, render: () => <DeliveryRoutesView /> },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, render: () => <DeliveryAnalyticsView /> },
  ],
};

const USERS = {
  Dispatcher: { name: 'Sam Whitfield', title: 'Lead dispatcher' },
  'Fleet manager': { name: 'Priya Nair', title: 'Fleet manager' },
};

/** The interactive delivery dashboard: the shared role-aware app shell with the dispatch modules and brand variables. */
export function DeliveryDashboard() {
  return (
    <div style={DELIVERY_THEME}>
      <AppShell brand={<DeliveryLogo tone="dark" />} domain="dispatch.swiftwheel.example" roles={ROLES} nav={NAV} users={USERS} notifications={NOTIFICATIONS} />
    </div>
  );
}
