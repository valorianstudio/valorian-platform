import type { Metadata } from 'next';
import { CheckList, CtaBand, FaqSection } from '@/components/site/blocks';
import { PageHero } from '@/components/site/page-hero';
import { Card } from '@/components/ui/card';
import { Section } from '@/components/ui/section';
import { buildMetadata, getAbout } from '@/lib/cms';
import type { CtaContent, PageHeroContent } from '@/lib/cms-types';

const FALLBACK = { title: 'About', description: 'Valorian Studio is a software engineering and digital product studio.', path: '/about' };

interface Titled {
  title: string;
  description: string;
}
type Content = PageHeroContent &
  CtaContent & {
    body: string;
    missionTitle: string;
    mission: string;
    visionTitle: string;
    vision: string;
    items: (Titled & { value: string; label: string })[];
    points: string[];
  };

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata((await getAbout())?.seo, FALLBACK);
}

function Paragraphs({ text }: { text: string }) {
  return (
    <div className="max-w-3xl space-y-4 text-pretty text-lg text-muted">
      {text.split(/\n{2,}/).map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
  );
}

export default async function AboutPage() {
  const about = await getAbout();
  if (!about) throw new Error('About content is unavailable.');

  return (
    <>
      {about.sections.map((section) => {
        const c = section.content as unknown as Content;
        switch (section.key) {
          case 'hero':
            return <PageHero key="hero" eyebrow={c.eyebrow ?? 'About'} title={c.title} description={c.description} />;
          case 'story':
            return (
              <Section key="story" eyebrow={c.eyebrow ?? undefined} title={c.title}>
                <Paragraphs text={c.body} />
              </Section>
            );
          case 'purpose':
            return (
              <Section key="purpose" tone="surface">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {[
                    [c.missionTitle, c.mission],
                    [c.visionTitle, c.vision],
                  ].map(([title, text]) => (
                    <Card key={title} className="p-7">
                      <h2 className="text-sm font-medium text-primary">{title}</h2>
                      <p className="mt-3 text-pretty text-xl font-medium tracking-tight">{text}</p>
                    </Card>
                  ))}
                </div>
              </Section>
            );
          case 'values':
            return (
              <Section key="values" title={c.title}>
                <ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {c.items.map((item) => (
                    <li key={item.title}>
                      <Card className="h-full p-6">
                        <h3 className="text-lg font-semibold">{item.title}</h3>
                        <p className="mt-2 text-muted">{item.description}</p>
                      </Card>
                    </li>
                  ))}
                </ul>
              </Section>
            );
          case 'philosophy':
            return (
              <Section key="philosophy" tone="surface" eyebrow="Philosophy" title={c.title}>
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.3fr_1fr]">
                  <Paragraphs text={c.body} />
                  {c.points.length > 0 && (
                    <Card className="h-fit p-6">
                      <CheckList items={c.points} />
                    </Card>
                  )}
                </div>
              </Section>
            );
          case 'stats':
            return c.items.length === 0 ? null : (
              <Section key="stats" title={c.title}>
                <dl className="grid grid-cols-2 gap-6 md:grid-cols-4">
                  {c.items.map((item) => (
                    <div key={item.label} className="border-t border-border pt-4">
                      <dt className="text-sm text-muted">{item.label}</dt>
                      <dd className="mt-1 text-3xl font-semibold tracking-tight">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </Section>
            );
          case 'cta':
            return (
              <div key="cta">
                <FaqSection faqs={about.faqs} />
                <CtaBand content={c} />
              </div>
            );
          default:
            return null;
        }
      })}
    </>
  );
}
