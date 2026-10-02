'use client';

import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Copy, ExternalLink, Trash2 } from 'lucide-react';
import { FormAlert } from '@/components/admin/form-alert';
import { EntityForm } from '@/components/admin/cms/entity-form';
import { initialValues, toPayload } from '@/components/admin/cms/field-defs';
import type { FieldDef, FormValues, Option, RelationOptions } from '@/components/admin/cms/field-defs';
import { SEO_FIELDS } from '@/components/admin/cms/resource-configs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/field';
import { Tabs } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/toast';
import { refreshContent } from '@/lib/actions';
import { ApiError, apiRequest } from '@/lib/client-api';
import { ICON_OPTIONS } from '@/lib/icon-names';
import type { DemoFull, DemoPlatformData, NamedRef } from './types';

interface Lookups {
  categories: NamedRef[];
  industries: NamedRef[];
  technologies: NamedRef[];
  demos: NamedRef[];
  features: NamedRef[];
}

const opt = (items: NamedRef[], none: string): Option[] => [{ value: '', label: none }, ...items.map((i) => ({ value: i.id, label: i.name }))];
const iconOptions: Option[] = [{ value: '', label: 'None' }, ...ICON_OPTIONS];
const platformOptions: Option[] = [
  { value: 'WEBSITE', label: 'Website' },
  { value: 'MOBILE', label: 'Mobile App' },
  { value: 'BOTH', label: 'Both' },
];

/** Shared save plumbing: busy flag, error banner, success toast, public cache refresh. */
function useSaver() {
  const toast = useToast();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  async function save<T>(action: () => Promise<T>, message: string): Promise<T | null> {
    if (saving) return null;
    setSaving(true);
    setError(null);
    try {
      const result = await action();
      await refreshContent();
      toast.success(message);
      return result;
    } catch (e) {
      setError(e instanceof ApiError ? e : new ApiError('Something went wrong.', 0));
      return null;
    } finally {
      setSaving(false);
    }
  }
  return { saving, error, save };
}

function TabCard({ children, error, footer }: { children: ReactNode; error: ApiError | null; footer: ReactNode }) {
  return (
    <Card className="space-y-6 p-4 sm:p-6">
      <FormAlert error={error} />
      {children}
      <div>{footer}</div>
    </Card>
  );
}

function FieldsTab({ fields, initial, onSave, label = 'Save', relationOptions }: { fields: FieldDef[]; initial: Record<string, unknown> | null; onSave: (payload: Record<string, unknown>, saver: ReturnType<typeof useSaver>) => Promise<void>; label?: string; relationOptions?: RelationOptions }) {
  const saver = useSaver();
  const [values, setValues] = useState<FormValues>(() => initialValues(fields, initial, { featured: false, active: true, noindex: false }));
  return (
    <TabCard error={saver.error} footer={<Button loading={saver.saving} onClick={() => onSave(toPayload(fields, values), saver)}>{saver.saving ? 'Saving…' : label}</Button>}>
      <EntityForm fields={fields} values={values} onChange={setValues} disabled={saver.saving} relationOptions={relationOptions} />
    </TabCard>
  );
}

function PlatformCard({ demoId, type, data, technologies }: { demoId: string; type: 'WEBSITE' | 'MOBILE'; data: DemoPlatformData | undefined; technologies: NamedRef[] }) {
  const mobile = type === 'MOBILE';
  const saver = useSaver();
  const common: FieldDef[] = [
    { kind: 'text', name: 'title', label: mobile ? 'Mobile-specific title' : 'Website-specific title', max: 120, hint: 'Optional.' },
    { kind: 'textarea', name: 'description', label: 'Description', max: 2000, rows: 4 },
    { kind: 'url', name: 'demoUrl', label: mobile ? 'Mobile demo URL' : 'Website demo URL', placeholder: 'https://…', half: true },
    { kind: 'url', name: 'videoUrl', label: 'Video URL', placeholder: 'https://…', half: true },
    { kind: 'text', name: 'ctaLabel', label: 'CTA label', max: 60, half: true },
    { kind: 'url', name: 'ctaUrl', label: 'CTA URL', half: true },
    ...(mobile
      ? ([
          { kind: 'switch', name: 'android', label: 'Android available', half: true },
          { kind: 'switch', name: 'ios', label: 'iOS available', half: true },
          { kind: 'url', name: 'playStoreUrl', label: 'Play Store URL', placeholder: 'https://…', half: true },
          { kind: 'url', name: 'appStoreUrl', label: 'App Store URL', placeholder: 'https://…', half: true },
        ] satisfies FieldDef[])
      : []),
    { kind: 'relations', name: 'technologyIds', label: 'Technologies', source: 'technologies' },
    { kind: 'textarea', name: 'notes', label: 'Internal notes', max: 1000, rows: 2, hint: 'Never shown publicly.' },
  ];
  const [enabled, setEnabled] = useState(data?.enabled ?? false);
  const [values, setValues] = useState<FormValues>(() => initialValues(common, data as unknown as Record<string, unknown> | null));

  return (
    <Card className="space-y-6 p-4 sm:p-6">
      <FormAlert error={saver.error} />
      <Switch label={mobile ? 'Mobile App enabled' : 'Website enabled'} description="Disabling keeps the content below but hides it publicly." checked={enabled} onChange={setEnabled} disabled={saver.saving} />
      {enabled && <EntityForm fields={common} values={values} onChange={setValues} disabled={saver.saving} relationOptions={{ technologies: technologies.map((t) => ({ id: t.id, label: t.name })) }} />}
      <Button
        loading={saver.saving}
        onClick={() =>
          saver.save(() => apiRequest('PUT', `/admin/demos/${demoId}/platforms/${type.toLowerCase()}`, { ...toPayload(common, values), enabled }), `${mobile ? 'Mobile' : 'Website'} saved.`)
        }
      >
        {saver.saving ? 'Saving…' : `Save ${mobile ? 'mobile app' : 'website'}`}
      </Button>
    </Card>
  );
}

function CollectionTab({ demoId, collection, field, initial, hint }: { demoId: string; collection: string; field: FieldDef & { kind: 'items' }; initial: Record<string, unknown>[]; hint: string }) {
  const saver = useSaver();
  const fields = [field];
  const [values, setValues] = useState<FormValues>(() => initialValues(fields, { rows: initial }));
  return (
    <TabCard
      error={saver.error}
      footer={<Button loading={saver.saving} onClick={() => saver.save(() => apiRequest('PUT', `/admin/demos/${demoId}/${collection}`, values.rows), 'Saved.')}>{saver.saving ? 'Saving…' : 'Save'}</Button>}
    >
      <p className="text-sm text-muted">{hint}</p>
      <EntityForm fields={fields} values={values} onChange={setValues} disabled={saver.saving} />
    </TabCard>
  );
}

export function DemoEditor({ demo, lookups }: { demo: DemoFull | null; lookups: Lookups }) {
  const router = useRouter();
  const toast = useToast();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const general: FieldDef[] = useMemo(
    () => [
      { kind: 'text', name: 'name', label: 'Demo name', required: true, max: 100, half: true },
      { kind: 'text', name: 'internalName', label: 'Internal name', max: 100, half: true, hint: 'Optional. Never shown publicly.' },
      { kind: 'text', name: 'slug', label: 'URL slug', half: true, hint: 'Leave empty to generate from the name. Changing it breaks existing links.' },
      { kind: 'text', name: 'badge', label: 'Badge', max: 30, half: true, hint: 'For example “School Management”.' },
      { kind: 'textarea', name: 'shortDescription', label: 'Short description', required: true, max: 220, rows: 2 },
      { kind: 'select', name: 'categoryId', label: 'Category', options: opt(lookups.categories, 'No category'), half: true },
      { kind: 'select', name: 'industryId', label: 'Industry', options: opt(lookups.industries, 'No industry'), half: true },
      { kind: 'image', name: 'coverImageUrl', label: 'Cover image', half: true },
      { kind: 'image', name: 'thumbnailUrl', label: 'Thumbnail', half: true, hint: 'Used on cards. Falls back to the cover image.' },
      { kind: 'number', name: 'displayOrder', label: 'Display order', half: true, hint: 'Lower numbers appear first.' },
      { kind: 'switch', name: 'featured', label: 'Featured', description: 'Shown on the homepage and at the top of /demos.' },
      { kind: 'switch', name: 'active', label: 'Active', description: 'Inactive demos are hidden even when published.' },
    ],
    [lookups],
  );

  async function createDemo(payload: Record<string, unknown>, saver: ReturnType<typeof useSaver>) {
    const created = await saver.save(() => apiRequest<{ id: string }>('POST', '/admin/demos', { fullDescription: '', outcomes: [], relatedIds: [], status: 'DRAFT', statusLabel: 'PROTOTYPE', noindex: false, ...payload }), 'Demo created. Continue editing below.');
    if (created) router.replace(`/admin/demos/${created.id}/edit`);
  }

  if (!demo) {
    return (
      <div>
        <Link href="/admin/demos" className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-foreground">
          <ArrowLeft className="size-4" aria-hidden /> Back to demos
        </Link>
        <FieldsTab fields={general} initial={null} label="Create demo" onSave={createDemo} />
      </div>
    );
  }

  const patch = (message: string) => async (payload: Record<string, unknown>, saver: ReturnType<typeof useSaver>) => {
    await saver.save(() => apiRequest('PATCH', `/admin/demos/${demo.id}`, payload), message);
  };

  const overview: FieldDef[] = [
    { kind: 'textarea', name: 'fullDescription', label: 'Full overview', max: 6000, rows: 6 },
    { kind: 'textarea', name: 'problem', label: 'Business problem', max: 1500, rows: 3, half: true },
    { kind: 'textarea', name: 'solution', label: 'Proposed solution', max: 1500, rows: 3, half: true },
    { kind: 'textarea', name: 'targetUsers', label: 'Target users', max: 500, rows: 2, half: true },
    { kind: 'textarea', name: 'targetBusinesses', label: 'Target businesses', max: 500, rows: 2, half: true },
    { kind: 'lines', name: 'outcomes', label: 'Key outcomes' },
    { kind: 'text', name: 'highlight', label: 'Highlight text', max: 160, hint: 'Optional callout shown in the overview.' },
  ];
  const publishing: FieldDef[] = [
    { kind: 'select', name: 'status', label: 'Status', half: true, options: [{ value: 'DRAFT', label: 'Draft' }, { value: 'PUBLISHED', label: 'Published' }, { value: 'ARCHIVED', label: 'Archived' }] },
    {
      kind: 'select',
      name: 'statusLabel',
      label: 'Public label',
      half: true,
      options: [
        { value: 'INTERACTIVE_CONCEPT', label: 'Interactive concept' },
        { value: 'PROTOTYPE', label: 'Prototype' },
        { value: 'DEMO_PRODUCT', label: 'Demo product' },
        { value: 'PRODUCTION_EXAMPLE', label: 'Production example' },
      ],
      hint: 'Be accurate: do not label concepts as real client projects.',
    },
    { kind: 'text', name: 'ctaLabel', label: 'CTA label', max: 60, half: true, hint: 'Default: Discuss this solution' },
    { kind: 'url', name: 'ctaUrl', label: 'CTA URL', half: true, hint: 'Default: /contact' },
  ];
  const relatedFields: FieldDef[] = [{ kind: 'relations', name: 'relatedIds', label: 'Related demos', source: 'demos', hint: 'Only published demos are shown publicly.' }];
  const relatedOptions: RelationOptions = { demos: lookups.demos.filter((d) => d.id !== demo.id).map((d) => ({ id: d.id, label: d.name })) };
  const estimatorFields: FieldDef[] = [{ kind: 'relations', name: 'estimatorFeatureIds', label: 'Estimator features', source: 'features', hint: 'Preselected when a visitor clicks Estimate This Project on this demo. They can still add or remove features.' }];
  const estimatorOptions: RelationOptions = { features: lookups.features.map((f) => ({ id: f.id, label: f.name })) };
  const platform = (type: 'WEBSITE' | 'MOBILE') => demo.platforms.find((p) => p.type === type);

  const featureFields = (kind: 'features' | 'modules') =>
    ({
      kind: 'items',
      name: 'rows',
      label: kind === 'features' ? 'Features' : 'Modules',
      addLabel: kind === 'features' ? 'Add feature' : 'Add module',
      fields: [
        { name: 'title', label: 'Title', kind: 'text' },
        { name: 'platform', label: 'Platform', kind: 'select', options: platformOptions, default: 'BOTH' },
        { name: 'description', label: 'Description', kind: 'textarea' },
        { name: 'icon', label: 'Icon', kind: 'select', options: iconOptions },
        ...(kind === 'features' ? [{ name: 'featured', label: 'Featured', kind: 'switch' as const }] : []),
        { name: 'active', label: 'Active', kind: 'switch' as const, default: true },
      ],
    }) satisfies FieldDef;

  const screenshotsField = {
    kind: 'items',
    name: 'rows',
    label: 'Screenshots',
    addLabel: 'Add screenshot',
    fields: [
      { name: 'url', label: 'Image', kind: 'image' as const },
      { name: 'platform', label: 'Platform', kind: 'select' as const, options: [{ value: 'WEBSITE', label: 'Website' }, { value: 'MOBILE', label: 'Mobile App' }] },
      {
        name: 'kind',
        label: 'Device / type',
        kind: 'select' as const,
        options: ['DESKTOP', 'TABLET', 'MOBILE', 'DASHBOARD', 'ADMIN', 'CUSTOMER', 'OTHER'].map((v) => ({ value: v, label: v.charAt(0) + v.slice(1).toLowerCase() })),
      },
      { name: 'altText', label: 'Alt text', kind: 'text' as const },
      { name: 'caption', label: 'Caption', kind: 'text' as const },
      { name: 'featured', label: 'Featured', kind: 'switch' as const },
      { name: 'active', label: 'Active', kind: 'switch' as const, default: true },
    ],
  } satisfies FieldDef;

  const pointsField = {
    kind: 'items',
    name: 'rows',
    label: 'Benefits and use cases',
    addLabel: 'Add item',
    fields: [
      { name: 'type', label: 'Type', kind: 'select' as const, options: [{ value: 'BENEFIT', label: 'Benefit' }, { value: 'USE_CASE', label: 'Use case' }] },
      { name: 'title', label: 'Title', kind: 'text' as const },
      { name: 'description', label: 'Description', kind: 'textarea' as const },
      { name: 'active', label: 'Active', kind: 'switch' as const, default: true },
    ],
  } satisfies FieldDef;

  async function duplicate() {
    try {
      const copy = await apiRequest<{ id: string }>('POST', `/admin/demos/${demo!.id}/duplicate`);
      await refreshContent();
      toast.success('Duplicated as a draft.');
      router.push(`/admin/demos/${copy.id}/edit`);
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Could not duplicate.');
    }
  }

  async function remove() {
    setDeleting(true);
    try {
      await apiRequest('DELETE', `/admin/demos/${demo!.id}`);
      await refreshContent();
      toast.success('Demo deleted.');
      router.replace('/admin/demos');
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Could not delete.');
      setDeleting(false);
      setConfirmDelete(false);
    }
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <Link href="/admin/demos" className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground">
          <ArrowLeft className="size-4" aria-hidden /> Back to demos
        </Link>
        {demo.status === 'PUBLISHED' && (
          <Link href={`/demos/${demo.slug}`} target="_blank" className="inline-flex items-center gap-1 text-sm font-medium text-primary">
            View on site <ExternalLink className="size-4" aria-hidden />
          </Link>
        )}
      </div>
      <Tabs
        items={[
          { id: 'general', label: 'General', content: <FieldsTab fields={general} initial={demo} onSave={patch('General saved.')} /> },
          { id: 'overview', label: 'Overview', content: <FieldsTab fields={overview} initial={demo} onSave={patch('Overview saved.')} /> },
          {
            id: 'platforms',
            label: 'Platforms',
            content: (
              <>
                <PlatformCard demoId={demo.id} type="WEBSITE" data={platform('WEBSITE')} technologies={lookups.technologies} />
                <PlatformCard demoId={demo.id} type="MOBILE" data={platform('MOBILE')} technologies={lookups.technologies} />
              </>
            ),
          },
          { id: 'features', label: 'Features', content: <CollectionTab demoId={demo.id} collection="features" field={featureFields('features')} initial={demo.features} hint="Features appear in the platform they are assigned to. Use the arrows to reorder." /> },
          { id: 'modules', label: 'Modules', content: <CollectionTab demoId={demo.id} collection="modules" field={featureFields('modules')} initial={demo.modules} hint="Major product modules, separate from smaller features." /> },
          { id: 'screenshots', label: 'Screenshots', content: <CollectionTab demoId={demo.id} collection="screenshots" field={screenshotsField} initial={demo.screenshots} hint="Upload PNG, JPEG, WebP or GIF up to 5 MB, or paste a hosted URL. Desktop and tablet shots belong to Website; mobile shots to Mobile App." /> },
          { id: 'points', label: 'Benefits & use cases', content: <CollectionTab demoId={demo.id} collection="points" field={pointsField} initial={demo.points} hint="Short benefit and use-case statements." /> },
          { id: 'related', label: 'Related demos', content: <FieldsTab fields={relatedFields} initial={demo} onSave={patch('Related demos saved.')} relationOptions={relatedOptions} /> },
          { id: 'estimator', label: 'Estimator', content: <FieldsTab fields={estimatorFields} initial={demo} onSave={patch('Estimator features saved.')} relationOptions={estimatorOptions} /> },
          { id: 'seo', label: 'SEO', content: <FieldsTab fields={SEO_FIELDS} initial={demo} onSave={patch('SEO saved.')} /> },
          {
            id: 'publishing',
            label: 'Publishing',
            content: (
              <>
                <FieldsTab fields={publishing} initial={demo} onSave={patch('Publishing settings saved.')} />
                <Card className="flex flex-wrap items-center gap-3 p-4 sm:p-6">
                  <p className="mr-auto text-sm text-muted">{demo.publishedAt ? `First published ${new Date(demo.publishedAt).toLocaleDateString('en')}` : 'Not published yet.'}</p>
                  <Button variant="secondary" onClick={duplicate}>
                    <Copy className="size-4" aria-hidden /> Duplicate
                  </Button>
                  <Button variant="danger" onClick={() => setConfirmDelete(true)}>
                    <Trash2 className="size-4" aria-hidden /> Delete
                  </Button>
                </Card>
              </>
            ),
          },
        ]}
      />
      <ConfirmDialog
        open={confirmDelete}
        title="Delete this demo?"
        description="The demo and all its features, modules and screenshots will be permanently removed. Consider archiving it instead."
        busy={deleting}
        onConfirm={remove}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
}
