'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Code-split wrappers for the two heavy interactive hotel demos. Their JavaScript loads only on the route that uses it, and the
 * placeholder holds the same height so the page does not jump. They still render on the server, so the first view is in the HTML.
 */

export const LazyHotelDashboard = dynamic(() => import('./hotel-dashboard').then((m) => m.HotelDashboard), {
  loading: () => (
    <div role="status" aria-label="Loading the hotel dashboard demo">
      <Skeleton className="h-[44rem] w-full rounded-2xl" />
    </div>
  ),
});

export const LazyHotelMobileApp = dynamic(() => import('./hotel-mobile-app').then((m) => m.HotelMobileApp), {
  loading: () => (
    <div role="status" aria-label="Loading the hotel mobile app demo">
      <Skeleton className="h-[40rem] w-full rounded-2xl" />
    </div>
  ),
});
