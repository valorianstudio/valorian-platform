import type { Metadata } from 'next';
import Link from 'next/link';
import { CaseCardView } from '@/components/site/editorial';
import { PageHero } from '@/components/site/page-hero';
import { Breadcrumbs } from '@/components/site/seo';
import { ButtonLink } from '@/components/ui/button';
import { Section } from '@/components/ui/section';
import { EmptyState } from '@/components/ui/states';
import { buildMetadata, getCaseStudies, getPageSeo } from '@/lib/cms';
import { cn } from '@/lib/cn';

type Params = Record<string, string | string[] | undefined>;
const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? '';

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata(await getPageSeo('CASE_STUDIES'), {
    title: 'Case Studies',
    description: 'Real projects delivered by Valorian Studio, from the challenge to the result.',
    path: '/case-studies',
  });
}

export default async function CaseStudiesPage({ searchParams }: { searchParams: Promise<Params> }) {
  const params = await searchParams;
  const industry = first(params.industry).slice(0, 80);
  const page = Math.max(1, Number.parseInt(first(params.page), 10) || 1);
  const query = new URLSearchParams();
  if (industry) query.set('industry', industry);
  if (page > 1) query.set('page', String(page));

  const data = await getCaseStudies(query.toString());
  if (!data) throw new Error('Case studies are unavailable.');
  const pageCount = Math.max(1, Math.ceil(data.total / data.pageSize));
  const href = (overrides: Record<string, string>) => {
    const next = new URLSearchParams();
    for (const [key, value] of Object.entries({ industry, page: String(page), ...overrides })) if (value && !(key === 'page' && value === '1')) next.set(key, value);
    return `/case-studies${next.size ? `?${next}` : ''}`;
  };

  return (
    <>
      <PageHero eyebrow="Case studies" title="Work we have delivered" description="Real projects, the problems behind them and what changed. Every case study is shared with the client's approval." />
      <Section>
        <Breadcrumbs items={[{ name: 'Case studies' }]} />
        {data.industries.length > 1 && (
          <nav aria-label="Filter by industry" className="mb-8 flex flex-wrap gap-2">
            {[{ slug: '', name: 'All' }, ...data.industries].map((item) => (
              <Link
                key={item.slug}
                href={href({ industry: item.slug, page: '1' })}
                aria-current={industry === item.slug ? 'true' : undefined}
                className={cn('rounded-full border px-3.5 py-1.5 text-sm transition-colors', industry === item.slug ? 'border-primary bg-primary-soft text-primary' : 'border-border text-muted hover:text-foreground')}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        )}
        {data.items.length === 0 ? (
          <EmptyState
            title={industry ? 'No case studies in this industry' : 'Case studies are coming soon'}
            description={industry ? 'Try another industry.' : 'We are preparing write-ups of our client work. In the meantime, explore our product demos.'}
            action={<ButtonLink href={industry ? '/case-studies' : '/demos'} variant="secondary">{industry ? 'Show all' : 'Explore demos'}</ButtonLink>}
          />
        ) : (
          <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {data.items.map((item) => (
              <li key={item.slug}>
                <CaseCardView item={item} />
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
