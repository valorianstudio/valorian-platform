import type { CSSProperties } from 'react';
import type { DemoCategoryId } from '@/data/demos';

/** Routing, copy and brand variables shared by the Clothing E-commerce demo's overview, its experience bar, the catalog card and the sitemap. */

export const CLOTHING_DEMO = {
  slug: 'clothing-ecommerce',
  title: 'Clothing E-commerce Platform',
  basePath: '/demos/clothing-ecommerce',
} as const;

/**
 * Brand variables read by the shared demo components: luxury black #111111, warm beige #F5F1EB, gold #D4AF37 and soft gray #F8FAFC.
 * Gold is used for decoration and highlights; its dark "ink" shade is used for any text, because gold on white is too low contrast.
 */
export const CLOTHING_THEME = {
  '--demo-accent': '#111111',
  '--demo-accent-soft': '#f5f1eb',
  '--demo-accent-ink': '#111111',
  '--demo-accent-ring': '#e7dccb',
  '--demo-good': '#b8912a',
  '--demo-good-soft': '#faf6ea',
  '--demo-good-ink': '#7a5f14',
  '--demo-good-ring': '#ead9a6',
  '--demo-good-light': '#e8c766',
  '--demo-header': '#111111',
  '--demo-sidebar': '#111111',
  '--demo-nav-active': '#111111',
} as CSSProperties;

export type ClothingExperienceKey = 'landing-page' | 'website' | 'mobile-app';

export const CLOTHING_EXPERIENCES: {
  key: ClothingExperienceKey;
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
    href: `${CLOTHING_DEMO.basePath}/landing-page`,
    title: 'Fashion brand website',
    description: 'A full-screen preview of a fashion brand homepage: a hero campaign, featured collections, the lookbook and a newsletter sign-up.',
    highlights: ['Hero with featured collection', 'Men, women and accessories', 'Lookbook and reviews', 'Newsletter sign-up'],
  },
  {
    key: 'website',
    category: 'full-stack',
    label: 'Website',
    href: `${CLOTHING_DEMO.basePath}/website`,
    title: 'Online store and admin dashboard',
    description: 'A working shop with product pages, a cart and checkout, plus the admin dashboard for products, orders and stock.',
    highlights: ['Shop, filters and product pages', 'Cart, checkout and profile', 'Sales dashboard and order management', 'Inventory and discounts'],
  },
  {
    key: 'mobile-app',
    category: 'mobile-app',
    label: 'Mobile App',
    href: `${CLOTHING_DEMO.basePath}/mobile-app`,
    title: 'Shopping and seller mobile apps',
    description: 'Tap through the shopping app from search to checkout and order tracking, and run the store from the seller app.',
    highlights: ['Shopper app: 10 screens', 'Seller app: 4 screens', 'Add to bag and checkout in a few taps', 'Order tracking and sales analytics'],
  },
];
