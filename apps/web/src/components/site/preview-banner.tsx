import Link from 'next/link';

export function PreviewBanner({ status, editHref }: { status: string; editHref: string }) {
  return (
    <div role="status" className="sticky top-0 z-50 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 bg-foreground px-4 py-2 text-sm text-background">
      <span>
        Admin preview · status: <strong>{status.toLowerCase()}</strong>. This page is not public.
      </span>
      <Link href={editHref} className="font-medium underline underline-offset-2">
        Back to editor
      </Link>
    </div>
  );
}
