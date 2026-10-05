import type { Metadata } from 'next';
import { DemoInterest } from '@/components/demos/shared/demo-interest';
import { PetshopDemoBar } from '@/components/demos/petshop/petshop-demo-bar';
import { LazyPetshopMobileApp } from '@/components/demos/petshop/lazy';
import { DemoExperienceIntro } from '@/components/demos/shared/experience-intro';
import { Breadcrumbs } from '@/components/site/seo';
import { PETSHOP_DEMO, PETSHOP_EXPERIENCES, PETSHOP_THEME } from '@/data/petshop/meta';
import { buildMetadata } from '@/lib/cms';

const experience = PETSHOP_EXPERIENCES[2];

export function generateMetadata(): Promise<Metadata> {
  return buildMetadata(null, {
    title: 'Pet Care Mobile App Demo',
    description: 'Tap through a pet care customer app and staff app: pet profiles, grooming and vet booking, shopping, order tracking and the staff day view.',
    path: experience.href,
  });
}

/** Mobile App showcase: an interactive phone with a customer app and a staff app. */
export default function PetShopMobileAppPage() {
  return (
    <div style={PETSHOP_THEME}>
      <PetshopDemoBar active="mobile-app" />
      <DemoExperienceIntro
        eyebrow="Mobile app design"
        title="Pet care, from the first tap"
        description="A customer app and a staff app with bottom navigation, cards and smooth transitions. All data is dummy data."
        hint="Tap inside the phone, or pick a screen from the list. Book a grooming visit, then switch to the staff app to check it in."
      >
        <div className="sr-only">
          <Breadcrumbs items={[{ name: 'Demos', href: '/demos' }, { name: PETSHOP_DEMO.title, href: PETSHOP_DEMO.basePath }, { name: experience.label }]} />
        </div>
        <LazyPetshopMobileApp />
      </DemoExperienceIntro>
      <DemoInterest slug={PETSHOP_DEMO.slug} title={PETSHOP_DEMO.title} />
    </div>
  );
}
