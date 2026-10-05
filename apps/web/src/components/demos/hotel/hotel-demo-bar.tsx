import { DemoBar } from '@/components/demos/shared/demo-bar';
import { HOTEL_DEMO, HOTEL_EXPERIENCES, HOTEL_THEME } from '@/data/hotel/meta';
import type { HotelExperienceKey } from '@/data/hotel/meta';

/** Valorian's strip for the Hotel Management demo, wired to its routes. `active` is the page it sits on. */
export function HotelDemoBar({ active }: { active: HotelExperienceKey | 'overview' }) {
  return (
    <div style={HOTEL_THEME}>
      <DemoBar title={HOTEL_DEMO.title} slug={HOTEL_DEMO.slug} overviewHref={HOTEL_DEMO.basePath} experiences={HOTEL_EXPERIENCES} active={active} />
    </div>
  );
}
