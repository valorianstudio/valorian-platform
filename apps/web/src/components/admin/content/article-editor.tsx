'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ExternalLink, Eye } from 'lucide-react';
import { FieldsTab } from '@/components/admin/cms/editor-kit';
import type { FieldDef, Option, RelationOptions } from '@/components/admin/cms/field-defs';
import { SEO_FIELDS } from '@/components/admin/cms/resource-configs';
import { Tabs } from '@/components/ui/tabs';
import { apiRequest } from '@/lib/client-api';

interface Named {
  id: string;
  name: string;
}

export interface ArticleFull extends Record<string, unknown> {
  id: string;
  slug: string;
  title: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}

export function ArticleEditor({ article, lookups }: { article: ArticleFull | null; lookups: { categories: Named[]; services: Named[]; industries: Named[] } }) {
  const router = useRouter();
  const categoryOptions: Option[] = useMemo(() => [{ value: '', label: 'No category' }, ...lookups.categories.map((c) => ({ value: c.id, label: c.name }))], [lookups.categories]);
  const relationOptions: RelationOptions = {
    services: lookups.services.map((s) => ({ id: s.id, label: s.name })),
    industries: lookups.industries.map((s) => ({ id: s.id, label: s.name })),
  };

  const content: FieldDef[] = [
    { kind: 'text', name: 'title', label: 'Title', required: true, max: 160 },
    { kind: 'textarea', name: 'excerpt', label: 'Excerpt', required: true, max: 300, rows: 2, hint: 'Shown on cards, under the title and as the default description.' },
    { kind: 'markdown', name: 'content', label: 'Article', rows: 22 },
  ];
  const details: FieldDef[] = [
    { kind: 'text', name: 'slug', label: 'URL slug', half: true, hint: 'Leave empty to generate. Changing it breaks existing links.' },
    { kind: 'select', name: 'categoryId', label: 'Category', options: categoryOptions, half: true },
    { kind: 'lines', name: 'tags', label: 'Tags', hint: 'One per line, up to 10. New tags are created automatically.' },
    { kind: 'image', name: 'featuredImageUrl', label: 'Featured image', half: true },
    { kind: 'text', name: 'featuredImageAlt', label: 'Featured image alt text', max: 160, half: true },
    { kind: 'heading', name: 'author', label: 'Author', hint: 'Leave the name empty to use your admin name.' },
    { kind: 'text', name: 'authorName', label: 'Author name', max: 80, half: true },
    { kind: 'text', name: 'authorBio', label: 'Short bio', max: 300, half: true },
    { kind: 'image', name: 'authorAvatarUrl', label: 'Author photo' },
    { kind: 'heading', name: 'related', label: 'Related content', hint: 'Shows this article on the matching service and solution pages.' },
    { kind: 'relations', name: 'serviceIds', label: 'Related services', source: 'services' },
    { kind: 'relations', name: 'industryIds', label: 'Related industries', source: 'industries' },
  ];
  const publishing: FieldDef[] = [
    { kind: 'select', name: 'status', label: 'Status', half: true, options: [{ value: 'DRAFT', label: 'Draft' }, { value: 'PUBLISHED', label: 'Published' }, { value: 'ARCHIVED', label: 'Archived' }] },
    { kind: 'date', name: 'publishedAt', label: 'Publish date', half: true, hint: 'Set a future date to schedule: the article goes live automatically at that time.' },
    { kind: 'switch', name: 'featured', label: 'Featured', description: 'Shown at the top of Insights and preferred on the homepage.' },
  ];

  if (!article) {
    return (
      <div>
        <Link href="/admin/insights" className="mb-3 inline-flex items-center gap-1 py-2 text-sm text-muted transition-colors hover:text-foreground">
          <ArrowLeft className="size-4" aria-hidden /> Back to insights
        </Link>
        <FieldsTab
          fields={content}
          initial={null}
          label="Create draft"
          onSave={async (payload, saver) => {
            const created = await saver.save(() => apiRequest<{ id: string }>('POST', '/admin/articles', { ...payload, status: 'DRAFT' }), 'Draft created. Continue editing below.');
            if (created) router.replace(`/admin/insights/${created.id}/edit`);
          }}
        />
      </div>
    );
  }

  const tab = (fields: FieldDef[], message: string, options?: RelationOptions) => (
    <FieldsTab
      fields={fields}
      initial={article}
      relationOptions={options}
      onSave={async (payload, saver) => {
        await saver.save(() => apiRequest('PATCH', `/admin/articles/${article.id}`, payload), message);
      }}
    />
  );

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <Link href="/admin/insights" className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground">
          <ArrowLeft className="size-4" aria-hidden /> Back to insights
        </Link>
        <span className="flex gap-4 text-sm font-medium text-primary">
          <Link href={`/admin/preview/insights/${article.id}`} target="_blank" className="inline-flex items-center gap-1">
            <Eye className="size-4" aria-hidden /> Preview
          </Link>
          {article.status === 'PUBLISHED' && (
            <Link href={`/insights/${article.slug}`} target="_blank" className="inline-flex items-center gap-1">
              View on site <ExternalLink className="size-4" aria-hidden />
            </Link>
          )}
        </span>
      </div>
      <Tabs
        items={[
          { id: 'content', label: 'Content', content: tab(content, 'Article saved.') },
          { id: 'details', label: 'Details', content: tab(details, 'Details saved.', relationOptions) },
          { id: 'seo', label: 'SEO', content: tab(SEO_FIELDS, 'SEO saved.') },
          { id: 'publishing', label: 'Publishing', content: tab(publishing, 'Publishing settings saved.') },
        ]}
      />
    </div>
  );
}
