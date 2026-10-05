'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Code-split wrappers for the two heavy interactive LMS demos. Their JavaScript is only requested on the route that uses it,
 * and the placeholder holds the same height so the page does not jump. They still render on the server, so the first view is in the HTML.
 */

export const LazyCourseDashboard = dynamic(() => import('./course-dashboard').then((m) => m.CourseDashboard), {
  loading: () => (
    <div role="status" aria-label="Loading the LMS dashboard demo">
      <Skeleton className="h-[44rem] w-full rounded-2xl" />
    </div>
  ),
});

export const LazyCourseMobileApp = dynamic(() => import('./course-mobile-app').then((m) => m.CourseMobileApp), {
  loading: () => (
    <div role="status" aria-label="Loading the LMS mobile app demo">
      <Skeleton className="h-[40rem] w-full rounded-2xl" />
    </div>
  ),
});
