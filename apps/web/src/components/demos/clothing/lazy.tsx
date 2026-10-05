'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Code-split wrappers for the two heavy interactive clothing demos. Their JavaScript loads only on the route that uses it, and the
 * placeholder holds the same height so the page does not jump. They still render on the server, so the first view is in the HTML.
 */

export const LazyEcommerceWebsite = dynamic(() => import('./ecommerce-website').then((m) => m.EcommerceWebsite), {
  loading: () => (
    <div role="status" aria-label="Loading the store demo">
      <Skeleton className="h-[46rem] w-full rounded-2xl" />
    </div>
  ),
});

export const LazyClothingMobileApp = dynamic(() => import('./clothing-mobile-app').then((m) => m.ClothingMobileApp), {
  loading: () => (
    <div role="status" aria-label="Loading the shopping app demo">
      <Skeleton className="h-[40rem] w-full rounded-2xl" />
    </div>
  ),
});
