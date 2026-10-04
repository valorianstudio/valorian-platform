'use client';

import { useId, useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import { SmartImage } from '@/components/ui/smart-image';
import { cn } from '@/lib/cn';
import { TECH_CATEGORIES } from '@/lib/tech-catalog';
import type { ShowcaseTech, TechCategoryId } from '@/lib/tech-catalog';

const INITIAL_COUNT = 12;
const categoryLabel = Object.fromEntries(TECH_CATEGORIES.map((category) => [category.id, category.label])) as Record<TechCategoryId, string>;

function monogram(name: string): string {
  const parts = name.replace(/[^A-Za-z0-9 .+#]/g, '').split(/[\s.]+/).filter(Boolean);
  return (parts.length > 1 ? parts[0][0] + parts[1][0] : name.slice(0, 2)).toUpperCase();
}

function TechCard({ tech }: { tech: ShowcaseTech }) {
  return (
    <li className="card-lift group flex h-full flex-col p-5 sm:p-6">
      <div className="flex items-center gap-3.5">
        {tech.logoUrl && /^https?:/i.test(tech.logoUrl) ? (
          <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-border bg-background">
            <SmartImage src={tech.logoUrl} alt="" width={28} height={28} sizes="28px" retry={false} className="size-7 object-contain" />
          </span>
        ) : (
          <span aria-hidden className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-colors duration-300 group-hover:bg-accent">
            {monogram(tech.name)}
          </span>
        )}
        <div className="min-w-0">
          <h3 className="display truncate text-lg text-primary">{tech.name}</h3>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">{categoryLabel[tech.category]}</p>
        </div>
      </div>
      <p className="mt-4 flex-1 text-sm leading-relaxed text-muted">{tech.summary}</p>
      <p className="mt-5 inline-flex w-fit items-center rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-primary">{tech.bestFor}</p>
    </li>
  );
}

/**
 * Searchable, filterable technology ecosystem. Everything is rendered on the client from props, so filtering is instant
 * and needs no network. Without JavaScript the first batch of cards is still present in the server-rendered HTML.
 */
export function TechShowcase({ technologies }: { technologies: ShowcaseTech[] }) {
  const [category, setCategory] = useState<TechCategoryId | 'all'>('all');
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState(false);
  const searchId = useId();

  const counts = useMemo(() => {
    const result: Partial<Record<TechCategoryId, number>> = {};
    for (const tech of technologies) result[tech.category] = (result[tech.category] ?? 0) + 1;
    return result;
  }, [technologies]);
  const categories = TECH_CATEGORIES.filter((item) => counts[item.id]);

  const needle = query.trim().toLowerCase();
  const matches = useMemo(
    () =>
      technologies.filter((tech) => {
        // A search looks across every category, so a visitor never has to guess where something lives.
        if (!needle && category !== 'all' && tech.category !== category) return false;
        if (!needle) return true;
        const haystack = [tech.name, tech.summary, tech.bestFor, categoryLabel[tech.category], ...(tech.keywords ?? [])].join(' ').toLowerCase();
        return haystack.includes(needle);
      }),
    [technologies, category, needle],
  );
  const limited = category === 'all' && !needle && !expanded;
  const visible = limited ? matches.slice(0, INITIAL_COUNT) : matches;
  const activeInfo = TECH_CATEGORIES.find((item) => item.id === category);

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label="Filter by category" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
          {[{ id: 'all' as const, label: 'All', count: technologies.length }, ...categories.map((item) => ({ id: item.id, label: item.label, count: counts[item.id] ?? 0 }))].map((item) => {
            const selected = !needle && category === item.id;
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={selected}
                onClick={() => {
                  setCategory(item.id);
                  setQuery('');
                }}
                className={cn(
                  'inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors duration-200',
                  selected ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-primary hover:border-border-strong',
                )}
              >
                {item.label}
                <span className={cn('rounded-full px-1.5 text-xs', selected ? 'bg-white/20' : 'bg-surface-strong text-muted')}>{item.count}</span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full lg:max-w-xs">
          <label htmlFor={searchId} className="sr-only">
            Search technologies
          </label>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search e.g. Python, mobile, cache…"
            maxLength={60}
            className="h-11 w-full rounded-full border border-border bg-card pl-10 pr-10 text-sm text-foreground placeholder:text-muted/70 focus-visible:border-primary"
          />
          {query && (
            <button type="button" aria-label="Clear search" onClick={() => setQuery('')} className="absolute right-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-muted hover:bg-surface-strong hover:text-primary">
              <X className="size-4" aria-hidden />
            </button>
          )}
        </div>
      </div>

      <p className="mt-5 min-h-6 text-sm text-muted" role="status" aria-live="polite">
        {needle ? `${matches.length} ${matches.length === 1 ? 'result' : 'results'} for “${query.trim()}”` : (activeInfo?.blurb ?? 'A proven toolkit across the full product lifecycle. We choose the right tool for the job, not the trendiest.')}
      </p>

      {visible.length > 0 ? (
        <ul key={`${category}-${needle}`} className="mt-5 grid animate-fade-in grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((tech) => (
            <TechCard key={tech.slug} tech={tech} />
          ))}
        </ul>
      ) : (
        <div className="mt-5 rounded-2xl border border-dashed border-border-strong bg-card/60 px-6 py-14 text-center">
          <p className="font-semibold text-primary">No technologies match &ldquo;{query.trim()}&rdquo;</p>
          <p className="mt-1 text-sm text-muted">We work beyond this list too. Tell us what you need and we will advise.</p>
          <button type="button" onClick={() => setQuery('')} className="mt-4 text-sm font-semibold text-primary underline underline-offset-4">
            Clear search
          </button>
        </div>
      )}

      {limited && matches.length > INITIAL_COUNT && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="inline-flex h-11 items-center rounded-full border border-[rgb(52_70_72/0.25)] bg-card/60 px-6 text-sm font-semibold text-primary transition-colors hover:border-primary hover:bg-card"
          >
            Show all {matches.length} technologies
          </button>
        </div>
      )}
    </div>
  );
}
