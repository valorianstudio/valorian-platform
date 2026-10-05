import type { CSSProperties } from 'react';
import type { DemoCategoryId } from '@/data/demos';

/** Routing, copy and brand variables shared by the Pharmacy demo's overview, experience bar, catalog card and sitemap. */

export const PHARMACY_DEMO = {
  slug: 'pharmacy-management',
  title: 'Pharmacy Management System',
  basePath: '/demos/pharmacy-management',
} as const;

/**
 * Brand variables read by the shared demo components: medical blue #0F4C81, healthcare teal #0F766E, green #16A34A, soft cyan #06B6D4,
 * surface #F8FAFC on a white background. Teal carries the call-to-action buttons; cyan is the highlight for the active navigation item.
 */
export const PHARMACY_THEME = {
  '--demo-accent': '#0f4c81',
  '--demo-accent-soft': '#e6f0f8',
  '--demo-accent-ink': '#0b3a63',
  '--demo-accent-ring': '#bfdbfe',
  '--demo-good': '#16a34a',
  '--demo-good-soft': '#dcfce7',
  '--demo-good-ink': '#15803d',
  '--demo-good-ring': '#bbf7d0',
  '--demo-good-light': '#86efac',
  '--demo-orange': '#0f766e',
  '--demo-orange-ink': '#115e59',
  '--demo-cyan': '#06b6d4',
  '--demo-header': '#0b3a63',
  '--demo-sidebar': '#0b3a63',
  '--demo-nav-active': '#06b6d4',
} as CSSProperties;

export type PharmacyExperienceKey = 'landing-page' | 'website' | 'mobile-app';

export const PHARMACY_EXPERIENCES: {
  key: PharmacyExperienceKey;
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
    href: `${PHARMACY_DEMO.basePath}/landing-page`,
    title: 'Pharmacy website',
    description: 'A full-screen preview of a digital pharmacy: online medicine ordering, prescription uploads, categories and delivery information.',
    highlights: ['Hero with medicine preview', 'Prescription and healthcare categories', 'Delivery and pharmacist support', 'Order and refill call to action'],
  },
  {
    key: 'website',
    category: 'full-stack',
    label: 'Website',
    href: `${PHARMACY_DEMO.basePath}/website`,
    title: 'Pharmacy dashboard and modules',
    description: 'The working pharmacy platform. Track medicines, expiry and stock, review prescriptions, manage orders and follow sales.',
    highlights: ['Dashboard with stock and orders', 'Medicines with expiry dates', 'Prescriptions with doctor details', 'Low stock alerts and supplier records'],
  },
  {
    key: 'mobile-app',
    category: 'mobile-app',
    label: 'Mobile App',
    href: `${PHARMACY_DEMO.basePath}/mobile-app`,
    title: 'Pharmacy customer and staff apps',
    description: 'Search medicines, upload a prescription, check out and track delivery. Staff review orders, prescriptions and stock from the same phone.',
    highlights: ['Customer app: 10 screens', 'Staff app: 5 screens', 'Prescription upload and review', 'Medicine reminders and delivery status'],
  },
];
