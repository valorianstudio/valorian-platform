import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { SITE_URL } from '@/lib/site';

/** Renders schema.org JSON-LD. `<` is escaped so content can never close the script tag. */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />;
}

export interface Crumb {
  name: string;
  href?: string;
}

export function Breadcrumbs({ items, base = SITE_URL }: { items: Crumb[]; base?: string }) {
  const trail: Crumb[] = [{ name: 'Home', href: '/' }, ...items];
  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
          {trail.map((crumb, index) => (
            <li key={crumb.name} className="flex items-center gap-1.5">
              {index > 0 && <ChevronRight className="size-3.5" aria-hidden />}
              {crumb.href && index < trail.length - 1 ? (
                <Link href={crumb.href} className="inline-block py-1.5 transition-colors hover:text-foreground">
                  {crumb.name}
                </Link>
              ) : (
                <span aria-current={index === trail.length - 1 ? 'page' : undefined} className="max-w-[16rem] truncate text-foreground sm:max-w-none">
                  {crumb.name}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: trail.map((crumb, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: crumb.name,
            ...(crumb.href ? { item: `${base}${crumb.href === '/' ? '' : crumb.href}` } : {}),
          })),
        }}
      />
    </>
  );
}
