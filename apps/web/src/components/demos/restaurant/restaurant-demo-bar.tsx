import { DemoBar } from '@/components/demos/shared/demo-bar';
import { RESTAURANT_DEMO, RESTAURANT_EXPERIENCES, RESTAURANT_THEME } from '@/data/restaurant/meta';
import type { RestaurantExperienceKey } from '@/data/restaurant/meta';

/** Valorian's strip for the Restaurant Management demo, wired to its routes. `active` is the page it sits on. */
export function RestaurantDemoBar({ active }: { active: RestaurantExperienceKey | 'overview' }) {
  return (
    <div style={RESTAURANT_THEME}>
      <DemoBar title={RESTAURANT_DEMO.title} slug={RESTAURANT_DEMO.slug} overviewHref={RESTAURANT_DEMO.basePath} experiences={RESTAURANT_EXPERIENCES} active={active} />
    </div>
  );
}
