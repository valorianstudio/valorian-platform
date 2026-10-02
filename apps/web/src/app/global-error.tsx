'use client';

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', display: 'grid', minHeight: '100vh', placeItems: 'center', textAlign: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem' }}>Something went wrong</h1>
          <p style={{ color: '#5b6678' }}>Please try again in a moment.</p>
          <button type="button" onClick={reset} style={{ marginTop: '1rem', padding: '0.6rem 1.2rem', borderRadius: 8, border: 0, background: '#2f6fed', color: '#fff', cursor: 'pointer' }}>
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
