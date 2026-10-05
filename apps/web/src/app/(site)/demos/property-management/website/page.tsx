import type { Metadata } from 'next';
import { DemoInterest } from '@/components/demos/shared/demo-interest';
import { PropertyDemoBar } from '@/components/demos/property/property-demo-bar';
import { LazyPropertyDashboard } from '@/components/demos/property/lazy';
import { DemoExperienceIntro } from '@/components/demos/shared/experience-intro';
import { Breadcrumbs } from '@/components/site/seo';
import { PROPERTY_DEMO, PROPERTY_EXPERIENCES, PROPERTY_THEME } from '@/data/property/meta';
import { buildMetadata } from '@/lib/cms';

const experience = PROPERTY_EXPERIENCES[1];

export function generateMetadata(): Promise<Metadata> {
  return buildMetadata(null, {
    title: 'Property Management Dashboard Demo',
    description: 'Explore a property dashboard: properties, units, tenants, maintenance, payments, visitors, staff, reports and analytics. Designed by Valorian Studio.',
    path: experience.href,
  });
}

/** Website showcase: the working property platform. The interactive shell is a lazily loaded client component. */
export default function PropertyWebsitePage() {
  return (
    <div style={PROPERTY_THEME}>
      <PropertyDemoBar active="website" />
      <DemoExperienceIntro
        eyebrow="Property dashboard design"
        title="Every building, tenant and request in view"
        description="Track occupancy, rent, repairs and visitors across the portfolio in one calm interface. All data is dummy data."
        hint='Use "View as" in the top bar to switch between Property manager and Maintenance lead. Try starting work on a repair or checking in a visitor.'
      >
        <div className="sr-only">
          <Breadcrumbs items={[{ name: 'Demos', href: '/demos' }, { name: PROPERTY_DEMO.title, href: PROPERTY_DEMO.basePath }, { name: experience.label }]} />
        </div>
        <LazyPropertyDashboard />
      </DemoExperienceIntro>
      <DemoInterest slug={PROPERTY_DEMO.slug} title={PROPERTY_DEMO.title} />
    </div>
  );
}
