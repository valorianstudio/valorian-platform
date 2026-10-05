import { DemoBar } from '@/components/demos/shared/demo-bar';
import { PROPERTY_DEMO, PROPERTY_EXPERIENCES, PROPERTY_THEME } from '@/data/property/meta';
import type { PropertyExperienceKey } from '@/data/property/meta';

/** Valorian's strip for the Property demo, wired to its routes. `active` is the page it sits on. */
export function PropertyDemoBar({ active }: { active: PropertyExperienceKey | 'overview' }) {
  return (
    <div style={PROPERTY_THEME}>
      <DemoBar title={PROPERTY_DEMO.title} slug={PROPERTY_DEMO.slug} overviewHref={PROPERTY_DEMO.basePath} experiences={PROPERTY_EXPERIENCES} active={active} />
    </div>
  );
}
