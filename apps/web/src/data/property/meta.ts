import type { CSSProperties } from 'react';
import type { DemoCategoryId } from '@/data/demos';

/** Routing, copy and brand variables shared by the Property demo's overview, experience bar, catalog card and sitemap. */

export const PROPERTY_DEMO = {
  slug: 'property-management',
  title: 'House & Building Management System',
  basePath: '/demos/property-management',
} as const;

/**
 * Brand variables read by the shared demo components: deep navy #0F172A for structure, slate blue #334155 for secondary text, emerald
 * #10B981 for positive states (its darker shade carries buttons so white text stays readable) and warm gold #D4AF37 as the highlight.
 */
export const PROPERTY_THEME = {
  '--demo-accent': '#0f172a',
  '--demo-accent-soft': '#f1f5f9',
  '--demo-accent-ink': '#0f172a',
  '--demo-accent-ring': '#cbd5e1',
  '--demo-good': '#10b981',
  '--demo-good-soft': '#d1fae5',
  '--demo-good-ink': '#047857',
  '--demo-good-ring': '#a7f3d0',
  '--demo-good-light': '#6ee7b7',
  '--demo-orange': '#047857',
  '--demo-orange-ink': '#065f46',
  '--demo-gold': '#d4af37',
  '--demo-header': '#0f172a',
  '--demo-sidebar': '#0f172a',
  '--demo-nav-active': '#d4af37',
} as CSSProperties;

export type PropertyExperienceKey = 'landing-page' | 'website' | 'mobile-app';

export const PROPERTY_EXPERIENCES: {
  key: PropertyExperienceKey;
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
    href: `${PROPERTY_DEMO.basePath}/landing-page`,
    title: 'Property management website',
    description: 'A full-screen preview of a property management company: its portfolio, resident features, smart living and a booking call to action.',
    highlights: ['Hero with property dashboard preview', 'Apartments, residential and commercial', 'Smart home and visitor features', 'Pricing and enquiry form'],
  },
  {
    key: 'website',
    category: 'full-stack',
    label: 'Website',
    href: `${PROPERTY_DEMO.basePath}/website`,
    title: 'Property dashboard and modules',
    description: 'The working management platform. Track properties, units, tenants, maintenance, rent collection and building operations.',
    highlights: ['Dashboard with occupancy and revenue', 'Properties, units and leases', 'Maintenance tickets with priorities', 'Rent payments and visitor logs'],
  },
  {
    key: 'mobile-app',
    category: 'mobile-app',
    label: 'Mobile App',
    href: `${PROPERTY_DEMO.basePath}/mobile-app`,
    title: 'Resident and manager apps',
    description: 'Residents report repairs, pay rent and approve visitors. Managers run the portfolio, tenants, requests and payments from the same phone.',
    highlights: ['Resident app: 9 screens', 'Manager app: 5 screens', 'Maintenance requests with status', 'Visitor approval from anywhere'],
  },
];
