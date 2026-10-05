import type { CSSProperties } from 'react';
import type { DemoCategoryId } from '@/data/demos';

/** Routing, copy and brand variables shared by the Hotel Management demo's overview, experience bar, catalog card and sitemap. */

export const HOTEL_DEMO = {
  slug: 'hotel-management',
  title: 'Hotel Management System',
  basePath: '/demos/hotel-management',
} as const;

/**
 * Brand variables read by the shared demo components: luxury navy #0F172A, warm gold #D4AF37, teal #0F766E, warm beige #F5F1EB and
 * surface #F8FAFC. Gold is decorative; any gold text uses the darker "ink" shade so it stays readable on white.
 */
export const HOTEL_THEME = {
  '--demo-accent': '#0f172a',
  '--demo-accent-soft': '#f5f1eb',
  '--demo-accent-ink': '#0f766e',
  '--demo-accent-ring': '#d6cfc2',
  '--demo-good': '#0f766e',
  '--demo-good-soft': '#ecfdf9',
  '--demo-good-ink': '#0f5f58',
  '--demo-good-ring': '#99f0e4',
  '--demo-good-light': '#5eead4',
  '--demo-gold': '#D4AF37',
  '--demo-gold-ink': '#8a6d1f',
  '--demo-header': '#0f172a',
  '--demo-sidebar': '#0f172a',
  '--demo-nav-active': '#0f766e',
} as CSSProperties;

export type HotelExperienceKey = 'landing-page' | 'website' | 'mobile-app';

export const HOTEL_EXPERIENCES: {
  key: HotelExperienceKey;
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
    href: `${HOTEL_DEMO.basePath}/landing-page`,
    title: 'Luxury hotel booking website',
    description: 'A full-screen preview of a luxury hotel website: a booking widget, room categories, facilities, offers and a location section.',
    highlights: ['Hero with booking widget', 'Deluxe, suite and family rooms', 'Facilities, offers and location', 'Direct-booking call to action'],
  },
  {
    key: 'website',
    category: 'full-stack',
    label: 'Website',
    href: `${HOTEL_DEMO.basePath}/website`,
    title: 'Hotel dashboard and modules',
    description: 'The working hotel platform. Switch between front desk and housekeeping views and run reservations, rooms, guests and billing.',
    highlights: ['Dashboard with occupancy and revenue', 'Reservations and room availability', 'Guest profiles and stay history', 'Housekeeping, staff and invoices'],
  },
  {
    key: 'mobile-app',
    category: 'mobile-app',
    label: 'Mobile App',
    href: `${HOTEL_DEMO.basePath}/mobile-app`,
    title: 'Guest and staff mobile apps',
    description: 'Tap through the guest app from search to booking and payment, and run the day from the staff app.',
    highlights: ['Guest app: 9 screens', 'Staff app: 4 screens', 'Room search and booking in a few taps', 'Room status and task tracking'],
  },
];
