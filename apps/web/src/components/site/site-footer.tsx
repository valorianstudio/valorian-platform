import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import type { SiteSettings } from '@/lib/types';
import type { NavItem } from '@/lib/cms-types';
import { SmartLink } from './blocks';
import { Wordmark } from './wordmark';
import { FacebookIcon, GithubIcon, InstagramIcon, LinkedinIcon, TwitterIcon } from './social-icons';

interface LinkItem {
  label: string;
  href: string;
}

function Column({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-coral">{title}</h2>
      <ul className="mt-4 space-y-0.5">{children}</ul>
    </div>
  );
}

const linkClass = 'inline-block py-1.5 text-sm text-[#d4dcd9] transition-colors duration-200 hover:text-coral';

function ContactRow({ icon, href, children }: { icon: ReactNode; href?: string; children: ReactNode }) {
  const content = (
    <>
      <span aria-hidden className="text-coral">
        {icon}
      </span>
      <span className="min-w-0 break-words">{children}</span>
    </>
  );
  return <li>{href ? <a href={href} className={`flex items-center gap-2.5 ${linkClass}`}>{content}</a> : <span className="flex items-center gap-2.5 text-sm text-[#d4dcd9]">{content}</span>}</li>;
}

export function SiteFooter({ settings, items, services, solutions }: { settings: SiteSettings; items: NavItem[]; services: LinkItem[]; solutions: LinkItem[] }) {
  const footerLinks = items.filter((item) => item.location === 'FOOTER');
  const legalLinks = items.filter((item) => item.location === 'LEGAL');
  const socials = [
    { label: 'LinkedIn', href: settings.linkedinUrl, Icon: LinkedinIcon },
    { label: 'GitHub', href: settings.githubUrl, Icon: GithubIcon },
    { label: 'X', href: settings.twitterUrl, Icon: TwitterIcon },
    { label: 'Facebook', href: settings.facebookUrl, Icon: FacebookIcon },
    { label: 'Instagram', href: settings.instagramUrl, Icon: InstagramIcon },
  ].filter((social): social is typeof social & { href: string } => Boolean(social.href));
  const whatsappDigits = settings.whatsapp?.replace(/\D/g, '');

  return (
    <footer className="relative overflow-hidden bg-slate text-[#fffdfc]">
      <div aria-hidden className="grain pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-screen" />
      <div className="relative mx-auto grid grid-cols-1 w-full max-w-7xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1.3fr]">
        <div className="max-w-sm md:col-span-2 lg:col-span-1">
          <Wordmark name={settings.brandName} onDark />
          <p className="display mt-6 text-2xl text-[#fffdfc]">{settings.companyName}</p>
          <p className="mt-2 text-sm leading-relaxed text-[#d4dcd9]">{settings.tagline}</p>
          {socials.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2">
              {socials.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="grid size-10 place-items-center rounded-full border border-white/20 text-[#d4dcd9] transition-[color,border-color,background-color,transform] duration-200 hover:-translate-y-0.5 hover:border-coral hover:bg-coral hover:text-slate">
                    <Icon className="size-4" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <nav aria-label="Services">
          <Column title="Services">
            {services.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              </li>
            ))}
          </Column>
        </nav>

        <nav aria-label="Solutions">
          <Column title="Solutions">
            {solutions.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              </li>
            ))}
          </Column>
        </nav>

        <nav aria-label="Company">
          <Column title="Company">
            {footerLinks.map((link) => (
              <li key={link.id}>
                <SmartLink href={link.url} newTab={link.openInNewTab} className={linkClass}>
                  {link.label}
                </SmartLink>
              </li>
            ))}
          </Column>
        </nav>

        <Column title="Contact">
          <ContactRow icon={<Mail className="size-4" />} href={`mailto:${settings.primaryEmail}`}>
            {settings.primaryEmail}
          </ContactRow>
          {settings.phone && (
            <ContactRow icon={<Phone className="size-4" />} href={`tel:${settings.phone.replace(/[^\d+]/g, '')}`}>
              {settings.phone}
            </ContactRow>
          )}
          {whatsappDigits && (
            <ContactRow icon={<MessageCircle className="size-4" />} href={`https://wa.me/${whatsappDigits}`}>
              WhatsApp
            </ContactRow>
          )}
          {settings.location && <ContactRow icon={<MapPin className="size-4" />}>{settings.location}</ContactRow>}
        </Column>
      </div>

      <div className="relative border-t border-white/15">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-5 py-6 text-sm text-[#b9c5c2] sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>{settings.copyrightText ?? `© ${new Date().getFullYear()} ${settings.companyName}. All rights reserved.`}</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {legalLinks.map((link) => (
              <li key={link.id}>
                <SmartLink href={link.url} newTab={link.openInNewTab} className="transition-colors hover:text-coral">
                  {link.label}
                </SmartLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
