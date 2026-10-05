import { DemoBar } from '@/components/demos/shared/demo-bar';
import { PHARMACY_DEMO, PHARMACY_EXPERIENCES, PHARMACY_THEME } from '@/data/pharmacy/meta';
import type { PharmacyExperienceKey } from '@/data/pharmacy/meta';

/** Valorian's strip for the Pharmacy demo, wired to its routes. `active` is the page it sits on. */
export function PharmacyDemoBar({ active }: { active: PharmacyExperienceKey | 'overview' }) {
  return (
    <div style={PHARMACY_THEME}>
      <DemoBar title={PHARMACY_DEMO.title} slug={PHARMACY_DEMO.slug} overviewHref={PHARMACY_DEMO.basePath} experiences={PHARMACY_EXPERIENCES} active={active} />
    </div>
  );
}
