'use client';

import { Armchair, BarChart3, CalendarDays, ClipboardList, LayoutDashboard, Package, Settings, ShoppingBag, UserRound, Users, UtensilsCrossed, BookOpenText } from 'lucide-react';
import { AppShell } from '@/components/demos/shared/app-shell';
import type { ShellNavItem } from '@/components/demos/shared/app-shell';
import { NOTIFICATIONS } from '@/data/restaurant/app';
import { RestaurantLogo } from './restaurant-logo';
import { RestaurantDashboardHome, RestaurantMenuView, RestaurantOrdersView, RestaurantTablesView } from './restaurant-views-a';
import { RestaurantCustomersView, RestaurantInventoryView, RestaurantReportsView, RestaurantReservationsView, RestaurantSettingsView, RestaurantStaffView } from './restaurant-views-b';
import { RESTAURANT_THEME } from '@/data/restaurant/meta';

type Role = 'Manager' | 'Waiter';
const ROLES: readonly Role[] = ['Manager', 'Waiter'];

const NAV: Record<Role, ShellNavItem[]> = {
  Manager: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, render: () => <RestaurantDashboardHome /> },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, render: () => <RestaurantOrdersView /> },
    { id: 'menu', label: 'Menu', icon: BookOpenText, render: () => <RestaurantMenuView /> },
    { id: 'tables', label: 'Tables', icon: Armchair, render: () => <RestaurantTablesView /> },
    { id: 'reservations', label: 'Reservations', icon: CalendarDays, render: () => <RestaurantReservationsView /> },
    { id: 'customers', label: 'Customers', icon: Users, render: () => <RestaurantCustomersView /> },
    { id: 'inventory', label: 'Inventory', icon: Package, render: () => <RestaurantInventoryView /> },
    { id: 'staff', label: 'Staff', icon: UserRound, render: () => <RestaurantStaffView /> },
    { id: 'reports', label: 'Reports', icon: BarChart3, render: () => <RestaurantReportsView /> },
    { id: 'settings', label: 'Settings', icon: Settings, render: () => <RestaurantSettingsView /> },
  ],
  Waiter: [
    { id: 'orders', label: 'Orders', icon: ClipboardList, render: () => <RestaurantOrdersView /> },
    { id: 'tables', label: 'Tables', icon: Armchair, render: () => <RestaurantTablesView /> },
    { id: 'reservations', label: 'Reservations', icon: CalendarDays, render: () => <RestaurantReservationsView /> },
    { id: 'menu', label: 'Menu', icon: UtensilsCrossed, render: () => <RestaurantMenuView /> },
  ],
};

const USERS = {
  Manager: { name: 'Isabella Conti', title: 'General manager' },
  Waiter: { name: 'Marco Bellini', title: 'Head waiter' },
};

/** The interactive restaurant dashboard: the shared role-aware app shell with the restaurant's modules and brand variables. */
export function RestaurantDashboard() {
  return (
    <div style={RESTAURANT_THEME}>
      <AppShell brand={<RestaurantLogo tone="dark" />} domain="app.tableflow.restaurant" roles={ROLES} nav={NAV} users={USERS} notifications={NOTIFICATIONS} />
    </div>
  );
}
