import type { Metadata } from 'next';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
import { DemoCard } from '@/components/site/demos/demo-card';
import { PageHero } from '@/components/site/page-hero';
import { Button, ButtonLink } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/field';
import { Section } from '@/components/ui/section';
import { EmptyState } from '@/components/ui/states';
import { buildMetadata, getDemoList, getPageSeo } from '@/lib/cms';

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata(await getPageSeo('DEMOS'), { title: 'Demos', description: 'Explore web and mobile product concepts and prototypes built by Valorian Studio.', path: '/demos' });
}

type Params = Record<string, string | string[] | undefined>;
const PLATFORMS = [
  { value: 'website', label: 'Website' },
  { value: 'mobile', label: 'Mobile App' },
  { value: 'both', label: 'Website + Mobile' },
] as const;

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? '';

export default async function DemosPage({ searchParams }: { searchParams: Promise<Params> }) {
  const params = await searchParams;
  const filters = {
    q: first(params.q).slice(0, 80),
    category: first(params.category),
    industry: first(params.industry),
    platform: PLATFORMS.some((p) => p.value === first(params.platform)) ? first(params.platform) : '',
    page: String(Math.max(1, Number.parseInt(first(params.page), 10) || 1)),
  };
  const query = (overrides: Record<string, string>) => {
    const next = new URLSearchParams();
    for (const [key, value] of Object.entries({ ...filters, ...overrides })) if (value && !(key === 'page' && value === '1')) next.set(key, value);
    return next.toString();
  };

  const data = await getDemoList(query({}));
  if (!data) throw new Error('Demo content is unavailable.');
  const href = (overrides: Record<string, string>) => `/demos${query(overrides) ? `?${query(overrides)}` : ''}`;
  const active = [
    filters.q && { label: `“${filters.q}”`, clear: href({ q: '', page: '1' }) },
    filters.category && { label: data.categories.find((c) => c.slug === filters.category)?.name ?? filters.category, clear: href({ category: '', page: '1' }) },
    filters.industry && { label: data.industries.find((i) => i.slug === filters.industry)?.name ?? filters.industry, clear: href({ industry: '', page: '1' }) },
    filters.platform && { label: PLATFORMS.find((p) => p.value === filters.platform)?.label ?? '', clear: href({ platform: '', page: '1' }) },
  ].filter((chip): chip is { label: string; clear: string } => Boolean(chip));
  const pageCount = Math.max(1, Math.ceil(data.total / data.pageSize));

  return (
    <>
      <PageHero eyebrow="Demos" title="Product concepts, ready to explore" description="Web and mobile experiences that show how we approach real business problems. Each is a showcase concept, not a client project.">
        <ButtonLink href="/contact">Start a Project</ButtonLink>
      </PageHero>

      <Section>
        <form action="/demos" method="get" role="search" aria-label="Filter demos" className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_auto]">
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
            <Input name="q" aria-label="Search demos" placeholder="Search demos…" defaultValue={filters.q} className="pl-10" maxLength={80} />
          </div>
          <Select name="category" aria-label="Category" defaultValue={filters.category}>
            <option value="">All categories</option>
            {data.categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </Select>
          <Select name="industry" aria-label="Industry" defaultValue={filters.industry}>
            <option value="">All industries</option>
            {data.industries.map((i) => (
              <option key={i.slug} value={i.slug}>{i.name}</option>
            ))}
          </Select>
          <Select name="platform" aria-label="Platform" defaultValue={filters.platform}>
            <option value="">All platforms</option>
            {PLATFORMS.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </Select>
          <Button type="submit">Apply</Button>
        </form>

        {active.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2" aria-label="Active filters">
            {active.map((chip) => (
              <Link key={chip.label} href={chip.clear} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-sm hover:border-primary/40">
                {chip.label} <X className="size-3.5 text-muted" aria-label="Remove filter" />
              </Link>
            ))}
            <Link href="/demos" className="text-sm font-medium text-primary">Clear all</Link>
          </div>
        )}

        {data.featured.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-5 text-xl font-semibold">Featured</h2>
            <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {data.featured.map((demo) => (
                <li key={demo.slug}>
                  <DemoCard demo={demo} priority />
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-12">
          <h2 className="mb-5 text-xl font-semibold">
            {active.length > 0 ? 'Results' : 'All demos'} <span className="text-base font-normal text-muted">({data.total})</span>
          </h2>
          {data.items.length === 0 ? (
            <EmptyState title="No demos match" description="Try a different search or clear the filters." action={<ButtonLink href="/demos" variant="secondary">Clear filters</ButtonLink>} />
          ) : (
            <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {data.items.map((demo) => (
                <li key={demo.slug}>
                  <DemoCard demo={demo} />
                </li>
              ))}
            </ul>
          )}
        </div>

        {pageCount > 1 && (
          <nav aria-label="Pagination" className="mt-10 flex items-center justify-between text-sm">
            <span className="text-muted">Page {data.page} of {pageCount}</span>
            <div className="flex gap-2">
              {data.page > 1 && <ButtonLink href={href({ page: String(data.page - 1) })} variant="secondary" size="sm">Previous</ButtonLink>}
              {data.page < pageCount && <ButtonLink href={href({ page: String(data.page + 1) })} variant="secondary" size="sm">Next</ButtonLink>}
            </div>
          </nav>
        )}
      </Section>
    </>
  );
}
