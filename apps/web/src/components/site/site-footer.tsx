import Link from 'next/link';
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import type { ReactNode } from 'react';
import type { SiteSettings } from '@/lib/types';
import { NAV_LINKS } from '@/lib/site';
import { Wordmark } from './wordmark';
import { FacebookIcon, GithubIcon, InstagramIcon, LinkedinIcon, TwitterIcon } from './social-icons';

function ContactRow({ icon, href, children }: { icon: ReactNode; href?: string; children: ReactNode }) {
  const content = (
    <>
      <span aria-hidden className="text-muted">
        {icon}
      </span>
      <span className="min-w-0 break-words">{children}</span>
    </>
  );
  return (
    <li>
      {href ? (
        <a href={href} className="flex items-center gap-2.5 text-sm text-muted transition-colors hover:text-foreground">
          {content}
        </a>
      ) : (
        <span className="flex items-center gap-2.5 text-sm text-muted">{content}</span>
      )}
    </li>
  );
}

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  const socials = [
    { label: 'LinkedIn', href: settings.linkedinUrl, Icon: LinkedinIcon },
    { label: 'GitHub', href: settings.githubUrl, Icon: GithubIcon },
    { label: 'X', href: settings.twitterUrl, Icon: TwitterIcon },
    { label: 'Facebook', href: settings.facebookUrl, Icon: FacebookIcon },
    { label: 'Instagram', href: settings.instagramUrl, Icon: InstagramIcon },
  ].filter((social): social is typeof social & { href: string } => Boolean(social.href));
  const whatsappDigits = settings.whatsapp?.replace(/\D/g, '');

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-5 py-14 sm:px-8 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr]">
        <div className="max-w-sm">
          <Wordmark name={settings.brandName} />
          <p className="mt-4 text-sm font-medium">{settings.companyName}</p>
          <p className="mt-1 text-sm text-muted">{settings.tagline}</p>
          {socials.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2">
              {socials.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="grid size-10 place-items-center rounded-lg border border-border bg-background text-muted transition-colors hover:text-foreground">
                    <Icon className="size-4" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <nav aria-label="Footer">
          <h2 className="text-sm font-semibold">Explore</h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5 sm:max-w-xs">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-muted transition-colors hover:text-foreground">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-semibold">Get in touch</h2>
          <ul className="mt-4 space-y-3">
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
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-5 py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>
            &copy; {new Date().getFullYear()} {settings.companyName}. All rights reserved.
          </p>
          <ul className="flex gap-5">
            <li>
              <Link href="/privacy" className="hover:text-foreground">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-foreground">
                Terms
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
