import type { Metadata } from 'next';
import { RestaurantLandingPage } from '@/components/demos/restaurant/restaurant-landing-page';
import { Breadcrumbs } from '@/components/site/seo';
import { RESTAURANT_DEMO, RESTAURANT_EXPERIENCES } from '@/data/restaurant/meta';
import { buildMetadata } from '@/lib/cms';

const experience = RESTAURANT_EXPERIENCES[0];

export function generateMetadata(): Promise<Metadata> {
  return buildMetadata(null, {
    title: 'Restaurant Management Landing Page Demo',
    description: 'A premium marketing website for restaurant management software: features, digital menu, team, testimonials, pricing and a demo request form.',
    path: experience.href,
  });
}

/** Landing Page showcase: the marketing site as a standalone full-page preview (see the (preview) layout). */
export default function RestaurantLandingPageRoute() {
  return (
    <>
      <div className="sr-only">
        <Breadcrumbs items={[{ name: 'Demos', href: '/demos' }, { name: RESTAURANT_DEMO.title, href: RESTAURANT_DEMO.basePath }, { name: experience.label }]} />
      </div>
      <RestaurantLandingPage />
    </>
  );
}
