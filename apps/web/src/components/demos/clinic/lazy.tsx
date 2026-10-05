'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Code-split wrappers for the two heavy interactive clinic demos. Their JavaScript is only requested on the route that uses it,
 * and the placeholder holds the same height so the page does not jump. They still render on the server, so the first view is in the HTML.
 */

export const LazyClinicDashboard = dynamic(() => import('./clinic-dashboard').then((m) => m.ClinicDashboard), {
  loading: () => (
    <div role="status" aria-label="Loading the clinic dashboard demo">
      <Skeleton className="h-[44rem] w-full rounded-2xl" />
    </div>
  ),
});

export const LazyClinicMobileApp = dynamic(() => import('./clinic-mobile-app').then((m) => m.ClinicMobileApp), {
  loading: () => (
    <div role="status" aria-label="Loading the clinic mobile app demo">
      <Skeleton className="h-[40rem] w-full rounded-2xl" />
    </div>
  ),
});
