import type { Metadata } from 'next';
import { DemoInterest } from '@/components/demos/shared/demo-interest';
import { PetshopDemoBar } from '@/components/demos/petshop/petshop-demo-bar';
import { LazyPetshopDashboard } from '@/components/demos/petshop/lazy';
import { DemoExperienceIntro } from '@/components/demos/shared/experience-intro';
import { Breadcrumbs } from '@/components/site/seo';
import { PETSHOP_DEMO, PETSHOP_EXPERIENCES, PETSHOP_THEME } from '@/data/petshop/meta';
import { buildMetadata } from '@/lib/cms';

const experience = PETSHOP_EXPERIENCES[1];

export function generateMetadata(): Promise<Metadata> {
  return buildMetadata(null, {
    title: 'Pet Shop Management Dashboard Demo',
    description: 'Explore a pet shop dashboard: pets, customers, products, orders, grooming and vet appointments, inventory, payments and reports. Designed by Valorian Studio.',
    path: experience.href,
  });
}

/** Website showcase: the working shop platform. The interactive shell is a lazily loaded client component. */
export default function PetShopWebsitePage() {
  return (
    <div style={PETSHOP_THEME}>
      <PetshopDemoBar active="website" />
      <DemoExperienceIntro
        eyebrow="Pet shop dashboard design"
        title="Every pet, order and visit in view"
        description="Run pet records, product stock, grooming and vet schedules and payments in one calm interface. All data is dummy data."
        hint='Use "View as" in the top bar to switch between Shop manager and Groomer. Try advancing an order or an appointment.'
      >
        <div className="sr-only">
          <Breadcrumbs items={[{ name: 'Demos', href: '/demos' }, { name: PETSHOP_DEMO.title, href: PETSHOP_DEMO.basePath }, { name: experience.label }]} />
        </div>
        <LazyPetshopDashboard />
      </DemoExperienceIntro>
      <DemoInterest slug={PETSHOP_DEMO.slug} title={PETSHOP_DEMO.title} />
    </div>
  );
}
