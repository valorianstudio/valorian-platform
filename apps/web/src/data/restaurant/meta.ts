import type { CSSProperties } from 'react';
import type { DemoCategoryId } from '@/data/demos';

/** Routing, copy and brand variables shared by the Restaurant Management demo's overview, its experience bar, the catalog card and the sitemap. */

export const RESTAURANT_DEMO = {
  slug: 'restaurant-management',
  title: 'Restaurant Management System',
  basePath: '/demos/restaurant-management',
} as const;

/**
 * Brand variables read by the shared demo components (components/demos/shared): deep charcoal #111827, warm gold #D97706 and
 * fresh green #16A34A. Gold is used as a tint and in dark shades ("ink"), so text on white keeps its contrast.
 */
export const RESTAURANT_THEME = {
  '--demo-accent': '#111827',
  '--demo-accent-soft': '#fef3c7',
  '--demo-accent-ink': '#78350f',
  '--demo-accent-ring': '#fde68a',
  '--demo-good': '#16a34a',
  '--demo-good-soft': '#f0fdf4',
  '--demo-good-ink': '#166534',
  '--demo-good-ring': '#bbf7d0',
  '--demo-good-light': '#86efac',
  '--demo-header': '#111827',
  '--demo-sidebar': '#111827',
  '--demo-nav-active': '#b45309',
} as CSSProperties;

export type RestaurantExperienceKey = 'landing-page' | 'website' | 'mobile-app';

export const RESTAURANT_EXPERIENCES: {
  key: RestaurantExperienceKey;
  /** The Solutions & Demos showcase category this experience belongs to. */
  category: DemoCategoryId;
  label: string;
  href: string;
  title: string;
  description: string;
  highlights: string[];
}[] = [
  {
    key: 'landing-page',
    category: 'landing-page',
    label: 'Landing Page',
    href: `${RESTAURANT_DEMO.basePath}/landing-page`,
    title: 'Restaurant marketing website',
    description: 'A full-screen preview of the website your restaurant software is sold with: premium, fast and built to turn visitors into bookings.',
    highlights: ['Hero with product preview', 'Seven core modules and a digital menu', 'Chefs, testimonials and pricing', 'Demo request form'],
  },
  {
    key: 'website',
    category: 'full-stack',
    label: 'Website',
    href: `${RESTAURANT_DEMO.basePath}/website`,
    title: 'Restaurant dashboard and POS modules',
    description: 'The working restaurant platform. Switch between manager and waiter views and run orders, tables, menu and stock.',
    highlights: ['Sales dashboard with live charts', 'Orders, menu, tables and reservations', 'Inventory alerts and staff roster', 'Reports and settings'],
  },
  {
    key: 'mobile-app',
    category: 'mobile-app',
    label: 'Mobile App',
    href: `${RESTAURANT_DEMO.basePath}/mobile-app`,
    title: 'Guest and staff mobile apps',
    description: 'Tap through realistic phone screens: browse the menu, build a cart and track an order, or run the kitchen queue as staff.',
    highlights: ['Guest app: 8 screens', 'Staff app: 4 screens', 'Cart, checkout and live order tracking', 'Kitchen queue and table status'],
  },
];
