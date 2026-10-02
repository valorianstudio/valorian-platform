import { Badge } from '@/components/ui/badge';
import { ButtonLink } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Section } from '@/components/ui/section';
import { PageHero } from './page-hero';

interface ComingSoonProps {
  eyebrow: string;
  title: string;
  description: string;
  highlights: { title: string; description: string }[];
}

export function ComingSoon({ eyebrow, title, description, highlights }: ComingSoonProps) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} description={description}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <ButtonLink href="/contact">Start a Project</ButtonLink>
          <Badge tone="accent" className="w-fit">
            Full details coming soon
          </Badge>
        </div>
      </PageHero>
      <Section>
        <ul className="grid gap-4 md:grid-cols-3">
          {highlights.map((item) => (
            <li key={item.title}>
              <Card className="h-full p-6">
                <h2 className="text-lg font-semibold">{item.title}</h2>
                <p className="mt-2 text-muted">{item.description}</p>
              </Card>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
