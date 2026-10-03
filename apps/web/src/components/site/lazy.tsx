'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Code-split wrappers for client components that are not needed for first paint. The page shell, text and images
 * render immediately; these chunks load afterwards, with a same-sized placeholder so the layout does not shift.
 */

/** Pure side-effect component (page views, click tracking): never worth blocking or server-rendering. */
export const LazyAnalyticsTracker = dynamic(() => import('./analytics-tracker').then((m) => m.AnalyticsTracker), { ssr: false });

export const LazyGallery = dynamic(() => import('./demos/gallery').then((m) => m.Gallery), {
  loading: () => (
    <div role="status" aria-label="Loading gallery" className="grid gap-4 sm:grid-cols-2">
      <Skeleton className="aspect-[16/10] rounded-xl" />
      <Skeleton className="aspect-[16/10] rounded-xl" />
    </div>
  ),
});

export const LazyShareButtons = dynamic(() => import('./share-buttons').then((m) => m.ShareButtons), { loading: () => <Skeleton className="h-10 w-48 rounded-full" /> });

export const LazyEstimatorWizard = dynamic(() => import('./estimator/wizard').then((m) => m.EstimatorWizard), {
  loading: () => (
    <div role="status" aria-label="Loading the estimator" className="space-y-4">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-72 w-full rounded-2xl" />
    </div>
  ),
});
