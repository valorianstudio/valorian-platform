'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Code-split wrappers for the two heavy interactive gym demos. Their JavaScript is only requested on the route that uses it,
 * and the placeholder holds the same height so the page does not jump. They still render on the server, so the first view is in the HTML.
 */

export const LazyGymDashboard = dynamic(() => import('./gym-dashboard').then((m) => m.GymDashboard), {
  loading: () => (
    <div role="status" aria-label="Loading the gym dashboard demo">
      <Skeleton className="h-[44rem] w-full rounded-2xl" />
    </div>
  ),
});

export const LazyGymMobileApp = dynamic(() => import('./gym-mobile-app').then((m) => m.GymMobileApp), {
  loading: () => (
    <div role="status" aria-label="Loading the gym mobile app demo">
      <Skeleton className="h-[40rem] w-full rounded-2xl" />
    </div>
  ),
});
