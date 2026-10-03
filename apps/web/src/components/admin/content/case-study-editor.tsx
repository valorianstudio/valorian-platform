'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Eye, ExternalLink } from 'lucide-react';
import { CollectionTab, FieldsTab } from '@/components/admin/cms/editor-kit';
import type { FieldDef, Option, RelationOptions } from '@/components/admin/cms/field-defs';
import { SEO_FIELDS } from '@/components/admin/cms/resource-configs';
import { Tabs } from '@/components/ui/tabs';
import { apiRequest } from '@/lib/client-api';

interface Named {
  id: string;
  name: string;
}

export interface CaseStudyFull extends Record<string, unknown> {
  id: string;
  slug: string;
  title: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  media: Record<string, unknown>[];
}

interface Lookups {
  industries: Named[];
  services: Named[];
  technologies: Named[];
  demos: Named[];
}

const toOptions = (items: Named[]): Option[] => [{ value: '', label: 'None' }, ...items.map((i) => ({ value: i.id, label: i.name }))];
const toRelation = (items: Named[]) => items.map((i) => ({ id: i.id, label: i.name }));

export function CaseStudyEditor({ study, lookups }: { study: CaseStudyFull | null; lookups: Lookups }) {
  const router = useRouter();

  const overview: FieldDef[] = useMemo(
    () => [
      { kind: 'text', name: 'title', label: 'Title', required: true, max: 120 },
      { kind: 'text', name: 'slug', label: 'URL slug', half: true, hint: 'Leave empty to generate. Changing it breaks existing links.' },
      { kind: 'text', name: 'projectType', label: 'Project type', max: 80, half: true, hint: 'For example “Web application”.' },
      { kind: 'textarea', name: 'shortDescription', label: 'Short description', required: true, max: 240, rows: 2, hint: 'Shown on cards and in search results.' },
      { kind: 'textarea', name: 'fullOverview', label: 'Project overview', max: 6000, rows: 6 },
      { kind: 'image', name: 'coverImageUrl', label: 'Cover image', half: true, hint: 'Used on cards.' },
      { kind: 'image', name: 'featuredImageUrl', label: 'Featured image', half: true, hint: 'Large hero image. Falls back to the cover.' },
      { kind: 'url', name: 'videoUrl', label: 'Video URL', placeholder: 'https://…' },
    ],
    [],
  );
  const client: FieldDef[] = [
    { kind: 'text', name: 'clientName', label: 'Client name', max: 100, half: true },
    { kind: 'select', name: 'industryId', label: 'Industry', options: toOptions(lookups.industries), half: true },
    { kind: 'image', name: 'clientLogoUrl', label: 'Client logo' },
    { kind: 'switch', name: 'clientApproved', label: 'This is real client work approved for public display', description: 'Required before publishing. Never publish invented projects or clients.' },
  ];
  const story: FieldDef[] = [
    { kind: 'textarea', name: 'challenge', label: 'Challenge', max: 3000, rows: 5 },
    { kind: 'textarea', name: 'solution', label: 'Solution', max: 3000, rows: 5 },
    { kind: 'textarea', name: 'approach', label: 'Process / approach', max: 3000, rows: 5 },
    { kind: 'lines', name: 'keyFeatures', label: 'Key features' },
  ];
  const delivery: FieldDef[] = [
    { kind: 'relations', name: 'serviceIds', label: 'Services delivered', source: 'services' },
    { kind: 'relations', name: 'technologyIds', label: 'Technology stack', source: 'technologies' },
    { kind: 'relations', name: 'demoIds', label: 'Related demos', source: 'demos', hint: 'Only published demos are shown. Testimonials are linked from the Testimonials page (choose the related case study there).' },
  ];
  const results: FieldDef[] = [
    {
      kind: 'items',
      name: 'results',
      label: 'Results',
      addLabel: 'Add result',
      hint: 'Add only real, verified outcomes. Leave empty if there are none; the section is hidden.',
      fields: [
        { name: 'value', label: 'Value (e.g. 40%)', kind: 'text' },
        { name: 'label', label: 'Label', kind: 'text' },
        { name: 'description', label: 'Description', kind: 'textarea' },
      ],
    },
  ];
  const cta: FieldDef[] = [
    { kind: 'text', name: 'ctaLabel', label: 'Button label', max: 60, half: true, hint: 'Default: Start a Project' },
    { kind: 'url', name: 'ctaUrl', label: 'Button URL', half: true, placeholder: '/contact' },
  ];
  const publishing: FieldDef[] = [
    { kind: 'select', name: 'status', label: 'Status', half: true, options: [{ value: 'DRAFT', label: 'Draft' }, { value: 'PUBLISHED', label: 'Published' }, { value: 'ARCHIVED', label: 'Archived' }] },
    { kind: 'date', name: 'publishedAt', label: 'Publish date', half: true, hint: 'Set a future date to schedule: it goes live automatically at that time.' },
    { kind: 'switch', name: 'featured', label: 'Featured', description: 'Shown on the homepage and first in the list.' },
  ];
  const mediaField = {
    kind: 'items',
    name: 'rows',
    label: 'Screenshots and media',
    addLabel: 'Add image',
    fields: [
      { name: 'url', label: 'Image', kind: 'image' as const },
      { name: 'kind', label: 'Type', kind: 'select' as const, options: [{ value: 'DESKTOP', label: 'Desktop' }, { value: 'MOBILE', label: 'Mobile' }, { value: 'DIAGRAM', label: 'Diagram' }, { value: 'PRODUCT', label: 'Product' }] },
      { name: 'altText', label: 'Alt text', kind: 'text' as const },
      { name: 'caption', label: 'Caption', kind: 'text' as const },
      { name: 'featured', label: 'Featured', kind: 'switch' as const },
      { name: 'active', label: 'Active', kind: 'switch' as const, default: true },
    ],
  } satisfies FieldDef;
  const relationOptions: RelationOptions = { services: toRelation(lookups.services), technologies: toRelation(lookups.technologies), demos: toRelation(lookups.demos) };

  if (!study) {
    return (
      <div>
        <Link href="/admin/case-studies" className="mb-3 inline-flex items-center gap-1 py-2 text-sm text-muted transition-colors hover:text-foreground">
          <ArrowLeft className="size-4" aria-hidden /> Back to case studies
        </Link>
        <FieldsTab
          fields={overview.filter((f) => ['title', 'slug', 'shortDescription', 'projectType'].includes(f.name))}
          initial={null}
          label="Create case study"
          onSave={async (payload, saver) => {
            const created = await saver.save(() => apiRequest<{ id: string }>('POST', '/admin/case-studies', { ...payload, status: 'DRAFT' }), 'Draft created. Continue editing below.');
            if (created) router.replace(`/admin/case-studies/${created.id}/edit`);
          }}
        />
      </div>
    );
  }

  const patch = (message: string) => async (payload: Record<string, unknown>, saver: Parameters<Parameters<typeof FieldsTab>[0]['onSave']>[1]) => {
    await saver.save(() => apiRequest('PATCH', `/admin/case-studies/${study.id}`, payload), message);
  };
  const tab = (fields: FieldDef[], message: string, options?: RelationOptions) => <FieldsTab fields={fields} initial={study} onSave={patch(message)} relationOptions={options} />;

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <Link href="/admin/case-studies" className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground">
          <ArrowLeft className="size-4" aria-hidden /> Back to case studies
        </Link>
        <span className="flex gap-4 text-sm font-medium text-primary">
          <Link href={`/admin/preview/case-studies/${study.id}`} target="_blank" className="inline-flex items-center gap-1">
            <Eye className="size-4" aria-hidden /> Preview
          </Link>
          {study.status === 'PUBLISHED' && (
            <Link href={`/case-studies/${study.slug}`} target="_blank" className="inline-flex items-center gap-1">
              View on site <ExternalLink className="size-4" aria-hidden />
            </Link>
          )}
        </span>
      </div>
      <Tabs
        items={[
          { id: 'overview', label: 'Overview', content: tab(overview, 'Overview saved.') },
          { id: 'client', label: 'Client & industry', content: tab(client, 'Client details saved.') },
          { id: 'story', label: 'Challenge & solution', content: tab(story, 'Story saved.') },
          { id: 'delivery', label: 'Services & tech', content: tab(delivery, 'Saved.', relationOptions) },
          { id: 'results', label: 'Results', content: tab(results, 'Results saved.') },
          { id: 'media', label: 'Media', content: <CollectionTab endpoint={`/admin/case-studies/${study.id}/media`} field={mediaField} initial={study.media} hint="Use alt text that describes each image. Uploaded images come from the shared media library." /> },
          { id: 'cta', label: 'CTA', content: tab(cta, 'CTA saved.') },
          { id: 'seo', label: 'SEO', content: tab(SEO_FIELDS, 'SEO saved.') },
          { id: 'publishing', label: 'Publishing', content: tab(publishing, 'Publishing settings saved.') },
        ]}
      />
    </div>
  );
}
