'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Code-split wrappers for the two heavy interactive property demos. Their JavaScript loads only on the route that uses it, and the
 * placeholder holds the same height so the page does not jump. They still render on the server, so the first view is in the HTML.
 */

export const LazyPropertyDashboard = dynamic(() => import('./property-dashboard').then((m) => m.PropertyDashboard), {
  loading: () => (
    <div role="status" aria-label="Loading the property dashboard demo">
      <Skeleton className="h-[44rem] w-full rounded-2xl" />
    </div>
  ),
});

export const LazyPropertyMobileApp = dynamic(() => import('./property-mobile-app').then((m) => m.PropertyMobileApp), {
  loading: () => (
    <div role="status" aria-label="Loading the property mobile app demo">
      <Skeleton className="h-[40rem] w-full rounded-2xl" />
    </div>
  ),
});
