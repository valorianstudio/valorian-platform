import { ArrowUpRight } from 'lucide-react';
import { ButtonLink } from '@/components/ui/button';
import { DEMOS, DEMO_CATEGORIES, demosIn } from '@/data/demos';
import type { DemoCategoryId } from '@/data/demos';
import { getIcon } from '@/lib/icons';
import { DemoCard } from './demo-card';

/**
 * The one demo showcase (home page and /demos). It is a server component with no client JavaScript.
 *
 * - The three categories are a native radio group styled as tabs; `.demo-tabs` in globals.css hides every card whose
 *   `data-tabs` does not include the checked category. Each demo is in the HTML exactly once, however many tabs it belongs to,
 *   so the page stays small, every demo is crawlable, and the tabs work before (and without) hydration.
 * - `limit` caps the cards per category (home page); the cap decides which tabs a card is rendered for.
 */
export function DemoShowcase({ limit, defaultCategory = 'full-stack' }: { limit?: number; defaultCategory?: DemoCategoryId }) {
  const tabsFor = new Map<string, DemoCategoryId[]>();
  for (const category of DEMO_CATEGORIES) {
    const list = demosIn(category.id);
    for (const demo of limit ? list.slice(0, limit) : list) tabsFor.set(demo.slug, [...(tabsFor.get(demo.slug) ?? []), category.id]);
  }
  const shown = DEMOS.filter((demo) => tabsFor.has(demo.slug));
  const capped = shown.length < DEMOS.length || (limit !== undefined && DEMO_CATEGORIES.some((category) => demosIn(category.id).length > limit));

  return (
    <div className="demo-tabs">
      <fieldset className="grid min-w-0 gap-3 md:grid-cols-3">
        <legend className="sr-only">Solution category</legend>
        {DEMO_CATEGORIES.map((category) => {
          const Icon = getIcon(category.icon);
          return (
            <label
              key={category.id}
              className="group relative flex cursor-pointer items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-[background-color,border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-border-strong has-checked:border-primary has-checked:bg-primary has-checked:text-primary-foreground has-checked:shadow-[var(--shadow-lift)] has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-primary sm:p-5"
            >
              <input type="radio" name="demo-category" value={category.id} defaultChecked={category.id === defaultCategory} className="sr-only" />
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent-soft text-primary transition-colors group-has-checked:bg-coral">
                <Icon className="size-5" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="display block text-base sm:text-lg">{category.short}</span>
                <span className="block text-sm text-muted group-has-checked:text-white/75">
                  {category.tagline} · {demosIn(category.id).length} demos
                </span>
              </span>
            </label>
          );
        })}
      </fieldset>

      <div className="mt-8" aria-live="polite">
        {DEMO_CATEGORIES.map((category) => (
          <div key={category.id} data-tabs={category.id}>
            <h3 className="display text-2xl text-primary sm:text-3xl">{category.label}</h3>
            <p className="mt-3 max-w-2xl text-pretty text-muted">{category.description}</p>
          </div>
        ))}
      </div>

      <ul className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {shown.map((demo) => (
          <li key={demo.slug} data-tabs={tabsFor.get(demo.slug)?.join(' ')}>
            <DemoCard demo={demo} />
          </li>
        ))}
      </ul>

      {capped && (
        <div className="mt-8">
          <ButtonLink href="/demos" variant="secondary">
            Browse all {DEMOS.length} demos <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
          </ButtonLink>
        </div>
      )}
    </div>
  );
}
