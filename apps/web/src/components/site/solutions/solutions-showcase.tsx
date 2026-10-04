'use client';

import { useId, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Search, X } from 'lucide-react';
import { ButtonLink } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import { getIcon } from '@/lib/icons';
import { SOLUTIONS, SOLUTION_CATEGORIES, solutionsIn } from '@/lib/solutions-catalog';
import type { SolutionCategoryId } from '@/lib/solutions-catalog';
import { SolutionCard } from './solution-card';

interface Props {
  initialCategory?: SolutionCategoryId;
  /** Cards shown per category before "Show all". Omit to show everything (the /demos page). */
  limit?: number;
  /** Show the search box and industry filter (the /demos page). */
  filters?: boolean;
}

/** Three-category showcase of everything Valorian Studio builds. All data is local, so tab changes and filtering are instant. */
export function SolutionsShowcase({ initialCategory = 'full-stack', limit, filters = false }: Props) {
  const [category, setCategory] = useState<SolutionCategoryId>(initialCategory);
  const [query, setQuery] = useState('');
  const [industry, setIndustry] = useState('');
  const base = useId();
  const searchId = `${base}-search`;
  const info = SOLUTION_CATEGORIES.find((item) => item.id === category) ?? SOLUTION_CATEGORIES[0];
  const InfoIcon = getIcon(info.icon);

  const industries = useMemo(() => [...new Set(solutionsIn(category).map((solution) => solution.industry))].sort(), [category]);
  const needle = query.trim().toLowerCase();
  const matches = useMemo(
    () =>
      solutionsIn(category).filter((solution) => {
        if (industry && solution.industry !== industry) return false;
        if (!needle) return true;
        return [solution.title, solution.industry, solution.description, ...solution.features, ...solution.technologies].join(' ').toLowerCase().includes(needle);
      }),
    [category, industry, needle],
  );
  const filtering = Boolean(needle || industry);
  const capped = limit !== undefined && !filtering;
  const visible = capped ? matches.slice(0, limit) : matches;

  const choose = (next: SolutionCategoryId) => {
    setCategory(next);
    setIndustry('');
  };

  return (
    <div>
      <div role="tablist" aria-label="Solution categories" className="grid gap-3 md:grid-cols-3">
        {SOLUTION_CATEGORIES.map((item) => {
          const Icon = getIcon(item.icon);
          const selected = item.id === category;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`${base}-tab-${item.id}`}
              aria-selected={selected}
              aria-controls={`${base}-panel`}
              onClick={() => choose(item.id)}
              onKeyDown={(event) => {
                if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
                const index = SOLUTION_CATEGORIES.findIndex((entry) => entry.id === item.id);
                const next = SOLUTION_CATEGORIES[(index + (event.key === 'ArrowRight' ? 1 : SOLUTION_CATEGORIES.length - 1)) % SOLUTION_CATEGORIES.length];
                choose(next.id);
                document.getElementById(`${base}-tab-${next.id}`)?.focus();
              }}
              tabIndex={selected ? 0 : -1}
              className={cn(
                'group flex items-center gap-4 rounded-2xl border p-4 text-left transition-[background-color,border-color,box-shadow,transform] duration-200 sm:p-5',
                selected ? 'border-primary bg-primary text-primary-foreground shadow-[var(--shadow-lift)]' : 'border-border bg-card hover:-translate-y-0.5 hover:border-border-strong hover:shadow-[var(--shadow-card)]',
              )}
            >
              <span className={cn('grid size-11 shrink-0 place-items-center rounded-xl transition-colors', selected ? 'bg-coral text-primary' : 'bg-accent-soft text-primary')}>
                <Icon className="size-5" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="display block text-base sm:text-lg">{item.short}</span>
                <span className={cn('block text-sm', selected ? 'text-white/75' : 'text-muted')}>
                  {item.tagline} · {solutionsIn(item.id).length} solutions
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div id={`${base}-panel`} role="tabpanel" aria-labelledby={`${base}-tab-${category}`} className="mt-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h3 className="display flex items-center gap-3 text-2xl text-primary sm:text-3xl">
              <InfoIcon className="size-6 text-accent" aria-hidden />
              {info.label}
            </h3>
            <p className="mt-3 text-pretty text-muted">{info.description}</p>
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="Best for">
              {info.bestFor.map((item) => (
                <li key={item} className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-primary">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {filters && (
            <div className="grid w-full gap-3 sm:grid-cols-[1fr_auto] lg:max-w-xl">
              <div className="relative">
                <label htmlFor={searchId} className="sr-only">
                  Search solutions
                </label>
                <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
                <input
                  id={searchId}
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search solutions…"
                  maxLength={60}
                  className="h-11 w-full rounded-full border border-border bg-card pl-10 pr-10 text-sm text-foreground placeholder:text-muted/70 focus-visible:border-primary"
                />
                {query && (
                  <button type="button" aria-label="Clear search" onClick={() => setQuery('')} className="absolute right-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-muted hover:bg-surface-strong hover:text-primary">
                    <X className="size-4" aria-hidden />
                  </button>
                )}
              </div>
              <select aria-label="Industry" value={industry} onChange={(event) => setIndustry(event.target.value)} className="h-11 w-full rounded-full border border-border bg-card px-4 text-sm text-foreground focus-visible:border-primary sm:w-auto">
                <option value="">All industries</option>
                {industries.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <p className="sr-only" role="status" aria-live="polite">
          {matches.length} {matches.length === 1 ? 'solution' : 'solutions'} shown
        </p>

        {visible.length > 0 ? (
          <ul key={`${category}-${industry}-${needle}`} className="mt-8 grid animate-fade-in grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {visible.map((solution) => (
              <li key={solution.slug}>
                <SolutionCard solution={solution} variant={category} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-border-strong bg-card/60 px-6 py-14 text-center">
            <p className="font-semibold text-primary">No solutions match your filters</p>
            <p className="mt-1 text-sm text-muted">Do not see your industry? We build custom products for any business.</p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setIndustry('');
                }}
                className="text-sm font-semibold text-primary underline underline-offset-4"
              >
                Clear filters
              </button>
              <Link href="/contact" className="text-sm font-semibold text-primary underline underline-offset-4">
                Tell us what you need
              </Link>
            </div>
          </div>
        )}

        {capped && matches.length > (limit ?? 0) && (
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink href="/demos" variant="secondary">
              Browse all {SOLUTIONS.length} solutions <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
            </ButtonLink>
          </div>
        )}
      </div>
    </div>
  );
}
