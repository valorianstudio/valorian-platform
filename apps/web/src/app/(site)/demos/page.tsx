import type { Metadata } from 'next';
import { DemoShowcase } from '@/components/site/demos/demo-showcase';
import { JsonLd } from '@/components/site/seo';
import { PageHero } from '@/components/site/page-hero';
import { ButtonLink } from '@/components/ui/button';
import { Section } from '@/components/ui/section';
import { SHOWCASE_DEMOS } from '@/data/demos';
import { buildMetadata, getPageSeo } from '@/lib/cms';
import { SITE_URL } from '@/lib/site';

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata(await getPageSeo('DEMOS'), {
    title: 'Solutions & Product Demos',
    description: 'Landing pages, full stack web applications and mobile apps for schools, clinics, restaurants, gyms, hotels and more. Explore what Valorian Studio builds.',
    path: '/demos',
  });
}

/** The content comes from data/demos.ts, so this page makes no API call for it and is built once and served from cache. */
export default function DemosPage() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Solutions & Product Demos',
          itemListElement: SHOWCASE_DEMOS.map((demo, index) => ({ '@type': 'ListItem', position: index + 1, name: demo.title, url: `${SITE_URL}/demos/${demo.slug}` })),
        }}
      />
      <PageHero eyebrow="Solutions & Demos" title="See what we build, before we build it" description="Landing pages, full stack web applications and mobile apps for real businesses. Each demo is a showcase concept, not a client project.">
        <ButtonLink href="/contact">Start a Project</ButtonLink>
      </PageHero>
      <Section id="solutions" eyebrow="Solutions" title="Three ways we help you grow" description="Pick a category to see the systems we build for your industry. Every demo can be adapted to your business.">
        <DemoShowcase />
      </Section>
    </>
  );
}
