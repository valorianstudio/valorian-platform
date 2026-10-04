import { TECH_CATALOG, TECH_CATEGORIES } from '@/data/technologies';

function monogram(name: string): string {
  const parts = name.replace(/[^A-Za-z0-9 .+#]/g, '').split(/[\s.]+/).filter(Boolean);
  return (parts.length > 1 ? parts[0][0] + parts[1][0] : name.slice(0, 2)).toUpperCase();
}

const categoryLabel = Object.fromEntries(TECH_CATEGORIES.map((category) => [category.id, category.label]));

/**
 * Technology ecosystem. A server component with no client JavaScript and no API call: the categories are a native radio group
 * and `.tech-tabs` in globals.css shows the cards of the checked one. All cards are in the HTML, so the content is crawlable.
 */
export function TechShowcase() {
  return (
    <div className="tech-tabs">
      <fieldset className="-mx-5 flex min-w-0 gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
        <legend className="sr-only">Technology category</legend>
        {TECH_CATEGORIES.map((category) => (
          <label
            key={category.id}
            className="relative inline-flex h-10 shrink-0 cursor-pointer items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-semibold text-primary transition-colors duration-200 hover:border-border-strong has-checked:border-primary has-checked:bg-primary has-checked:text-primary-foreground has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-primary"
          >
            <input type="radio" name="tech-category" value={category.id} defaultChecked={category.id === 'frontend'} className="sr-only" />
            {category.label}
          </label>
        ))}
        <label className="relative inline-flex h-10 shrink-0 cursor-pointer items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-semibold text-primary transition-colors duration-200 hover:border-border-strong has-checked:border-primary has-checked:bg-primary has-checked:text-primary-foreground has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-primary">
          <input type="radio" name="tech-category" value="all" className="sr-only" />
          All ({TECH_CATALOG.length})
        </label>
      </fieldset>

      <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {TECH_CATALOG.map((tech) => (
          <li key={tech.slug} data-cat={tech.category} className="card-lift group flex flex-col p-5 sm:p-6">
            <div className="flex items-center gap-3.5">
              <span aria-hidden className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-colors duration-300 group-hover:bg-accent">
                {monogram(tech.name)}
              </span>
              <div className="min-w-0">
                <h3 className="display truncate text-lg text-primary">{tech.name}</h3>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">{categoryLabel[tech.category]}</p>
              </div>
            </div>
            <p className="mt-4 flex-1 text-sm leading-relaxed text-muted">{tech.summary}</p>
            <p className="mt-5 inline-flex w-fit items-center rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-primary">{tech.bestFor}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
