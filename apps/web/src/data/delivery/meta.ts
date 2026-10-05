import type { CSSProperties } from 'react';
import type { DemoCategoryId } from '@/data/demos';

/** Routing, copy and brand variables shared by the Bike Delivery demo's overview, experience bar, catalog card and sitemap. */

export const DELIVERY_DEMO = {
  slug: 'bike-delivery',
  title: 'Bike Ride & Delivery Management System',
  basePath: '/demos/bike-delivery',
} as const;

/**
 * Brand variables read by the shared demo components: deep blue #1D4ED8, dark navy #0F172A, orange #F97316, green #22C55E and surface
 * #F8FAFC. Orange highlights the active item and key calls to action; its dark "ink" shade is used for any orange text.
 */
export const DELIVERY_THEME = {
  '--demo-accent': '#1d4ed8',
  '--demo-accent-soft': '#eff6ff',
  '--demo-accent-ink': '#1e40af',
  '--demo-accent-ring': '#bfdbfe',
  '--demo-good': '#22c55e',
  '--demo-good-soft': '#f0fdf4',
  '--demo-good-ink': '#15803d',
  '--demo-good-ring': '#bbf7d0',
  '--demo-good-light': '#86efac',
  '--demo-orange': '#f97316',
  '--demo-orange-ink': '#c2410c',
  '--demo-header': '#0f172a',
  '--demo-sidebar': '#0f172a',
  '--demo-nav-active': '#f97316',
} as CSSProperties;

export type DeliveryExperienceKey = 'landing-page' | 'website' | 'mobile-app';

export const DELIVERY_EXPERIENCES: {
  key: DeliveryExperienceKey;
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
    href: `${DELIVERY_DEMO.basePath}/landing-page`,
    title: 'Delivery service website',
    description: 'A full-screen preview of a delivery startup: a booking hero with live tracking, service categories, how it works and pricing.',
    highlights: ['Hero with live tracking preview', 'Food, parcel and business delivery', 'How it works in four steps', 'Partner and customer proof'],
  },
  {
    key: 'website',
    category: 'full-stack',
    label: 'Website',
    href: `${DELIVERY_DEMO.basePath}/website`,
    title: 'Dispatch dashboard and modules',
    description: 'The working logistics platform. Switch between dispatcher and rider views and run orders, riders, routes and payments.',
    highlights: ['Dashboard with live KPIs', 'Orders, riders and live tracking', 'Routes, customers and payments', 'Analytics and reports'],
  },
  {
    key: 'mobile-app',
    category: 'mobile-app',
    label: 'Mobile App',
    href: `${DELIVERY_DEMO.basePath}/mobile-app`,
    title: 'Customer and rider mobile apps',
    description: 'Tap through the customer app from booking to tracking and payment, and run a shift from the rider app.',
    highlights: ['Customer app: 9 screens', 'Rider app: 5 screens', 'Book a delivery in three taps', 'Live navigation and earnings'],
  },
];
