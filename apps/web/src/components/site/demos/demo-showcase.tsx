import { ArrowUpRight } from 'lucide-react';
import { ButtonLink } from '@/components/ui/button';
import { DEMO_SECTORS, SHOWCASE_DEMOS, demoAvailability } from '@/data/demos';
import type { Demo, DemoPlatform } from '@/data/demos';
import { DemoCard } from './demo-card';
import { DemoBrowser } from './demo-browser';

function platformsOf(demo: Demo): DemoPlatform[] {
  const a = demoAvailability(demo);
  return [a.hasLandingPage && 'Landing Page', a.hasWebsite && 'Website', a.hasMobileApp && 'Mobile App'].filter(Boolean) as DemoPlatform[];
}

/**
 * The one demo showcase (home page and /demos). Only finished demos are listed (see isShowcased in data/demos.ts). Each card is
 * rendered here on the server, and the client filter only decides which of them are visible, so the page stays crawlable and the
 * client code is one small component.
 */
export function DemoShowcase({ limit }: { limit?: number }) {
  const demos = limit ? SHOWCASE_DEMOS.slice(0, limit) : SHOWCASE_DEMOS;
  const items = demos.map((demo) => ({ slug: demo.slug, sector: demo.sector ?? demo.industry, platforms: platformsOf(demo) }));
  const cards = Object.fromEntries(demos.map((demo) => [demo.slug, <DemoCard key={demo.slug} demo={demo} />]));

  return (
    <div>
      <DemoBrowser items={items} cards={cards} sectors={DEMO_SECTORS} total={demos.length} />
      {limit !== undefined && SHOWCASE_DEMOS.length > limit && (
        <div className="mt-8">
          <ButtonLink href="/demos" variant="secondary">
            Browse all {SHOWCASE_DEMOS.length} demos <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
          </ButtonLink>
        </div>
      )}
    </div>
  );
}
