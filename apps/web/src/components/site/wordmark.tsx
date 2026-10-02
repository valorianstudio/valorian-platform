import Link from 'next/link';

export function Wordmark({ name, href = '/' }: { name: string; href?: string }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-2.5 rounded-lg" aria-label={`${name} home`}>
      <span aria-hidden className="relative grid size-8 place-items-center rounded-lg bg-foreground text-background">
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 5l8 14 8-14" />
        </svg>
        <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-accent ring-2 ring-background" />
      </span>
      <span className="text-lg font-semibold tracking-tight">{name}</span>
    </Link>
  );
}
