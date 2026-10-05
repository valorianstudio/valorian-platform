'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Code-split wrappers for the two heavy interactive demos. Their JavaScript is only requested on the route that uses it, and the
 * placeholder holds the same height so the page does not jump when the chunk arrives. They still render on the server,
 * so the first view is in the HTML.
 */

export const LazySchoolWebsiteDemo = dynamic(() => import('./school-website-demo').then((m) => m.SchoolWebsiteDemo), {
  loading: () => (
    <div role="status" aria-label="Loading the school website demo">
      <Skeleton className="h-[44rem] w-full rounded-2xl" />
    </div>
  ),
});

export const LazySchoolMobileDemo = dynamic(() => import('./school-mobile-demo').then((m) => m.SchoolMobileDemo), {
  loading: () => (
    <div role="status" aria-label="Loading the mobile app demo">
      <Skeleton className="h-[40rem] w-full rounded-2xl" />
    </div>
  ),
});
