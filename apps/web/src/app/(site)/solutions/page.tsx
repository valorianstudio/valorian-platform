import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CtaBand } from '@/components/site/blocks';
import { PageHero } from '@/components/site/page-hero';
import { Section } from '@/components/ui/section';
import { buildMetadata, findSection, getSolutions } from '@/lib/cms';
import type { CtaContent, PageHeroContent } from '@/lib/cms-types';
import { getIcon } from '@/lib/icons';

const FALLBACK = { title: 'Solutions', description: 'Industry-ready software solutions for education, healthcare, retail, hospitality and more.', path: '/solutions' };

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata((await getSolutions())?.seo, FALLBACK);
}

export default async function SolutionsPage() {
  const data = await getSolutions();
  if (!data) throw new Error('Solutions content is unavailable.');
  const hero = findSection<PageHeroContent>(data.sections, 'hero');
  const cta = findSection<CtaContent>(data.sections, 'cta');

  return (
    <>
      <PageHero eyebrow={hero?.eyebrow ?? 'Solutions'} title={hero?.title ?? 'Solutions'} description={hero?.description ?? FALLBACK.description} />
      <Section>
        {data.solutions.length === 0 ? (
          <p className="text-muted">Solutions will be listed here soon.</p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {data.solutions.map((solution) => {
              const Icon = getIcon(solution.icon);
              return (
                <li key={solution.slug}>
                  <Link
                    href={`/solutions/${solution.slug}`}
                    className="group flex h-full flex-col rounded-2xl border border-border bg-background p-6 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
                  >
                    <span className="grid size-11 place-items-center rounded-xl bg-accent-soft text-accent">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <h2 className="mt-5 text-lg font-semibold">{solution.name}</h2>
                    <p className="mt-2 flex-1 text-muted">{solution.shortDescription}</p>
                    <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary">
                      Explore <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </Section>
      {cta && <CtaBand content={cta} />}
    </>
  );
}
