'use client';

import { BarChart3, CalendarDays, ClipboardList, FileBarChart, LayoutDashboard, Package, Pill as PillIcon, Boxes, Settings, ShoppingBag, Truck, Users } from 'lucide-react';
import { AppShell } from '@/components/demos/shared/app-shell';
import type { ShellNavItem } from '@/components/demos/shared/app-shell';
import { NOTIFICATIONS } from '@/data/pharmacy/catalog';
import { PHARMACY_THEME } from '@/data/pharmacy/meta';
import { PharmacyDashboardHome, PharmacyInventoryView, PharmacyMedicinesView, PharmacyPrescriptionsView } from './pharmacy-views-a';
import { PharmacyCustomersView, PharmacyOrdersView, PharmacyReportsView, PharmacySalesView, PharmacySettingsView, PharmacySuppliersView } from './pharmacy-views-b';
import { PharmacyLogo } from './pharmacy-logo';

type Role = 'Pharmacy manager' | 'Pharmacist';
const ROLES: readonly Role[] = ['Pharmacy manager', 'Pharmacist'];

const NAV: Record<Role, ShellNavItem[]> = {
  'Pharmacy manager': [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, render: () => <PharmacyDashboardHome /> },
    { id: 'medicines', label: 'Medicines', icon: PillIcon, render: () => <PharmacyMedicinesView /> },
    { id: 'inventory', label: 'Inventory', icon: Boxes, render: () => <PharmacyInventoryView /> },
    { id: 'prescriptions', label: 'Prescriptions', icon: ClipboardList, render: () => <PharmacyPrescriptionsView /> },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, render: () => <PharmacyOrdersView /> },
    { id: 'customers', label: 'Customers', icon: Users, render: () => <PharmacyCustomersView /> },
    { id: 'suppliers', label: 'Suppliers', icon: Truck, render: () => <PharmacySuppliersView /> },
    { id: 'sales', label: 'Sales', icon: BarChart3, render: () => <PharmacySalesView /> },
    { id: 'reports', label: 'Reports', icon: FileBarChart, render: () => <PharmacyReportsView /> },
    { id: 'settings', label: 'Settings', icon: Settings, render: () => <PharmacySettingsView /> },
  ],
  Pharmacist: [
    { id: 'prescriptions', label: 'Prescriptions', icon: ClipboardList, render: () => <PharmacyPrescriptionsView /> },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, render: () => <PharmacyOrdersView /> },
    { id: 'medicines', label: 'Medicines', icon: PillIcon, render: () => <PharmacyMedicinesView /> },
    { id: 'inventory', label: 'Stock', icon: Package, render: () => <PharmacyInventoryView /> },
    { id: 'customers', label: 'Patients', icon: CalendarDays, render: () => <PharmacyCustomersView /> },
  ],
};

const USERS = {
  'Pharmacy manager': { name: 'Priya Shah', title: 'Pharmacy manager' },
  Pharmacist: { name: 'Leon Park', title: 'Registered pharmacist' },
};

/** The interactive pharmacy dashboard: the shared role-aware app shell with the pharmacy's modules and brand variables. */
export function PharmacyDashboard() {
  return (
    <div style={PHARMACY_THEME}>
      <AppShell brand={<PharmacyLogo tone="dark" />} domain="admin.clearwell.example" roles={ROLES} nav={NAV} users={USERS} notifications={NOTIFICATIONS} />
    </div>
  );
}
