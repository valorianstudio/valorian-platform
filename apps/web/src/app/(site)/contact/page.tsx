import type { Metadata } from 'next';
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { LeadForm } from '@/components/site/lead-form';
import type { LeadContext } from '@/components/site/lead-form';
import { PageHero } from '@/components/site/page-hero';
import { Card } from '@/components/ui/card';
import { Section } from '@/components/ui/section';
import { buildMetadata, getDemo, getLeadConfig, getPageSeo, getService } from '@/lib/cms';
import { getSiteSettings } from '@/lib/server-api';
import { getSolution as getCatalogSolution } from '@/lib/solutions-catalog';
import { whatsappLink, whatsappMessages } from '@/lib/whatsapp';

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata(await getPageSeo('CONTACT'), { title: 'Contact', description: 'Tell us about your project. We will get back to you with a clear plan.', path: '/contact' });
}

type Params = Record<string, string | string[] | undefined>;
const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? '';

interface Channel {
  label: string;
  value: string;
  href?: string;
  Icon: LucideIcon;
}

export default async function ContactPage({ searchParams }: { searchParams: Promise<Params> }) {
  const params = await searchParams;
  const demoSlug = first(params.demo).slice(0, 80);
  const serviceSlug = first(params.service).slice(0, 80);
  const platformParam = first(params.platform).toLowerCase();
  const platform = platformParam === 'mobile' ? 'MOBILE' : platformParam === 'website' ? 'WEBSITE' : platformParam === 'both' ? 'BOTH' : undefined;

  const [settings, config, demo, service] = await Promise.all([
    getSiteSettings(),
    getLeadConfig(),
    demoSlug ? getDemo(demoSlug) : null,
    serviceSlug ? getService(serviceSlug) : null,
  ]);

  const catalog = !demo && demoSlug ? getCatalogSolution(demoSlug) : undefined;
  const context: LeadContext = demo
    ? { source: 'DEMO', demo: demo.slug, demoName: demo.name, platform, backHref: `/demos/${demo.slug}`, backLabel: `Return to ${demo.name}` }
    : catalog
      ? { source: 'DEMO', demo: catalog.slug, demoName: catalog.title, backHref: `/demos/${catalog.slug}`, backLabel: `Return to ${catalog.title}` }
      : service
      ? { source: 'SERVICE', service: service.service.slug, serviceName: service.service.title, backHref: `/services/${service.service.slug}`, backLabel: `Return to ${service.service.title}` }
      : { source: 'CONTACT' };

  const platformName = platform === 'MOBILE' ? 'Mobile App' : platform === 'BOTH' ? 'Website + Mobile App' : platform === 'WEBSITE' ? 'Website' : undefined;
  const waMessage = demo
    ? whatsappMessages.demo(settings.companyName, demo.name, platformName)
    : catalog
      ? whatsappMessages.demo(settings.companyName, catalog.title, platformName)
      : service
      ? whatsappMessages.service(settings.companyName, service.service.title)
      : whatsappMessages.general(settings.companyName);
  const wa = whatsappLink(settings.whatsapp, waMessage);

  const channels: Channel[] = [
    { label: 'Email', value: settings.primaryEmail, href: `mailto:${settings.primaryEmail}`, Icon: Mail },
    ...(settings.phone ? [{ label: 'Phone', value: settings.phone, href: `tel:${settings.phone.replace(/[^\d+]/g, '')}`, Icon: Phone }] : []),
    ...(wa ? [{ label: 'WhatsApp', value: `Chat with ${settings.brandName}`, href: wa, Icon: MessageCircle }] : []),
    ...(settings.location ? [{ label: 'Location', value: settings.location, Icon: MapPin }] : []),
  ];

  return (
    <>
      <PageHero eyebrow="Contact" title="Let's talk about your project" description="Share what you want to build and the problem it solves. The more detail you give, the more useful our reply." />
      <Section>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.6fr_1fr]">
          <Card className="p-5 sm:p-8">
            <LeadForm context={context} company={settings.companyName} whatsappNumber={settings.whatsapp} responseNote={config?.responseNote} showInquiryTypes />
          </Card>
          <aside aria-label="Other ways to reach us">
            <h2 className="mb-4 text-lg font-semibold">Prefer to reach out directly?</h2>
            <ul className="space-y-3">
              {channels.map(({ label, value, href, Icon }) => (
                <li key={label}>
                  <Card className="flex items-center gap-4 p-4">
                    <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm text-muted">{label}</p>
                      {href ? (
                        <a href={href} {...(href.startsWith('https://wa.me') ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="block break-words font-medium hover:text-primary">
                          {value}
                        </a>
                      ) : (
                        <p className="font-medium">{value}</p>
                      )}
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </Section>
    </>
  );
}
