'use client';

import { Building2, CalendarClock, CreditCard, DoorOpen, FileBarChart, Home, LayoutDashboard, Megaphone, Settings, UsersRound, Wrench } from 'lucide-react';
import { AppShell } from '@/components/demos/shared/app-shell';
import type { ShellNavItem } from '@/components/demos/shared/app-shell';
import { NOTIFICATIONS } from '@/data/property/catalog';
import { PROPERTY_THEME } from '@/data/property/meta';
import { PropertyDashboardHome, PropertyMaintenanceView, PropertyPropertiesView, PropertyTenantsView, PropertyUnitsView } from './property-views-a';
import { PropertyPaymentsView, PropertyReportsView, PropertySettingsView, PropertyStaffView, PropertyVisitorsView } from './property-views-b';
import { PropertyLogo } from './property-logo';

type Role = 'Property manager' | 'Maintenance lead';
const ROLES: readonly Role[] = ['Property manager', 'Maintenance lead'];

const NAV: Record<Role, ShellNavItem[]> = {
  'Property manager': [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, render: () => <PropertyDashboardHome /> },
    { id: 'properties', label: 'Properties', icon: Building2, render: () => <PropertyPropertiesView /> },
    { id: 'units', label: 'Units', icon: Home, render: () => <PropertyUnitsView /> },
    { id: 'tenants', label: 'Tenants', icon: UsersRound, render: () => <PropertyTenantsView /> },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench, render: () => <PropertyMaintenanceView /> },
    { id: 'payments', label: 'Payments', icon: CreditCard, render: () => <PropertyPaymentsView /> },
    { id: 'visitors', label: 'Visitors', icon: DoorOpen, render: () => <PropertyVisitorsView /> },
    { id: 'staff', label: 'Staff', icon: CalendarClock, render: () => <PropertyStaffView /> },
    { id: 'reports', label: 'Reports', icon: FileBarChart, render: () => <PropertyReportsView /> },
    { id: 'settings', label: 'Settings', icon: Settings, render: () => <PropertySettingsView /> },
  ],
  'Maintenance lead': [
    { id: 'maintenance', label: 'Requests', icon: Wrench, render: () => <PropertyMaintenanceView /> },
    { id: 'staff', label: 'Staff tasks', icon: CalendarClock, render: () => <PropertyStaffView /> },
    { id: 'properties', label: 'Properties', icon: Building2, render: () => <PropertyPropertiesView /> },
    { id: 'visitors', label: 'Visitors', icon: DoorOpen, render: () => <PropertyVisitorsView /> },
    { id: 'announcements', label: 'Announcements', icon: Megaphone, render: () => <PropertyStaffView /> },
  ],
};

const USERS = {
  'Property manager': { name: 'Priya Shah', title: 'Portfolio manager' },
  'Maintenance lead': { name: 'Tomas Berg', title: 'Maintenance lead' },
};

/** The interactive property dashboard: the shared role-aware app shell with the portfolio's modules and brand variables. */
export function PropertyDashboard() {
  return (
    <div style={PROPERTY_THEME}>
      <AppShell brand={<PropertyLogo tone="dark" />} domain="admin.keystone.example" roles={ROLES} nav={NAV} users={USERS} notifications={NOTIFICATIONS} />
    </div>
  );
}
