import type { Metadata } from 'next';
import { ClothingDemoBar } from '@/components/demos/clothing/clothing-demo-bar';
import { LazyEcommerceWebsite } from '@/components/demos/clothing/lazy';
import { DemoExperienceIntro } from '@/components/demos/shared/experience-intro';
import { Breadcrumbs } from '@/components/site/seo';
import { CLOTHING_DEMO, CLOTHING_EXPERIENCES, CLOTHING_THEME } from '@/data/clothing/meta';
import { buildMetadata } from '@/lib/cms';

const experience = CLOTHING_EXPERIENCES[1];

export function generateMetadata(): Promise<Metadata> {
  return buildMetadata(null, {
    title: 'Clothing E-commerce Dashboard Demo',
    description: 'Explore a fashion store: product pages, filters, cart and checkout, plus the admin dashboard for products, orders, customers, inventory and discounts. Designed by Valorian Studio.',
    path: experience.href,
  });
}

/** Website showcase: the working store and its admin dashboard. The interactive parts are lazily loaded client components. */
export default function ClothingWebsitePage() {
  return (
    <div style={CLOTHING_THEME}>
      <ClothingDemoBar active="website" />
      <DemoExperienceIntro
        eyebrow="E-commerce website design"
        title="A store your customers love to shop"
        description="Browse, try a size, fill the bag and check out. The admin side runs orders, stock and discounts. All data is dummy data."
        hint='Use the switch above to move between the customer store and the admin dashboard.'
      >
        <div className="sr-only">
          <Breadcrumbs items={[{ name: 'Demos', href: '/demos' }, { name: CLOTHING_DEMO.title, href: CLOTHING_DEMO.basePath }, { name: experience.label }]} />
        </div>
        <LazyEcommerceWebsite />
      </DemoExperienceIntro>
    </div>
  );
}
