import { ApiError } from '@/lib/client-api';

export function FormAlert({ error }: { error: ApiError | null }) {
  if (!error) return null;
  return (
    <div role="alert" className="rounded-lg border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger">
      <p className="font-medium">{error.message}</p>
      {error.details.length > 0 && (
        <ul className="mt-1 list-disc space-y-0.5 pl-5">
          {error.details.map((detail) => (
            <li key={detail}>{detail}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
