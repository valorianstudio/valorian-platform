import { DemoBar } from '@/components/demos/shared/demo-bar';
import { CLINIC_DEMO, CLINIC_EXPERIENCES, CLINIC_THEME } from '@/data/clinic/meta';
import type { ClinicExperienceKey } from '@/data/clinic/meta';

/** Valorian's strip for the Clinic Management demo, wired to its routes. `active` is the page it sits on. */
export function ClinicDemoBar({ active }: { active: ClinicExperienceKey | 'overview' }) {
  return (
    <div style={CLINIC_THEME}>
      <DemoBar title={CLINIC_DEMO.title} slug={CLINIC_DEMO.slug} overviewHref={CLINIC_DEMO.basePath} experiences={CLINIC_EXPERIENCES} active={active} />
    </div>
  );
}
