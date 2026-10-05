'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Code-split wrappers for the two heavy interactive pharmacy demos. Their JavaScript loads only on the route that uses it, and the
 * placeholder holds the same height so the page does not jump. They still render on the server, so the first view is in the HTML.
 */

export const LazyPharmacyDashboard = dynamic(() => import('./pharmacy-dashboard').then((m) => m.PharmacyDashboard), {
  loading: () => (
    <div role="status" aria-label="Loading the pharmacy dashboard demo">
      <Skeleton className="h-[44rem] w-full rounded-2xl" />
    </div>
  ),
});

export const LazyPharmacyMobileApp = dynamic(() => import('./pharmacy-mobile-app').then((m) => m.PharmacyMobileApp), {
  loading: () => (
    <div role="status" aria-label="Loading the pharmacy mobile app demo">
      <Skeleton className="h-[40rem] w-full rounded-2xl" />
    </div>
  ),
});
