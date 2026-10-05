import type { Metadata } from 'next';
import { DemoInterest } from '@/components/demos/shared/demo-interest';
import { DeliveryDemoBar } from '@/components/demos/delivery/delivery-demo-bar';
import { LazyDeliveryMobileApp } from '@/components/demos/delivery/lazy';
import { DemoExperienceIntro } from '@/components/demos/shared/experience-intro';
import { Breadcrumbs } from '@/components/site/seo';
import { DELIVERY_DEMO, DELIVERY_EXPERIENCES, DELIVERY_THEME } from '@/data/delivery/meta';
import { buildMetadata } from '@/lib/cms';

const experience = DELIVERY_EXPERIENCES[2];

export function generateMetadata(): Promise<Metadata> {
  return buildMetadata(null, {
    title: 'Delivery Rider Mobile App Demo',
    description: 'Tap through a delivery customer app and rider app: booking, address selection, live tracking, payment, history and rider navigation.',
    path: experience.href,
  });
}

/** Mobile App showcase: an interactive phone with a customer app and a rider app. */
export default function BikeDeliveryMobileAppPage() {
  return (
    <div style={DELIVERY_THEME}>
      <DeliveryDemoBar active="mobile-app" />
      <DemoExperienceIntro
        eyebrow="Mobile app design"
        title="Delivered, from the first tap"
        description="A customer app and a rider app with bottom navigation, cards and smooth transitions. All data is dummy data."
        hint="Tap inside the phone, or pick a screen from the list. Book a delivery, pay, then switch to the rider app and accept it."
      >
        <div className="sr-only">
          <Breadcrumbs items={[{ name: 'Demos', href: '/demos' }, { name: DELIVERY_DEMO.title, href: DELIVERY_DEMO.basePath }, { name: experience.label }]} />
        </div>
        <LazyDeliveryMobileApp />
      </DemoExperienceIntro>
      <DemoInterest slug={DELIVERY_DEMO.slug} title={DELIVERY_DEMO.title} />
    </div>
  );
}
