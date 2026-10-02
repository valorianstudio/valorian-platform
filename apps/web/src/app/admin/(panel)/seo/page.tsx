import type { Metadata } from 'next';
import { SeoManager } from '@/components/admin/seo/seo-manager';
import type { PageSeoRow } from '@/components/admin/seo/seo-manager';
import { PageHeader } from '@/components/ui/page-header';
import { ErrorState } from '@/components/ui/states';
import { getAdminJson } from '@/lib/server-api';

export const metadata: Metadata = { title: 'SEO' };

const PAGES: [string, string][] = [
  ['HOME', 'Homepage'],
  ['ABOUT', 'About'],
  ['SERVICES', 'Services'],
  ['SOLUTIONS', 'Solutions'],
  ['DEMOS', 'Demos'],
  ['CASE_STUDIES', 'Case studies'],
  ['INSIGHTS', 'Insights'],
  ['CONTACT', 'Contact'],
  ['ESTIMATE', 'Estimator'],
];

export default async function Page() {
  const [settings, ...pages] = await Promise.all([getAdminJson<Record<string, unknown>>('/admin/seo'), ...PAGES.map(([key]) => getAdminJson<Record<string, unknown>>(`/admin/pages/${key.toLowerCase()}`))]);
  if (!settings) return <ErrorState title="Could not load SEO settings" description="Reload the page to try again." />;
  const rows: PageSeoRow[] = PAGES.map(([key, label], index) => ({ key, label, values: pages[index] ?? {} }));

  return (
    <>
      <PageHeader title="SEO" description="Search and social sharing defaults for the whole site." />
      <SeoManager settings={settings} pages={rows} />
    </>
  );
}
