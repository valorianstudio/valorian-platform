import { DemoBar } from '@/components/demos/shared/demo-bar';
import { DELIVERY_DEMO, DELIVERY_EXPERIENCES, DELIVERY_THEME } from '@/data/delivery/meta';
import type { DeliveryExperienceKey } from '@/data/delivery/meta';

/** Valorian's strip for the Bike Delivery demo, wired to its routes. `active` is the page it sits on. */
export function DeliveryDemoBar({ active }: { active: DeliveryExperienceKey | 'overview' }) {
  return (
    <div style={DELIVERY_THEME}>
      <DemoBar title={DELIVERY_DEMO.title} slug={DELIVERY_DEMO.slug} overviewHref={DELIVERY_DEMO.basePath} experiences={DELIVERY_EXPERIENCES} active={active} />
    </div>
  );
}
