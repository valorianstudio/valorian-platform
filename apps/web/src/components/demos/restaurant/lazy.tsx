'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Code-split wrappers for the two heavy interactive restaurant demos. Their JavaScript is only requested on the route that uses it,
 * and the placeholder holds the same height so the page does not jump. They still render on the server, so the first view is in the HTML.
 */

export const LazyRestaurantDashboard = dynamic(() => import('./restaurant-dashboard').then((m) => m.RestaurantDashboard), {
  loading: () => (
    <div role="status" aria-label="Loading the restaurant dashboard demo">
      <Skeleton className="h-[44rem] w-full rounded-2xl" />
    </div>
  ),
});

export const LazyRestaurantMobileApp = dynamic(() => import('./restaurant-mobile-app').then((m) => m.RestaurantMobileApp), {
  loading: () => (
    <div role="status" aria-label="Loading the restaurant mobile app demo">
      <Skeleton className="h-[40rem] w-full rounded-2xl" />
    </div>
  ),
});
