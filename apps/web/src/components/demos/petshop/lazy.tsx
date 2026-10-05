'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Code-split wrappers for the two heavy interactive pet shop demos. Their JavaScript loads only on the route that uses it, and the
 * placeholder holds the same height so the page does not jump. They still render on the server, so the first view is in the HTML.
 */

export const LazyPetshopDashboard = dynamic(() => import('./petshop-dashboard').then((m) => m.PetshopDashboard), {
  loading: () => (
    <div role="status" aria-label="Loading the pet shop dashboard demo">
      <Skeleton className="h-[44rem] w-full rounded-2xl" />
    </div>
  ),
});

export const LazyPetshopMobileApp = dynamic(() => import('./petshop-mobile-app').then((m) => m.PetshopMobileApp), {
  loading: () => (
    <div role="status" aria-label="Loading the pet shop mobile app demo">
      <Skeleton className="h-[40rem] w-full rounded-2xl" />
    </div>
  ),
});
