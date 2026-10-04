import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, ArrowUpRight, Calculator, Check, Lightbulb, MessageCircle, Play } from 'lucide-react';
import { Breadcrumbs } from '@/components/site/seo';
import { CheckList, CtaBand, TechList } from '@/components/site/blocks';
import { DEMO_LABELS, DemoCard, DemoVisual, PlatformIndicators } from '@/components/site/demos/demo-card';
import { LazyGallery as Gallery } from '@/components/site/lazy';
import { PlatformTabs } from '@/components/site/demos/platform-tabs';
import { Badge } from '@/components/ui/badge';
import { ButtonLink } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Section } from '@/components/ui/section';
import { buildMetadata, getDemo } from '@/lib/cms';
import type { DemoDetail } from '@/lib/cms-types';
import { SolutionDetail } from '@/components/site/solutions/solution-detail';
import { getIcon } from '@/lib/icons';
import { getSolution as getCatalogSolution } from '@/lib/solutions-catalog';
import { getSiteSettings } from '@/lib/server-api';
import { whatsappLink, whatsappMessages } from '@/lib/whatsapp';

type Platform = DemoDetail['platforms'][number];

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const demo = await getDemo(slug);
  if (!demo) {
    const solution = getCatalogSolution(slug);
    if (!solution) return {};
    return buildMetadata(null, { title: `${solution.title} | Demo`, description: solution.description, path: `/demos/${slug}` });
  }
  return buildMetadata({ ...demo, ogImageUrl: demo.ogImageUrl ?? demo.coverImageUrl }, { title: demo.name, description: demo.shortDescription, path: `/demos/${slug}` });
}

function PlatformPanel({ demo, platform }: { demo: DemoDetail; platform: Platform }) {
  const mobile = platform.type === 'MOBILE';
  const shots = demo.screenshots.filter((s) => s.platform === platform.type);
  const features = demo.features.filter((f) => f.platform === platform.type || f.platform === 'BOTH');
  const modules = demo.modules.filter((m) => m.platform === platform.type || m.platform === 'BOTH');
  const ctaUrl = platform.ctaUrl ?? platform.demoUrl;
  const discussUrl = `/contact?demo=${demo.slug}&platform=${mobile ? 'mobile' : 'website'}`;
  const ctaLabel = platform.ctaLabel ?? (mobile ? 'Preview mobile app' : 'Explore website demo');

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-start">
        <div className="min-w-0">
          <h3 className="text-2xl font-semibold tracking-tight">{platform.title ?? (mobile ? `${demo.name} mobile app` : `${demo.name} website`)}</h3>
          {platform.description && <p className="mt-3 max-w-2xl whitespace-pre-line text-pretty text-lg text-muted">{platform.description}</p>}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {ctaUrl && (
              <ButtonLink href={ctaUrl} data-track="live-demo" {...(/^https?:/i.test(ctaUrl) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                {ctaLabel} <ArrowUpRight className="size-4" aria-hidden />
              </ButtonLink>
            )}
            <ButtonLink href={discussUrl} variant={ctaUrl ? 'secondary' : 'primary'}>
              {mobile ? 'Discuss the mobile app' : 'Discuss the website'}
            </ButtonLink>
            {platform.videoUrl && (
              <ButtonLink href={platform.videoUrl} variant="secondary" target="_blank" rel="noopener noreferrer">
                <Play className="size-4" aria-hidden /> Watch video
              </ButtonLink>
            )}
          </div>
          {mobile && (
            <div className="mt-6 flex flex-wrap items-center gap-2">
              {platform.android && <Badge tone="accent">Android</Badge>}
              {platform.ios && <Badge tone="primary">iOS</Badge>}
              {platform.playStoreUrl && (
                <Link href={platform.playStoreUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
                  Google Play
                </Link>
              )}
              {platform.appStoreUrl && (
                <Link href={platform.appStoreUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
                  App Store
                </Link>
              )}
            </div>
          )}
        </div>
        {platform.technologies.length > 0 && (
          <Card className="p-5">
            <h4 className="mb-3 text-sm font-medium text-muted">Technology stack</h4>
            <TechList technologies={platform.technologies.map((t) => ({ ...t, slug: t.id, websiteUrl: null }))} />
          </Card>
        )}
      </div>

      {shots.length > 0 ? (
        <div>
          <h4 className="mb-5 text-lg font-semibold">Screens</h4>
          <Gallery shots={shots} variant={mobile ? 'phone' : 'web'} />
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-border px-5 py-8 text-center text-muted">Screenshots for this {mobile ? 'app' : 'website'} are coming soon.</p>
      )}

      {modules.length > 0 && (
        <div>
          <h4 className="mb-5 text-lg font-semibold">Modules</h4>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((module) => {
              const Icon = getIcon(module.icon ?? 'layers');
              return (
                <li key={module.id}>
                  <Card className="flex h-full gap-3 p-4">
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary">
                      <Icon className="size-4" aria-hidden />
                    </span>
                    <div>
                      <p className="font-medium">{module.title}</p>
                      {module.description && <p className="mt-0.5 text-sm text-muted">{module.description}</p>}
                    </div>
                  </Card>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {features.length > 0 && (
        <div>
          <h4 className="mb-5 text-lg font-semibold">Features</h4>
          <ul className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
            {features.map((feature) => (
              <li key={feature.id} className="flex gap-3">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                  <Check className="size-3" aria-hidden />
                </span>
                <div>
                  <p className="font-medium">{feature.title}</p>
                  {feature.description && <p className="text-sm text-muted">{feature.description}</p>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default async function DemoDetailPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ platform?: string }> }) {
  const [{ slug }, { platform: platformParam }] = await Promise.all([params, searchParams]);
  const [demo, settings] = await Promise.all([getDemo(slug), getSiteSettings()]);
  if (!demo) {
    const solution = getCatalogSolution(slug);
    if (!solution) notFound();
    return <SolutionDetail solution={solution} />;
  }

  const platforms = [...demo.platforms].sort((a) => (a.type === 'WEBSITE' ? -1 : 1));
  const wanted = platformParam === 'mobile' ? 'MOBILE' : 'WEBSITE';
  const initial = platforms.find((p) => p.type === wanted)?.type ?? platforms[0]?.type;
  const benefits = demo.points.filter((p) => p.type === 'BENEFIT');
  const useCases = demo.points.filter((p) => p.type === 'USE_CASE');
  const ctaUrl = !demo.ctaUrl || demo.ctaUrl === '/contact' ? `/contact?demo=${demo.slug}` : demo.ctaUrl;
  const waLink = whatsappLink(settings.whatsapp, whatsappMessages.demo(settings.companyName, demo.name));
  const ctaLabel = demo.ctaLabel ?? 'Discuss this solution';
  const hasOverview = demo.fullDescription || demo.problem || demo.solution || demo.targetUsers || demo.targetBusinesses || demo.outcomes.length > 0;

  return (
    <>
      <section className="relative isolate -mt-(--navbar-height) overflow-hidden bg-[radial-gradient(60%_70%_at_90%_0%,rgb(251_224_195/0.85),transparent)]">
        <div aria-hidden className="grain pointer-events-none absolute inset-0 -z-10" />
        <div className="mx-auto grid grid-cols-1 w-full max-w-7xl gap-12 px-5 pb-16 pt-28 sm:px-8 sm:pb-24 sm:pt-36 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="min-w-0">
            <Breadcrumbs items={[{ name: 'Demos', href: '/demos' }, { name: demo.name }]} />
            <div className="flex flex-wrap items-center gap-2">
              {demo.industry && <Badge tone="primary">{demo.industry.name}</Badge>}
              {demo.category && demo.category.name !== demo.industry?.name && <Badge>{demo.category.name}</Badge>}
              <Badge tone="accent">{DEMO_LABELS[demo.statusLabel]}</Badge>
              {demo.badge && <Badge>{demo.badge}</Badge>}
            </div>
            <h1 className="display mt-6 text-balance text-5xl leading-[1.04] text-primary sm:text-6xl">{demo.name}</h1>
            <p className="mt-4 max-w-xl text-pretty text-lg text-muted sm:text-xl">{demo.shortDescription}</p>
            <div className="mt-6">
              <PlatformIndicators platforms={demo.platforms} />
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ButtonLink href={ctaUrl} size="lg">
                {ctaLabel} <ArrowRight className="size-4" aria-hidden />
              </ButtonLink>
              <ButtonLink href={`/estimate?demo=${demo.slug}`} size="lg" variant="secondary">
                <Calculator className="size-4" aria-hidden /> Estimate This Project
              </ButtonLink>
              {waLink && (
                <ButtonLink href={waLink} size="lg" variant="ghost" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="size-4" aria-hidden /> Discuss {demo.name}
                </ButtonLink>
              )}
            </div>
          </div>
          <div className="relative">
            <DemoVisual
              demo={{ ...demo, thumbnailUrl: demo.coverImageUrl ?? demo.thumbnailUrl ?? demo.screenshots.find((shot) => shot.platform === 'WEBSITE')?.url ?? null, screenshots: demo.screenshots.filter((shot) => shot.platform === 'MOBILE') }}
              className="aspect-[16/11] w-full rounded-[1.75rem] shadow-[var(--shadow-lift)]"
            />
          </div>
        </div>
      </section>

      {hasOverview && (
        <Section eyebrow="Overview" title={`About ${demo.name}`}>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.3fr_1fr]">
            <div className="space-y-6">
              {demo.fullDescription && <p className="whitespace-pre-line text-pretty text-lg text-muted">{demo.fullDescription}</p>}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {demo.problem && (
                  <Card className="p-5">
                    <h3 className="text-sm font-medium text-danger">The problem</h3>
                    <p className="mt-2 text-muted">{demo.problem}</p>
                  </Card>
                )}
                {demo.solution && (
                  <Card className="p-5">
                    <h3 className="text-sm font-medium text-accent">The solution</h3>
                    <p className="mt-2 text-muted">{demo.solution}</p>
                  </Card>
                )}
              </div>
              {demo.highlight && (
                <p className="flex gap-3 rounded-xl bg-primary-soft p-4 text-primary">
                  <Lightbulb className="mt-0.5 size-5 shrink-0" aria-hidden /> {demo.highlight}
                </p>
              )}
            </div>
            <div className="space-y-6">
              {(demo.targetUsers || demo.targetBusinesses) && (
                <dl className="space-y-4">
                  {demo.targetUsers && (
                    <div>
                      <dt className="text-sm font-medium text-muted">Target users</dt>
                      <dd className="mt-1">{demo.targetUsers}</dd>
                    </div>
                  )}
                  {demo.targetBusinesses && (
                    <div>
                      <dt className="text-sm font-medium text-muted">Target businesses</dt>
                      <dd className="mt-1">{demo.targetBusinesses}</dd>
                    </div>
                  )}
                </dl>
              )}
              {demo.outcomes.length > 0 && (
                <div>
                  <h3 className="mb-3 text-sm font-medium text-muted">Key outcomes</h3>
                  <CheckList items={demo.outcomes} />
                </div>
              )}
            </div>
          </div>
        </Section>
      )}

      {platforms.length > 0 && initial && (
        <Section tone="surface" eyebrow="Experience" title={platforms.length > 1 ? 'Explore by platform' : platforms[0].type === 'MOBILE' ? 'Mobile app' : 'Website experience'}>
          {platforms.length > 1 ? (
            <PlatformTabs
              initial={initial}
              panels={platforms.map((p) => ({ type: p.type, label: p.type === 'MOBILE' ? 'Mobile App' : 'Website', content: <PlatformPanel demo={demo} platform={p} /> }))}
            />
          ) : (
            <PlatformPanel demo={demo} platform={platforms[0]} />
          )}
        </Section>
      )}

      {(benefits.length > 0 || useCases.length > 0) && (
        <Section>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            {[
              ['Benefits', benefits],
              ['Use cases', useCases],
            ].map(([title, list]) =>
              (list as typeof benefits).length > 0 ? (
                <div key={title as string}>
                  <h2 className="mb-5 text-2xl font-semibold tracking-tight">{title as string}</h2>
                  <ul className="space-y-4">
                    {(list as typeof benefits).map((point) => (
                      <li key={point.id} className="border-l-2 border-primary/40 pl-4">
                        <p className="font-medium">{point.title}</p>
                        {point.description && <p className="text-sm text-muted">{point.description}</p>}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null,
            )}
          </div>
        </Section>
      )}

      {demo.related.length > 0 && (
        <Section tone="surface" eyebrow="Explore more" title="Related solutions">
          <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {demo.related.map((item) => (
              <li key={item.slug}>
                <DemoCard demo={item} />
              </li>
            ))}
          </ul>
        </Section>
      )}

      <CtaBand content={{ headline: `Like what you see in ${demo.name}?`, description: 'Tell us about your project and we’ll shape a solution around your business.', primaryLabel: ctaLabel, primaryUrl: ctaUrl }} />
    </>
  );
}
