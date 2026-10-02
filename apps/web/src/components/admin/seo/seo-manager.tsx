'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FieldsTab } from '@/components/admin/cms/editor-kit';
import type { FieldDef } from '@/components/admin/cms/field-defs';
import { SEO_FIELDS } from '@/components/admin/cms/resource-configs';
import { Card } from '@/components/ui/card';
import { refreshContent } from '@/lib/actions';
import { apiRequest } from '@/lib/client-api';
import { cn } from '@/lib/cn';

const GLOBAL_FIELDS: FieldDef[] = [
  { kind: 'text', name: 'siteName', label: 'Site name', max: 80, half: true, hint: 'Defaults to the company name in Settings.' },
  { kind: 'text', name: 'titleTemplate', label: 'Title template', max: 100, half: true, hint: 'Use %s for the page title and {site} for the site name.' },
  { kind: 'text', name: 'defaultTitle', label: 'Default title', max: 100, hint: 'Used on the homepage when it has no title of its own.' },
  { kind: 'textarea', name: 'defaultDescription', label: 'Default description', max: 200, rows: 2 },
  { kind: 'image', name: 'defaultOgImageUrl', label: 'Default social image', hint: 'Recommended 1200×630. Used when a page has no image of its own.' },
  { kind: 'url', name: 'canonicalBaseUrl', label: 'Canonical base URL', placeholder: 'https://valorian.studio', half: true, hint: 'Used for canonical links, the sitemap and structured data.' },
  { kind: 'text', name: 'twitterHandle', label: 'X / Twitter handle', max: 40, half: true, placeholder: 'valorianstudio' },
  { kind: 'switch', name: 'allowIndexing', label: 'Allow search engines to index the site', description: 'Turn off for staging or pre-launch. This adds noindex everywhere and blocks all crawlers in robots.txt.' },
];

export interface PageSeoRow {
  key: string;
  label: string;
  values: Record<string, unknown>;
}

export function SeoManager({ settings, pages }: { settings: Record<string, unknown>; pages: PageSeoRow[] }) {
  const [openKey, setOpenKey] = useState<string | null>(null);

  return (
    <div className="space-y-10">
      <section>
        <h2 className="mb-1 text-lg font-semibold">Global defaults</h2>
        <p className="mb-4 text-sm text-muted">Organization details such as name, email, phone, logo and social links come from Settings.</p>
        <FieldsTab
          fields={GLOBAL_FIELDS}
          initial={settings}
          label="Save defaults"
          onSave={async (payload, saver) => {
            await saver.save(() => apiRequest('PUT', '/admin/seo', payload), 'SEO defaults saved.');
          }}
        />
      </section>
      <section>
        <h2 className="mb-1 text-lg font-semibold">Page SEO</h2>
        <p className="mb-4 text-sm text-muted">Titles, descriptions and social images for top-level pages. Services, solutions, demos, case studies and articles have their own SEO tab.</p>
        <ul className="space-y-3">
          {pages.map((page) => {
            const open = openKey === page.key;
            return (
              <li key={page.key}>
                <Card>
                  <button type="button" aria-expanded={open} onClick={() => setOpenKey(open ? null : page.key)} className="flex w-full items-center justify-between gap-3 p-4 text-left">
                    <span className="min-w-0">
                      <span className="block font-medium">{page.label}</span>
                      <span className="block truncate text-sm text-muted">{(page.values.metaTitle as string | null) || 'Using the default title'}</span>
                    </span>
                    <ChevronDown className={cn('size-4 shrink-0 text-muted transition-transform', open && 'rotate-180')} aria-hidden />
                  </button>
                  {open && (
                    <div className="border-t border-border p-4">
                      <FieldsTab
                        fields={SEO_FIELDS.filter((f) => f.kind !== 'heading')}
                        initial={page.values}
                        label="Save page SEO"
                        onSave={async (payload, saver) => {
                          const saved = await saver.save(() => apiRequest('PATCH', `/admin/pages/${page.key.toLowerCase()}`, payload), `${page.label} SEO saved.`);
                          if (saved !== null) await refreshContent();
                        }}
                      />
                    </div>
                  )}
                </Card>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
