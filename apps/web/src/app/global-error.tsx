'use client';

import './globals.css';

/** Last-resort boundary: replaces the whole document when the root layout itself fails, so it cannot rely on any provider. */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body>
        <main className="grid min-h-screen place-items-center px-6 text-center">
          <div className="max-w-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/branding/valorian-logo.png" alt="Valorian Studio" width={1190} height={321} className="mx-auto h-auto w-44" />
            <h1 className="mt-10 text-2xl font-semibold tracking-tight">Something went wrong</h1>
            <p className="mt-3 text-muted">Something went wrong. Please try again.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button type="button" onClick={reset} className="inline-flex h-11 items-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground">
                Try again
              </button>
              {/* A plain anchor on purpose: a full navigation resets any broken client state. */}
              <a href="/" className="inline-flex h-11 items-center rounded-full border border-border-strong px-6 text-sm font-semibold text-primary">
                Go home
              </a>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
