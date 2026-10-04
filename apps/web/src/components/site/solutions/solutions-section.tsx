import { Section } from '@/components/ui/section';
import { SolutionsShowcase } from './solutions-showcase';

/** Homepage block: what Valorian Studio builds, in three categories, with a taste of each. The full catalog lives on /demos. */
export function SolutionsSection() {
  return (
    <Section id="solutions" tone="surface" eyebrow="Solutions & Product Demos" title="Landing pages, web apps and mobile apps, built for your business" description="Whatever you need to launch or run, start from a proven solution and make it yours.">
      <SolutionsShowcase limit={6} />
    </Section>
  );
}
