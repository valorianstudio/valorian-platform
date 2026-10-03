'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { RotateCw } from 'lucide-react';
import { Button } from './button';

/** Re-runs the current route's server data fetching without a full page reload. */
export function RetryButton({ label = 'Try again' }: { label?: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <Button loading={pending} onClick={() => startTransition(() => router.refresh())}>
      {!pending && <RotateCw className="size-4" aria-hidden />}
      {pending ? 'Retrying…' : label}
    </Button>
  );
}
