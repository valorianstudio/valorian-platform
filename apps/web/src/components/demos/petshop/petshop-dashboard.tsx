'use client';

import { BarChart3, Boxes, CalendarDays, CreditCard, FileBarChart, LayoutDashboard, PawPrint, Package, Scissors, Settings, ShoppingBag, Users } from 'lucide-react';
import { AppShell } from '@/components/demos/shared/app-shell';
import type { ShellNavItem } from '@/components/demos/shared/app-shell';
import { NOTIFICATIONS } from '@/data/petshop/catalog';
import { PETSHOP_THEME } from '@/data/petshop/meta';
import { PetshopCustomersView, PetshopDashboardHome, PetshopPetsView, PetshopProductsView } from './petshop-views-a';
import { PetshopAppointmentsView, PetshopInventoryView, PetshopOrdersView, PetshopPaymentsView, PetshopReportsView, PetshopSettingsView } from './petshop-views-b';
import { PetshopLogo } from './petshop-logo';

type Role = 'Shop manager' | 'Groomer';
const ROLES: readonly Role[] = ['Shop manager', 'Groomer'];

const NAV: Record<Role, ShellNavItem[]> = {
  'Shop manager': [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, render: () => <PetshopDashboardHome /> },
    { id: 'pets', label: 'Pets', icon: PawPrint, render: () => <PetshopPetsView /> },
    { id: 'customers', label: 'Customers', icon: Users, render: () => <PetshopCustomersView /> },
    { id: 'products', label: 'Products', icon: Package, render: () => <PetshopProductsView /> },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, render: () => <PetshopOrdersView /> },
    { id: 'appointments', label: 'Appointments', icon: CalendarDays, render: () => <PetshopAppointmentsView /> },
    { id: 'grooming', label: 'Grooming', icon: Scissors, render: () => <PetshopAppointmentsView grooming /> },
    { id: 'inventory', label: 'Inventory', icon: Boxes, render: () => <PetshopInventoryView /> },
    { id: 'payments', label: 'Payments', icon: CreditCard, render: () => <PetshopPaymentsView /> },
    { id: 'reports', label: 'Reports', icon: FileBarChart, render: () => <PetshopReportsView /> },
    { id: 'settings', label: 'Settings', icon: Settings, render: () => <PetshopSettingsView /> },
  ],
  Groomer: [
    { id: 'grooming', label: 'Grooming board', icon: Scissors, render: () => <PetshopAppointmentsView grooming /> },
    { id: 'appointments', label: 'Appointments', icon: CalendarDays, render: () => <PetshopAppointmentsView /> },
    { id: 'pets', label: 'Pets', icon: PawPrint, render: () => <PetshopPetsView /> },
    { id: 'inventory', label: 'Supplies', icon: BarChart3, render: () => <PetshopInventoryView /> },
  ],
};

const USERS = {
  'Shop manager': { name: 'Ana Ruiz', title: 'Shop manager' },
  Groomer: { name: 'Tomas Berg', title: 'Senior groomer' },
};

/** The interactive pet shop dashboard: the shared role-aware app shell with the shop's modules and brand variables. */
export function PetshopDashboard() {
  return (
    <div style={PETSHOP_THEME}>
      <AppShell brand={<PetshopLogo tone="dark" />} domain="admin.pawsome.example" roles={ROLES} nav={NAV} users={USERS} notifications={NOTIFICATIONS} />
    </div>
  );
}
