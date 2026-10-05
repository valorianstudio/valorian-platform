import type { Metadata } from 'next';
import { DemoInterest } from '@/components/demos/shared/demo-interest';
import { LazyRestaurantDashboard } from '@/components/demos/restaurant/lazy';
import { RestaurantDemoBar } from '@/components/demos/restaurant/restaurant-demo-bar';
import { DemoExperienceIntro } from '@/components/demos/shared/experience-intro';
import { Breadcrumbs } from '@/components/site/seo';
import { RESTAURANT_DEMO, RESTAURANT_EXPERIENCES, RESTAURANT_THEME } from '@/data/restaurant/meta';
import { buildMetadata } from '@/lib/cms';

const experience = RESTAURANT_EXPERIENCES[1];

export function generateMetadata(): Promise<Metadata> {
  return buildMetadata(null, {
    title: 'Restaurant Management Dashboard Demo',
    description: 'Explore a restaurant management dashboard: orders, menu, tables, reservations, customers, inventory, staff and reports. Designed by Valorian Studio.',
    path: experience.href,
  });
}

/** Website showcase: the working platform. The interactive shell is a lazily loaded client component. */
export default function RestaurantWebsitePage() {
  return (
    <div style={RESTAURANT_THEME}>
      <RestaurantDemoBar active="website" />
      <DemoExperienceIntro
        eyebrow="Full website design"
        title="The restaurant platform, for every role"
        description="Orders, menu, tables, reservations, customers, stock and staff in one clean interface. All data is dummy data."
        hint='Use "View as" in the top bar to switch between Manager and Waiter. Try seating a table or starting an order.'
      >
        <div className="sr-only">
          <Breadcrumbs items={[{ name: 'Demos', href: '/demos' }, { name: RESTAURANT_DEMO.title, href: RESTAURANT_DEMO.basePath }, { name: experience.label }]} />
        </div>
        <LazyRestaurantDashboard />
      </DemoExperienceIntro>
      <DemoInterest slug={RESTAURANT_DEMO.slug} title={RESTAURANT_DEMO.title} />
    </div>
  );
}
