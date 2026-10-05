import type { Metadata } from 'next';
import { GymLandingPage } from '@/components/demos/gym/gym-landing-page';
import { Breadcrumbs } from '@/components/site/seo';
import { GYM_DEMO, GYM_EXPERIENCES } from '@/data/gym/meta';
import { buildMetadata } from '@/lib/cms';

const experience = GYM_EXPERIENCES[0];

export function generateMetadata(): Promise<Metadata> {
  return buildMetadata(null, {
    title: 'Gym Management Landing Page Demo',
    description: 'A premium gym marketing website for gym management software: features, trainers, plans, testimonials and a trial sign-up form.',
    path: experience.href,
  });
}

/** Landing Page showcase: the gym website as a standalone full-page preview (see the (preview) layout). */
export default function GymLandingPageRoute() {
  return (
    <>
      <div className="sr-only">
        <Breadcrumbs items={[{ name: 'Demos', href: '/demos' }, { name: GYM_DEMO.title, href: GYM_DEMO.basePath }, { name: experience.label }]} />
      </div>
      <GymLandingPage />
    </>
  );
}
