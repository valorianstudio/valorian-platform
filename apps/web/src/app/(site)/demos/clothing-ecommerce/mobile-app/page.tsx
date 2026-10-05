import type { Metadata } from 'next';
import { ClothingDemoBar } from '@/components/demos/clothing/clothing-demo-bar';
import { LazyClothingMobileApp } from '@/components/demos/clothing/lazy';
import { DemoExperienceIntro } from '@/components/demos/shared/experience-intro';
import { Breadcrumbs } from '@/components/site/seo';
import { CLOTHING_DEMO, CLOTHING_EXPERIENCES, CLOTHING_THEME } from '@/data/clothing/meta';
import { buildMetadata } from '@/lib/cms';

const experience = CLOTHING_EXPERIENCES[2];

export function generateMetadata(): Promise<Metadata> {
  return buildMetadata(null, {
    title: 'Clothing E-commerce Mobile App Demo',
    description: 'Tap through a fashion shopping app: home, categories, search, product details, cart, checkout and order tracking, plus the seller app.',
    path: experience.href,
  });
}

/** Mobile App showcase: an interactive phone with a shopping app and a seller app. */
export default function ClothingMobileAppPage() {
  return (
    <div style={CLOTHING_THEME}>
      <ClothingDemoBar active="mobile-app" />
      <DemoExperienceIntro
        eyebrow="Shopping app design"
        title="Shopping, one tap away"
        description="A shopping app and a seller app with bottom navigation, cards and smooth transitions. All data is dummy data."
        hint="Tap inside the phone, or pick a screen from the list. Add a piece to your bag, check out, then track the order."
      >
        <div className="sr-only">
          <Breadcrumbs items={[{ name: 'Demos', href: '/demos' }, { name: CLOTHING_DEMO.title, href: CLOTHING_DEMO.basePath }, { name: experience.label }]} />
        </div>
        <LazyClothingMobileApp />
      </DemoExperienceIntro>
    </div>
  );
}
