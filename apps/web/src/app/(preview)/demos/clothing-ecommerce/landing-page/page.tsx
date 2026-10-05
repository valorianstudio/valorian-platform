import type { Metadata } from 'next';
import { ClothingLandingPage } from '@/components/demos/clothing/clothing-landing-page';
import { Breadcrumbs } from '@/components/site/seo';
import { CLOTHING_DEMO, CLOTHING_EXPERIENCES } from '@/data/clothing/meta';
import { buildMetadata } from '@/lib/cms';

const experience = CLOTHING_EXPERIENCES[0];

export function generateMetadata(): Promise<Metadata> {
  return buildMetadata(null, {
    title: 'Clothing E-commerce Landing Page Demo',
    description: 'A premium fashion brand website: a campaign hero, featured pieces, categories, the lookbook, reviews and a newsletter.',
    path: experience.href,
  });
}

/** Landing Page showcase: the fashion brand website as a standalone full-page preview (see the (preview) layout). */
export default function ClothingLandingPageRoute() {
  return (
    <>
      <div className="sr-only">
        <Breadcrumbs items={[{ name: 'Demos', href: '/demos' }, { name: CLOTHING_DEMO.title, href: CLOTHING_DEMO.basePath }, { name: experience.label }]} />
      </div>
      <ClothingLandingPage />
    </>
  );
}
