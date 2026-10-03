import { ApiUnavailable } from '@/components/ui/api-unavailable';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { ArticleCardView, formatPublished } from '@/components/site/editorial';
import { PageHero } from '@/components/site/page-hero';
import { Breadcrumbs } from '@/components/site/seo';
import { Badge } from '@/components/ui/badge';
import { Button, ButtonLink } from '@/components/ui/button';
import { Input } from '@/components/ui/field';
import { Section } from '@/components/ui/section';
import { EmptyState } from '@/components/ui/states';
import { SmartImage } from '@/components/ui/smart-image';
import { buildMetadata, getInsights, getPageSeo } from '@/lib/cms';
import { cn } from '@/lib/cn';

type Params = Record<string, string | string[] | undefined>;
const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? '';

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata(await getPageSeo('INSIGHTS'), {
    title: 'Insights',
    description: 'Articles on software engineering, product development and AI from the Valorian Studio team.',
    path: '/insights',
  });
}

export default async function InsightsPage({ searchParams }: { searchParams: Promise<Params> }) {
  const params = await searchParams;
  const filters = { q: first(params.q).slice(0, 80), category: first(params.category).slice(0, 80), tag: first(params.tag).slice(0, 80), page: String(Math.max(1, Number.parseInt(first(params.page), 10) || 1)) };
  const build = (overrides: Record<string, string>) => {
    const next = new URLSearchParams();
    for (const [key, value] of Object.entries({ ...filters, ...overrides })) if (value && !(key === 'page' && value === '1')) next.set(key, value);
    return next.toString();
  };
  const data = await getInsights(build({}));
  if (!data) return <ApiUnavailable what="Insights" />;
  const href = (overrides: Record<string, string>) => `/insights${build(overrides) ? `?${build(overrides)}` : ''}`;
  const pageCount = Math.max(1, Math.ceil(data.total / data.pageSize));
  const filtered = Boolean(filters.q || filters.category || filters.tag);

  return (
    <>
      <PageHero eyebrow="Insights" title="Thinking on software, product and AI" description="Practical articles from the people who build the software." />
      <Section>
        <Breadcrumbs items={[{ name: 'Insights' }]} />
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {data.categories.length > 0 && (
            <nav aria-label="Filter by category" className="flex flex-wrap gap-2">
              {[{ slug: '', name: 'All' }, ...data.categories].map((c) => (
                <Link key={c.slug} href={href({ category: c.slug, tag: '', page: '1' })} aria-current={filters.category === c.slug ? 'true' : undefined} className={cn('rounded-full border px-3.5 py-1.5 text-sm transition-colors', filters.category === c.slug ? 'border-primary bg-primary-soft text-primary' : 'border-border text-muted hover:text-foreground')}>
                  {c.name}
                </Link>
              ))}
            </nav>
          )}
          <form action="/insights" method="get" role="search" className="flex gap-2 lg:w-96">
            {filters.category && <input type="hidden" name="category" value={filters.category} />}
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
              <Input name="q" aria-label="Search insights" placeholder="Search insights…" defaultValue={filters.q} className="pl-10" maxLength={80} />
            </div>
            <Button type="submit" variant="secondary">Search</Button>
          </form>
        </div>

        {filters.tag && (
          <p className="mb-6 text-sm text-muted">
            Tagged <Badge>#{filters.tag}</Badge> · <Link href={href({ tag: '', page: '1' })} className="text-primary">Clear</Link>
          </p>
        )}

        {data.featured && !filtered && (
          <Link href={`/insights/${data.featured.slug}`} className="group mb-10 grid grid-cols-1 overflow-hidden rounded-2xl border border-border bg-background transition-[border-color,box-shadow] hover:border-primary/40 hover:shadow-lg md:grid-cols-2">
            <div className="aspect-[16/9] bg-primary-soft md:aspect-auto">
              {data.featured.featuredImageUrl && <SmartImage src={data.featured.featuredImageUrl} alt={data.featured.featuredImageAlt ?? data.featured.title} width={800} height={450} sizes="(min-width: 768px) 50vw, 100vw" priority className="size-full object-cover" />}
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-10">
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
                <Badge tone="accent">Featured</Badge>
                {data.featured.category && <span>{data.featured.category.name}</span>}
                {data.featured.publishedAt && <time dateTime={data.featured.publishedAt}>{formatPublished(data.featured.publishedAt)}</time>}
              </div>
              <h2 className="mt-4 text-balance text-2xl font-semibold tracking-tight sm:text-3xl">{data.featured.title}</h2>
              <p className="mt-3 line-clamp-3 text-muted">{data.featured.excerpt}</p>
              <span className="mt-6 text-sm font-medium text-primary">Read article</span>
            </div>
          </Link>
        )}

        {data.items.length === 0 ? (
          <EmptyState
            title={filtered ? 'No articles found' : 'Insights are coming soon'}
            description={filtered ? 'Try a different search or category.' : 'We are writing our first articles. Check back soon.'}
            action={filtered ? <ButtonLink href="/insights" variant="secondary">Clear filters</ButtonLink> : undefined}
          />
        ) : (
          <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {data.items.map((item) => (
              <li key={item.slug}>
                <ArticleCardView item={item} />
              </li>
            ))}
          </ul>
        )}

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
