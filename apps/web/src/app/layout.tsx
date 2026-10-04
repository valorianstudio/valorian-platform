import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { RevealObserver } from '@/components/site/reveal-observer';
import { ToastProvider } from '@/components/ui/toast';
import { getSeoConfig } from '@/lib/cms';
import { SITE_URL } from '@/lib/site';
import { getSiteSettings } from '@/lib/server-api';
import './globals.css';

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-inter', display: 'swap' });

const KEYWORDS = [
  'software development company',
  'custom software development',
  'SaaS development company',
  'AI development services',
  'web application development',
  'mobile app development',
  'business automation software',
  'Valorian Studio',
];

export async function generateMetadata(): Promise<Metadata> {
  const [settings, seo] = await Promise.all([getSiteSettings(), getSeoConfig()]);
  const siteName = seo?.siteName || settings.companyName;
  const template = (seo?.titleTemplate ?? '%s | {site}').replace('{site}', siteName);
  const title = seo?.defaultTitle || `Software Development Company | ${settings.companyName}`;
  const description = seo?.defaultDescription || settings.description;
  const base = seo?.canonicalBaseUrl || SITE_URL;
  const image = seo?.defaultOgImageUrl || '/brand/og.png';
  const handle = seo?.twitterHandle ? `@${seo.twitterHandle}` : undefined;

  return {
    metadataBase: new URL(base),
    title: { default: title, template },
    description,
    applicationName: siteName,
    keywords: KEYWORDS,
    authors: [{ name: siteName, url: base }],
    creator: siteName,
    publisher: siteName,
    category: 'technology',
    manifest: '/manifest.webmanifest',
    formatDetection: { telephone: false, email: false, address: false },
    // Google Search Console: set GOOGLE_SITE_VERIFICATION to the token from the "HTML tag" verification method.
    verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
    openGraph: { type: 'website', siteName, title, description, url: base, locale: 'en_US', images: [{ url: image, width: 1200, height: 630, alt: `${siteName} - software development company` }] },
    twitter: { card: 'summary_large_image', site: handle, title, description, images: [image] },
    alternates: { canonical: '/' },
    robots: seo?.allowIndexing === false ? { index: false, follow: false } : undefined,
  };
}

export const viewport: Viewport = {
  themeColor: [{ color: '#f8f4ee' }],
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'light',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <ToastProvider>{children}</ToastProvider>
        <RevealObserver />
      </body>
    </html>
  );
}
