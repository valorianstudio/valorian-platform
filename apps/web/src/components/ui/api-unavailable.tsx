import { EmptyState } from './states';
import { RetryButton } from './retry-button';

/** Shown instead of a crash when the API cannot be reached; the header and footer around it keep working. */
export function ApiUnavailable({ what = 'This content' }: { what?: string }) {
  return (
    <div className="mx-auto w-full max-w-xl px-5 py-24 sm:px-8">
      <EmptyState
        title={`${what} is temporarily unavailable`}
        description="We could not load this page right now. This is usually brief, so please try again in a moment."
        action={<RetryButton />}
      />
    </div>
  );
}
