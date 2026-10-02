import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { ToastProvider } from '@/components/ui/toast';
import { getSeoConfig } from '@/lib/cms';
import { SITE_URL } from '@/lib/site';
import { getSiteSettings } from '@/lib/server-api';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export async function generateMetadata(): Promise<Metadata> {
  const [settings, seo] = await Promise.all([getSiteSettings(), getSeoConfig()]);
  const siteName = seo?.siteName || settings.companyName;
  const template = (seo?.titleTemplate ?? '%s | {site}').replace('{site}', siteName);
  const title = seo?.defaultTitle || `${settings.companyName} | ${settings.tagline}`;
  const description = seo?.defaultDescription || settings.description;
  const base = seo?.canonicalBaseUrl || SITE_URL;
  const image = seo?.defaultOgImageUrl ?? undefined;
  const handle = seo?.twitterHandle ? `@${seo.twitterHandle}` : undefined;

  return {
    metadataBase: new URL(base),
    title: { default: title, template },
    description,
    applicationName: siteName,
    openGraph: { type: 'website', siteName, title, description, url: base, images: image ? [{ url: image }] : undefined },
    twitter: { card: image ? 'summary_large_image' : 'summary', site: handle, images: image ? [image] : undefined },
    alternates: { canonical: '/' },
    robots: seo?.allowIndexing === false ? { index: false, follow: false } : undefined,
    icons: settings.faviconUrl ? { icon: settings.faviconUrl } : undefined,
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#080d1a' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
