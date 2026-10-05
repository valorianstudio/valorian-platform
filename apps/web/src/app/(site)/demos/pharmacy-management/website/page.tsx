import type { Metadata } from 'next';
import { DemoInterest } from '@/components/demos/shared/demo-interest';
import { PharmacyDemoBar } from '@/components/demos/pharmacy/pharmacy-demo-bar';
import { LazyPharmacyDashboard } from '@/components/demos/pharmacy/lazy';
import { DemoExperienceIntro } from '@/components/demos/shared/experience-intro';
import { Breadcrumbs } from '@/components/site/seo';
import { PHARMACY_DEMO, PHARMACY_EXPERIENCES, PHARMACY_THEME } from '@/data/pharmacy/meta';
import { buildMetadata } from '@/lib/cms';

const experience = PHARMACY_EXPERIENCES[1];

export function generateMetadata(): Promise<Metadata> {
  return buildMetadata(null, {
    title: 'Pharmacy Management Dashboard Demo',
    description: 'Explore a pharmacy dashboard: medicines, inventory, prescriptions, orders, customers, suppliers, sales and reports. Designed by Valorian Studio.',
    path: experience.href,
  });
}

/** Website showcase: the working pharmacy platform. The interactive shell is a lazily loaded client component. */
export default function PharmacyWebsitePage() {
  return (
    <div style={PHARMACY_THEME}>
      <PharmacyDemoBar active="website" />
      <DemoExperienceIntro
        eyebrow="Pharmacy dashboard design"
        title="Every medicine, prescription and order in view"
        description="Track stock and expiry, verify prescriptions, follow deliveries and review sales in one calm interface. All data is dummy data."
        hint='Use "View as" in the top bar to switch between Pharmacy manager and Pharmacist. Try verifying a prescription or moving an order on.'
      >
        <div className="sr-only">
          <Breadcrumbs items={[{ name: 'Demos', href: '/demos' }, { name: PHARMACY_DEMO.title, href: PHARMACY_DEMO.basePath }, { name: experience.label }]} />
        </div>
        <LazyPharmacyDashboard />
      </DemoExperienceIntro>
      <DemoInterest slug={PHARMACY_DEMO.slug} title={PHARMACY_DEMO.title} />
    </div>
  );
}
