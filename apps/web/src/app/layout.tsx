import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { ToastProvider } from '@/components/ui/toast';
import { SITE_URL } from '@/lib/site';
import { getSiteSettings } from '@/lib/server-api';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: `${settings.companyName} | ${settings.tagline}`, template: `%s | ${settings.companyName}` },
    description: settings.description,
    applicationName: settings.companyName,
    openGraph: {
      type: 'website',
      siteName: settings.companyName,
      title: `${settings.companyName} | ${settings.tagline}`,
      description: settings.description,
      url: SITE_URL,
    },
    twitter: { card: 'summary_large_image' },
    alternates: { canonical: '/' },
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
