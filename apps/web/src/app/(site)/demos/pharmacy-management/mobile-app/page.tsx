import type { Metadata } from 'next';
import { PharmacyDemoBar } from '@/components/demos/pharmacy/pharmacy-demo-bar';
import { LazyPharmacyMobileApp } from '@/components/demos/pharmacy/lazy';
import { DemoExperienceIntro } from '@/components/demos/shared/experience-intro';
import { Breadcrumbs } from '@/components/site/seo';
import { PHARMACY_DEMO, PHARMACY_EXPERIENCES, PHARMACY_THEME } from '@/data/pharmacy/meta';
import { buildMetadata } from '@/lib/cms';

const experience = PHARMACY_EXPERIENCES[2];

export function generateMetadata(): Promise<Metadata> {
  return buildMetadata(null, {
    title: 'Pharmacy Mobile App Demo',
    description: 'Tap through a pharmacy customer app and staff app: medicine search, prescription upload, basket, order tracking, reminders and staff prescription review.',
    path: experience.href,
  });
}

/** Mobile App showcase: an interactive phone with a customer app and a staff app. */
export default function PharmacyMobileAppPage() {
  return (
    <div style={PHARMACY_THEME}>
      <PharmacyDemoBar active="mobile-app" />
      <DemoExperienceIntro
        eyebrow="Mobile app design"
        title="Healthcare, from the first tap"
        description="A customer app and a staff app with bottom navigation, cards and smooth transitions. All data is dummy data."
        hint="Tap inside the phone, or pick a screen from the list. Search a medicine, add it to the basket, then switch to the staff app to verify a prescription."
      >
        <div className="sr-only">
          <Breadcrumbs items={[{ name: 'Demos', href: '/demos' }, { name: PHARMACY_DEMO.title, href: PHARMACY_DEMO.basePath }, { name: experience.label }]} />
        </div>
        <LazyPharmacyMobileApp />
      </DemoExperienceIntro>
    </div>
  );
}
