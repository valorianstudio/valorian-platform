'use client';

import { BarChart3, ClipboardList, LayoutDashboard, Package, Settings, ShoppingBag, Tag, Users, Warehouse, Store } from 'lucide-react';
import { useState } from 'react';
import { Tabs } from '@/components/demos/shared/app-ui';
import { AppShell } from '@/components/demos/shared/app-shell';
import type { ShellNavItem } from '@/components/demos/shared/app-shell';
import { NOTIFICATIONS } from '@/data/clothing/catalog';
import { CLOTHING_THEME } from '@/data/clothing/meta';
import { AdminAnalyticsView, AdminCustomersView, AdminDashboardHome, AdminDiscountsView, AdminInventoryView, AdminOrdersView, AdminProductsView, AdminSettingsView } from './admin-views';
import { ClothingLogo } from './clothing-logo';
import { Storefront } from './storefront';

type Role = 'Store admin' | 'Merchandiser';
const ROLES: readonly Role[] = ['Store admin', 'Merchandiser'];

const NAV: Record<Role, ShellNavItem[]> = {
  'Store admin': [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, render: () => <AdminDashboardHome /> },
    { id: 'products', label: 'Products', icon: Package, render: () => <AdminProductsView /> },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, render: () => <AdminOrdersView /> },
    { id: 'customers', label: 'Customers', icon: Users, render: () => <AdminCustomersView /> },
    { id: 'inventory', label: 'Inventory', icon: Warehouse, render: () => <AdminInventoryView /> },
    { id: 'discounts', label: 'Discounts', icon: Tag, render: () => <AdminDiscountsView /> },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, render: () => <AdminAnalyticsView /> },
    { id: 'settings', label: 'Settings', icon: Settings, render: () => <AdminSettingsView /> },
  ],
  Merchandiser: [
    { id: 'products', label: 'Products', icon: Package, render: () => <AdminProductsView /> },
    { id: 'inventory', label: 'Inventory', icon: Warehouse, render: () => <AdminInventoryView /> },
    { id: 'orders', label: 'Orders', icon: ClipboardList, render: () => <AdminOrdersView /> },
    { id: 'discounts', label: 'Discounts', icon: Tag, render: () => <AdminDiscountsView /> },
  ],
};

const USERS = {
  'Store admin': { name: 'Amelia Stone', title: 'Store director' },
  Merchandiser: { name: 'Jonah Pierce', title: 'Merchandising lead' },
};

/**
 * The e-commerce website demo: the customer storefront and the admin dashboard, one switch apart. The storefront is the shop a customer
 * sees; the admin is the shared app shell with the store's modules. Both share the brand palette and run on dummy data only.
 */
export function EcommerceWebsite() {
  const [side, setSide] = useState<'shop' | 'admin'>('shop');
  return (
    <div style={CLOTHING_THEME} className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs label="View" value={side} onChange={setSide} tabs={[{ id: 'shop', label: 'Customer store' }, { id: 'admin', label: 'Admin dashboard' }]} />
        <span className="inline-flex items-center gap-1.5 text-xs text-slate-500"><Store className="size-3.5" aria-hidden /> {side === 'shop' ? 'Try adding to bag, then open the bag.' : 'Move an order forward, or switch a discount off.'}</span>
      </div>
      {side === 'shop' ? (
        <Storefront />
      ) : (
        <AppShell brand={<ClothingLogo tone="dark" />} domain="admin.maisonvale.example" roles={ROLES} nav={NAV} users={USERS} notifications={NOTIFICATIONS} />
      )}
    </div>
  );
}
