import type { Metadata } from 'next';
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { PageHero } from '@/components/site/page-hero';
import { Card } from '@/components/ui/card';
import { Section } from '@/components/ui/section';
import { getSiteSettings } from '@/lib/server-api';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Tell us about your project. Valorian Studio will get back to you with a clear plan.',
  alternates: { canonical: '/contact' },
};

interface Channel {
  label: string;
  value: string;
  href?: string;
  Icon: LucideIcon;
}

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const whatsappDigits = settings.whatsapp?.replace(/\D/g, '');

  const channels: Channel[] = [
    { label: 'Email', value: settings.primaryEmail, href: `mailto:${settings.primaryEmail}`, Icon: Mail },
    ...(settings.phone ? [{ label: 'Phone', value: settings.phone, href: `tel:${settings.phone.replace(/[^\d+]/g, '')}`, Icon: Phone }] : []),
    ...(whatsappDigits ? [{ label: 'WhatsApp', value: settings.whatsapp ?? '', href: `https://wa.me/${whatsappDigits}`, Icon: MessageCircle }] : []),
    ...(settings.location ? [{ label: 'Location', value: settings.location, Icon: MapPin }] : []),
  ];

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's talk about your project"
        description="Share what you want to build and the problem it solves. We reply within one business day."
      />
      <Section>
        <ul className="grid gap-4 sm:grid-cols-2">
          {channels.map(({ label, value, href, Icon }) => (
            <li key={label}>
              <Card className="h-full p-6">
                <span className="grid size-10 place-items-center rounded-lg bg-primary-soft text-primary">
                  <Icon className="size-5" aria-hidden />
                </span>
                <h2 className="mt-4 text-sm font-medium text-muted">{label}</h2>
                {href ? (
                  <a href={href} className="mt-1 block break-words text-lg font-semibold hover:text-primary">
                    {value}
                  </a>
                ) : (
                  <p className="mt-1 text-lg font-semibold">{value}</p>
                )}
              </Card>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
