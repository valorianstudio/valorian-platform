'use client';

import { useState } from 'react';
import { ArrowDown, ArrowUp, ChevronDown } from 'lucide-react';
import { FormAlert } from '@/components/admin/form-alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/field';
import { useToast } from '@/components/ui/toast';
import { refreshContent } from '@/lib/actions';
import { ApiError, apiRequest } from '@/lib/client-api';
import type { AdminPage } from '@/lib/cms-types';
import { cn } from '@/lib/cn';
import { EntityForm } from './entity-form';
import { initialValues, toPayload } from './field-defs';
import type { FormValues } from './field-defs';
import { SEO_FIELDS } from './resource-configs';
import { SECTION_CONFIGS } from './section-configs';

type SectionState = AdminPage['sections'][number];

function SectionCard({
  pageKey,
  section,
  index,
  total,
  onMove,
}: {
  pageKey: string;
  section: SectionState;
  index: number;
  total: number;
  onMove: (delta: -1 | 1) => void;
}) {
  const config = SECTION_CONFIGS[pageKey]?.[section.key];
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [enabled, setEnabled] = useState(section.enabled);
  const [values, setValues] = useState<FormValues>(() => (config ? initialValues(config.fields, section.content) : {}));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  if (!config) return null;

  async function save() {
    if (saving || !config) return;
    setSaving(true);
    setError(null);
    try {
      await apiRequest('PATCH', `/admin/pages/${pageKey}/sections/${section.key}`, { enabled, content: toPayload(config.fields, values) });
      await refreshContent();
      toast.success(`${config.label} saved.`);
    } catch (e) {
      setError(e instanceof ApiError ? e : null);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <div className="flex items-center gap-2 p-3 sm:p-4">
        <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} className="flex min-w-0 flex-1 items-center gap-3 rounded-lg p-1 text-left">
          <ChevronDown className={cn('size-4 shrink-0 text-muted transition-transform', open && 'rotate-180')} aria-hidden />
          <span className="min-w-0">
            <span className="flex flex-wrap items-center gap-2 font-medium">
              {config.label}
              {!enabled && <Badge>Hidden</Badge>}
            </span>
            <span className="block truncate text-sm text-muted">{config.description}</span>
          </span>
        </button>
        <Button size="sm" variant="ghost" aria-label="Move section up" disabled={index === 0} onClick={() => onMove(-1)}>
          <ArrowUp className="size-4" />
        </Button>
        <Button size="sm" variant="ghost" aria-label="Move section down" disabled={index === total - 1} onClick={() => onMove(1)}>
          <ArrowDown className="size-4" />
        </Button>
      </div>
      {open && (
        <div className="space-y-6 border-t border-border p-4 sm:p-6">
          <FormAlert error={error} />
          <Switch label="Show this section" description="Hidden sections are not rendered on the public page." checked={enabled} onChange={setEnabled} disabled={saving} />
          <EntityForm fields={config.fields} values={values} onChange={setValues} disabled={saving} />
          <Button onClick={save} loading={saving}>
            {saving ? 'Saving…' : 'Save section'}
          </Button>
        </div>
      )}
    </Card>
  );
}

export function PageEditor({ pageKey, page }: { pageKey: string; page: AdminPage }) {
  const toast = useToast();
  const [sections, setSections] = useState(() => page.sections.filter((s) => SECTION_CONFIGS[pageKey]?.[s.key]));
  const [seo, setSeo] = useState<FormValues>(() => initialValues(SEO_FIELDS, page as unknown as Record<string, unknown>));
  const [savingSeo, setSavingSeo] = useState(false);
  const [seoError, setSeoError] = useState<ApiError | null>(null);

  async function move(index: number, delta: -1 | 1) {
    const next = [...sections];
    [next[index], next[index + delta]] = [next[index + delta], next[index]];
    const previous = sections;
    setSections(next);
    try {
      await apiRequest('PUT', `/admin/pages/${pageKey}/order`, { ids: next.map((s) => s.key) });
      await refreshContent();
      toast.success('Order saved.');
    } catch {
      setSections(previous);
      toast.error('Could not save the new order.');
    }
  }

  async function saveSeo() {
    if (savingSeo) return;
    setSavingSeo(true);
    setSeoError(null);
    try {
      await apiRequest('PATCH', `/admin/pages/${pageKey}`, toPayload(SEO_FIELDS, seo));
      await refreshContent();
      toast.success('SEO saved.');
    } catch (e) {
      setSeoError(e instanceof ApiError ? e : null);
    } finally {
      setSavingSeo(false);
    }
  }

  return (
    <div className="space-y-4">
      {sections.map((section, index) => (
        <SectionCard key={section.key} pageKey={pageKey} section={section} index={index} total={sections.length} onMove={(delta) => move(index, delta)} />
      ))}
      <Card className="space-y-6 p-4 sm:p-6">
        <FormAlert error={seoError} />
        <EntityForm fields={SEO_FIELDS} values={seo} onChange={setSeo} disabled={savingSeo} />
        <Button onClick={saveSeo} loading={savingSeo}>
          {savingSeo ? 'Saving…' : 'Save SEO'}
        </Button>
      </Card>
    </div>
  );
}
