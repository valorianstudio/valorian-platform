'use client';

import { Button, ButtonLink } from '@/components/ui/button';
import { ErrorState } from '@/components/ui/states';

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="mx-auto grid min-h-[60vh] w-full max-w-xl place-items-center px-5 py-20">
      <ErrorState
        title="Something went wrong"
        description="An unexpected error occurred. Please try again, or return to the home page."
        action={
          <div className="mt-2 flex gap-3">
            <Button onClick={reset}>Try again</Button>
            <ButtonLink href="/" variant="secondary">
              Home
            </ButtonLink>
          </div>
        }
      />
    </main>
  );
}
