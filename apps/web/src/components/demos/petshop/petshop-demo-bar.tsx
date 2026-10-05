import { DemoBar } from '@/components/demos/shared/demo-bar';
import { PETSHOP_DEMO, PETSHOP_EXPERIENCES, PETSHOP_THEME } from '@/data/petshop/meta';
import type { PetshopExperienceKey } from '@/data/petshop/meta';

/** Valorian's strip for the Pet Shop demo, wired to its routes. `active` is the page it sits on. */
export function PetshopDemoBar({ active }: { active: PetshopExperienceKey | 'overview' }) {
  return (
    <div style={PETSHOP_THEME}>
      <DemoBar title={PETSHOP_DEMO.title} slug={PETSHOP_DEMO.slug} overviewHref={PETSHOP_DEMO.basePath} experiences={PETSHOP_EXPERIENCES} active={active} />
    </div>
  );
}
