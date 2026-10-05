'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Code-split wrappers for the two heavy interactive delivery demos. Their JavaScript loads only on the route that uses it, and the
 * placeholder holds the same height so the page does not jump. They still render on the server, so the first view is in the HTML.
 */

export const LazyDeliveryDashboard = dynamic(() => import('./delivery-dashboard').then((m) => m.DeliveryDashboard), {
  loading: () => (
    <div role="status" aria-label="Loading the delivery dashboard demo">
      <Skeleton className="h-[44rem] w-full rounded-2xl" />
    </div>
  ),
});

export const LazyDeliveryMobileApp = dynamic(() => import('./delivery-mobile-app').then((m) => m.DeliveryMobileApp), {
  loading: () => (
    <div role="status" aria-label="Loading the delivery mobile app demo">
      <Skeleton className="h-[40rem] w-full rounded-2xl" />
    </div>
  ),
});
