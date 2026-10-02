import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div role="status" aria-label="Loading" className="mx-auto w-full max-w-7xl space-y-6 px-5 py-16 sm:px-8">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-14 w-full max-w-2xl" />
      <Skeleton className="h-6 w-full max-w-xl" />
      <div className="grid gap-4 pt-6 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-44" />
        ))}
      </div>
    </div>
  );
}
