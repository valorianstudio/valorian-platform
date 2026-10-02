import type { Metadata } from 'next';
import { ResourcePage } from '@/components/admin/cms/resource-page';
import type { Item } from '@/components/admin/cms/resource-configs';
import { getAdminJson } from '@/lib/server-api';

export const metadata: Metadata = { title: 'Testimonials' };

export default async function Page() {
  const caseStudies = (await getAdminJson<Item[]>('/admin/case-studies/options')) ?? [];
  return <ResourcePage configKey="testimonials" description="Real client feedback only. Featured, active testimonials appear on the homepage." extra={{ 'case-studies-options': caseStudies }} />;
}
