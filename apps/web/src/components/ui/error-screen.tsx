'use client';

import { useEffect } from 'react';
import { ButtonLink, Button } from '@/components/ui/button';
import { ErrorState } from '@/components/ui/states';

interface ErrorScreenProps {
  error?: Error & { digest?: string };
  reset: () => void;
  /** Where the "home" button leads: the site for visitors, the dashboard inside the admin / portal. */
  homeHref?: string;
  homeLabel?: string;
  compact?: boolean;
}

/** The one error UI used by every error boundary: calm message, retry, and a way out. */
export function ErrorScreen({ error, reset, homeHref = '/', homeLabel = 'Go home', compact = false }: ErrorScreenProps) {
  useEffect(() => {
    // Surfaces in the browser console and any error monitoring that hooks window errors; the digest links to server logs.
    if (error) console.error('Rendering error', error.digest ?? '', error.message);
  }, [error]);

  return (
    <div className={compact ? 'w-full' : 'mx-auto grid min-h-[60vh] w-full max-w-xl place-items-center px-5 py-20'}>
      <ErrorState
        title="Something went wrong"
        description="Something went wrong. Please try again."
        action={
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            <Button onClick={reset}>Try again</Button>
            <ButtonLink href={homeHref} variant="secondary">
              {homeLabel}
            </ButtonLink>
          </div>
        }
      />
    </div>
  );
}
