import type { Metadata } from 'next';
import { SchoolLandingPage } from '@/components/demos/school/school-landing-page';
import { Breadcrumbs } from '@/components/site/seo';
import { SCHOOL_DEMO, SCHOOL_EXPERIENCES } from '@/data/school/meta';
import { buildMetadata } from '@/lib/cms';

const experience = SCHOOL_EXPERIENCES[0];

export function generateMetadata(): Promise<Metadata> {
  return buildMetadata(null, {
    title: 'School Management Landing Page Demo',
    description: 'A conversion-focused marketing landing page for a school management platform: hero, features, results, testimonials, pricing and an admissions form. Designed by Valorian Studio.',
    path: experience.href,
  });
}

/** Landing Page showcase: the marketing site as a standalone full-page preview (see the (preview) layout). Server-rendered end to end; the only client code is the small enquiry form. */
export default function SchoolLandingPageRoute() {
  return (
    <>
      <div className="sr-only">
        <Breadcrumbs items={[{ name: 'Demos', href: '/demos' }, { name: SCHOOL_DEMO.title, href: SCHOOL_DEMO.basePath }, { name: experience.label }]} />
      </div>
      <SchoolLandingPage />
    </>
  );
}
