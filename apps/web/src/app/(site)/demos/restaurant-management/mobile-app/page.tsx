import type { Metadata } from 'next';
import { DemoInterest } from '@/components/demos/shared/demo-interest';
import { LazyRestaurantMobileApp } from '@/components/demos/restaurant/lazy';
import { RestaurantDemoBar } from '@/components/demos/restaurant/restaurant-demo-bar';
import { DemoExperienceIntro } from '@/components/demos/shared/experience-intro';
import { Breadcrumbs } from '@/components/site/seo';
import { RESTAURANT_DEMO, RESTAURANT_EXPERIENCES, RESTAURANT_THEME } from '@/data/restaurant/meta';
import { buildMetadata } from '@/lib/cms';

const experience = RESTAURANT_EXPERIENCES[2];

export function generateMetadata(): Promise<Metadata> {
  return buildMetadata(null, {
    title: 'Restaurant Management Mobile App Demo',
    description: 'Tap through realistic guest and staff mobile app screens: menu, food details, cart, order tracking, kitchen queue and table status.',
    path: experience.href,
  });
}

/** Mobile App showcase: an interactive phone with a guest app and a staff app. */
export default function RestaurantMobileAppPage() {
  return (
    <div style={RESTAURANT_THEME}>
      <RestaurantDemoBar active="mobile-app" />
      <DemoExperienceIntro
        eyebrow="Mobile app design"
        title="Dining, one tap away"
        description="A guest app and a staff app with bottom navigation, cards and smooth transitions. All data is dummy data."
        hint="Tap inside the phone, or pick a screen from the list. Add dishes to the cart, place the order, then switch to the staff app."
      >
        <div className="sr-only">
          <Breadcrumbs items={[{ name: 'Demos', href: '/demos' }, { name: RESTAURANT_DEMO.title, href: RESTAURANT_DEMO.basePath }, { name: experience.label }]} />
        </div>
        <LazyRestaurantMobileApp />
      </DemoExperienceIntro>
      <DemoInterest slug={RESTAURANT_DEMO.slug} title={RESTAURANT_DEMO.title} />
    </div>
  );
}
