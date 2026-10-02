import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { CaseStudyView } from '@/components/site/case-study-view';
import { PreviewBanner } from '@/components/site/preview-banner';
import type { CaseDetail } from '@/lib/cms-types';
import { getAdminJson, getCurrentAdmin, getSiteSettings } from '@/lib/server-api';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = { title: 'Case study preview', robots: { index: false, follow: false } };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!(await getCurrentAdmin())) redirect('/admin/login');
  const [raw, settings] = await Promise.all([getAdminJson<Record<string, unknown>>(`/admin/case-studies/${encodeURIComponent(id)}`), getSiteSettings()]);
  if (!raw) notFound();
  const study = {
    ...raw,
    industry: null,
    services: [],
    technologies: [],
    demos: [],
    testimonials: [],
    keyFeatures: raw.keyFeatures ?? [],
    results: raw.results ?? [],
    media: ((raw.media as (CaseDetail['media'][number] & { active?: boolean })[] | undefined) ?? []).filter((m) => m.active !== false),
  } as unknown as CaseDetail;

  return (
    <>
      <PreviewBanner status={String(raw.status)} editHref={`/admin/case-studies/${id}/edit`} />
      <CaseStudyView study={study} related={[]} baseUrl={SITE_URL} company={settings.companyName} preview />
    </>
  );
}
