import type { Metadata } from 'next';
import { DemoInterest } from '@/components/demos/shared/demo-interest';
import { PropertyDemoBar } from '@/components/demos/property/property-demo-bar';
import { LazyPropertyMobileApp } from '@/components/demos/property/lazy';
import { DemoExperienceIntro } from '@/components/demos/shared/experience-intro';
import { Breadcrumbs } from '@/components/site/seo';
import { PROPERTY_DEMO, PROPERTY_EXPERIENCES, PROPERTY_THEME } from '@/data/property/meta';
import { buildMetadata } from '@/lib/cms';

const experience = PROPERTY_EXPERIENCES[2];

export function generateMetadata(): Promise<Metadata> {
  return buildMetadata(null, {
    title: 'Property Resident Mobile App Demo',
    description: 'Tap through a resident app and manager app: rent payment, repair requests, visitor approval, announcements and the manager portfolio view.',
    path: experience.href,
  });
}

/** Mobile App showcase: an interactive phone with a resident app and a manager app. */
export default function PropertyMobileAppPage() {
  return (
    <div style={PROPERTY_THEME}>
      <PropertyDemoBar active="mobile-app" />
      <DemoExperienceIntro
        eyebrow="Mobile app design"
        title="Smart living, from the first tap"
        description="A resident app and a manager app with bottom navigation, cards and smooth transitions. All data is dummy data."
        hint="Tap inside the phone, or pick a screen from the list. Approve a visitor or send a repair, then switch to the manager app to resolve it."
      >
        <div className="sr-only">
          <Breadcrumbs items={[{ name: 'Demos', href: '/demos' }, { name: PROPERTY_DEMO.title, href: PROPERTY_DEMO.basePath }, { name: experience.label }]} />
        </div>
        <LazyPropertyMobileApp />
      </DemoExperienceIntro>
      <DemoInterest slug={PROPERTY_DEMO.slug} title={PROPERTY_DEMO.title} />
    </div>
  );
}
