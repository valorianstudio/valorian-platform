import type { Metadata } from 'next';
import { DemoInterest } from '@/components/demos/shared/demo-interest';
import { DeliveryDemoBar } from '@/components/demos/delivery/delivery-demo-bar';
import { LazyDeliveryDashboard } from '@/components/demos/delivery/lazy';
import { DemoExperienceIntro } from '@/components/demos/shared/experience-intro';
import { Breadcrumbs } from '@/components/site/seo';
import { DELIVERY_DEMO, DELIVERY_EXPERIENCES, DELIVERY_THEME } from '@/data/delivery/meta';
import { buildMetadata } from '@/lib/cms';

const experience = DELIVERY_EXPERIENCES[1];

export function generateMetadata(): Promise<Metadata> {
  return buildMetadata(null, {
    title: 'Delivery Management Dashboard Demo',
    description: 'Explore a logistics dashboard: orders, riders, live tracking, routes, customers, payments and analytics. Designed by Valorian Studio.',
    path: experience.href,
  });
}

/** Website showcase: the working dispatch platform. The interactive shell is a lazily loaded client component. */
export default function BikeDeliveryWebsitePage() {
  return (
    <div style={DELIVERY_THEME}>
      <DeliveryDemoBar active="website" />
      <DemoExperienceIntro
        eyebrow="Delivery dashboard design"
        title="Every delivery, rider and route in view"
        description="Dispatch orders, follow riders on the map and track payments in one calm interface. All data is dummy data."
        hint='Use "View as" in the top bar to switch between Dispatcher and Fleet manager. Try marking an order on the way.'
      >
        <div className="sr-only">
          <Breadcrumbs items={[{ name: 'Demos', href: '/demos' }, { name: DELIVERY_DEMO.title, href: DELIVERY_DEMO.basePath }, { name: experience.label }]} />
        </div>
        <LazyDeliveryDashboard />
      </DemoExperienceIntro>
      <DemoInterest slug={DELIVERY_DEMO.slug} title={DELIVERY_DEMO.title} />
    </div>
  );
}
