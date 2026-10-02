'use client';

import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import Link from 'next/link';
import { ArrowDown, ArrowLeft, ArrowUp, ExternalLink, Pencil, Plus, Search, Star, Trash2 } from 'lucide-react';
import { FormAlert } from '@/components/admin/form-alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/dialog';
import { Input, Select } from '@/components/ui/field';
import { EmptyState } from '@/components/ui/states';
import { useToast } from '@/components/ui/toast';
import { refreshContent } from '@/lib/actions';
import { ApiError, apiRequest } from '@/lib/client-api';
import { EntityForm } from './entity-form';
import { initialValues, toPayload } from './field-defs';
import type { FormValues, RelationOptions } from './field-defs';
import { useAccess } from '../access';
import { resourceCan } from '@/lib/permissions';
import { CONFIGS } from './resource-configs';
import type { Item } from './resource-configs';

const PAGE_SIZE = 10;

interface ResourceManagerProps {
  configKey: string;
  initialItems: Item[];
  relationItems?: Record<string, Item[]>;
  lockedFilter?: string;
}

export function ResourceManager({ configKey, initialItems, relationItems = {}, lockedFilter }: ResourceManagerProps) {
  const config = CONFIGS[configKey];
  const toast = useToast();
  const [items, setItems] = useState(initialItems);
  const { permissions } = useAccess();
  const mayCreate = resourceCan(permissions, config.resource, 'create');
  const mayDelete = resourceCan(permissions, config.resource, 'delete');
  const [editing, setEditing] = useState<Item | 'new' | null>(null);
  const [values, setValues] = useState<FormValues>({});
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState<ApiError | null>(null);
  const [toDelete, setToDelete] = useState<Item | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [query, setQuery] = useState('');
  const [stateFilter, setStateFilter] = useState('all');
  const [groupFilter, setGroupFilter] = useState(lockedFilter ?? 'all');
  const [page, setPage] = useState(1);

  const relationOptions: RelationOptions = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(config.relationSources ?? {}).map(([source, def]) => [source, (relationItems[def.resource] ?? []).map((item) => ({ id: item.id, label: def.label(item) }))]),
      ),
    [config, relationItems],
  );

  const stateOf = (item: Item): boolean => {
    if (!config.state) return true;
    const value = item[config.state.field];
    return config.state.kind === 'status' ? value === 'PUBLISHED' : Boolean(value);
  };

  const filtered = items.filter((item) => {
    if (config.filterBy && groupFilter !== 'all' && item[config.filterBy.field] !== groupFilter) return false;
    if (stateFilter === 'on' && !stateOf(item)) return false;
    if (stateFilter === 'off' && stateOf(item)) return false;
    const haystack = `${config.title(item)} ${config.subtitle?.(item) ?? ''}`.toLowerCase();
    return haystack.includes(query.trim().toLowerCase());
  });
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const canReorder = config.ordered && !query && stateFilter === 'all';

  async function run<T>(action: () => Promise<T>, success: string): Promise<T | null> {
    try {
      const result = await action();
      await refreshContent();
      toast.success(success);
      return result;
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : 'Something went wrong.');
      return null;
    }
  }

  function openEditor(item: Item | 'new') {
    const defaults = { ...config.defaults };
    if (item === 'new' && config.filterBy && groupFilter !== 'all') defaults[config.filterBy.field] = groupFilter;
    setValues(initialValues(config.fields, item === 'new' ? null : item, defaults));
    setApiError(null);
    setEditing(item);
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    if (saving || !editing) return;
    setSaving(true);
    setApiError(null);
    const payload = toPayload(config.fields, values);
    try {
      const saved = await (editing === 'new'
        ? apiRequest<Item>('POST', `/admin/cms/${config.resource}`, payload)
        : apiRequest<Item>('PATCH', `/admin/cms/${config.resource}/${editing.id}`, payload));
      await refreshContent();
      setItems((current) => (editing === 'new' ? [...current, saved] : current.map((item) => (item.id === saved.id ? saved : item))));
      toast.success(editing === 'new' ? 'Created.' : 'Changes saved.');
      setEditing(null);
    } catch (error) {
      setApiError(error instanceof ApiError ? error : null);
    } finally {
      setSaving(false);
    }
  }

  async function toggleState(item: Item) {
    if (!config.state) return;
    const next = config.state.kind === 'status' ? (stateOf(item) ? 'DRAFT' : 'PUBLISHED') : !stateOf(item);
    const saved = await run(() => apiRequest<Item>('PATCH', `/admin/cms/${config.resource}/${item.id}`, { [config.state!.field]: next }), 'Updated.');
    if (saved) setItems((current) => current.map((i) => (i.id === saved.id ? saved : i)));
  }

  async function toggleFeatured(item: Item) {
    const saved = await run(() => apiRequest<Item>('PATCH', `/admin/cms/${config.resource}/${item.id}`, { featured: !item.featured }), 'Updated.');
    if (saved) setItems((current) => current.map((i) => (i.id === saved.id ? saved : i)));
  }

  async function move(item: Item, delta: -1 | 1) {
    const index = filtered.findIndex((i) => i.id === item.id);
    const target = index + delta;
    if (target < 0 || target >= filtered.length) return;
    const reordered = [...filtered];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    const ids = reordered.map((i) => i.id);
    const slots = items.map((i, position) => (ids.includes(i.id) ? position : -1)).filter((position) => position >= 0);
    const next = [...items];
    slots.forEach((slot, n) => (next[slot] = reordered[n]));
    const previous = items;
    setItems(next);
    const ok = await run(() => apiRequest('PUT', `/admin/cms/${config.resource}/order`, { ids }), 'Order saved.');
    if (ok === null) setItems(previous);
  }

  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    const ok = await run(() => apiRequest('DELETE', `/admin/cms/${config.resource}/${toDelete.id}`), 'Deleted.');
    setDeleting(false);
    if (ok !== null) setItems((current) => current.filter((i) => i.id !== toDelete.id));
    setToDelete(null);
  }

  if (editing) {
    return (
      <form onSubmit={save} noValidate>
        <Button variant="ghost" size="sm" className="mb-4 -ml-3" onClick={() => setEditing(null)}>
          <ArrowLeft className="size-4" aria-hidden /> Back to {config.plural.toLowerCase()}
        </Button>
        <Card className="space-y-6 p-5 sm:p-6">
          <h2 className="text-lg font-semibold">{editing === 'new' ? `New ${config.singular}` : `Edit ${config.singular}`}</h2>
          <FormAlert error={apiError} />
          <EntityForm fields={config.fields} values={values} onChange={setValues} relationOptions={relationOptions} disabled={saving} />
        </Card>
        <div className="sticky bottom-0 -mx-4 mt-6 flex justify-end gap-3 border-t border-border bg-background/90 px-4 py-4 backdrop-blur-md sm:mx-0 sm:rounded-b-2xl">
          <Button variant="secondary" onClick={() => setEditing(null)} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            {saving ? 'Saving…' : editing === 'new' ? 'Create' : 'Save changes'}
          </Button>
        </div>
      </form>
    );
  }

  const stateLabels = config.state?.kind === 'status' ? ['Published', 'Draft / archived'] : ['Active', 'Inactive'];

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
          <Input aria-label={`Search ${config.plural}`} placeholder={`Search ${config.plural.toLowerCase()}…`} className="pl-10" value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} />
        </div>
        <div className="flex flex-wrap gap-3">
          {config.filterBy && !lockedFilter && (
            <div className="w-full sm:w-48">
              <Select aria-label={config.filterBy.label} value={groupFilter} onChange={(e) => { setGroupFilter(e.target.value); setPage(1); }}>
                <option value="all">All {config.filterBy.label.toLowerCase()}s</option>
                {config.filterBy.options.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </Select>
            </div>
          )}
          {config.state && (
            <div className="w-full sm:w-44">
              <Select aria-label="Status" value={stateFilter} onChange={(e) => { setStateFilter(e.target.value); setPage(1); }}>
                <option value="all">All statuses</option>
                <option value="on">{stateLabels[0]}</option>
                <option value="off">{stateLabels[1]}</option>
              </Select>
            </div>
          )}
          {mayCreate && (
            <Button onClick={() => openEditor('new')}>
              <Plus className="size-4" aria-hidden /> New {config.singular}
            </Button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title={items.length === 0 ? `No ${config.plural.toLowerCase()} yet` : 'No matches'}
          description={items.length === 0 ? `Create your first ${config.singular} to show it on the website.` : 'Try a different search or filter.'}
          action={items.length === 0 && mayCreate ? <Button onClick={() => openEditor('new')}>New {config.singular}</Button> : undefined}
        />
      ) : (
        <ul className="space-y-3">
          {visible.map((item) => {
            const on = stateOf(item);
            const index = filtered.findIndex((i) => i.id === item.id);
            const href = config.viewHref?.(item);
            return (
              <li key={item.id}>
                <Card className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="break-words font-medium">{config.title(item)}</p>
                      {config.state && (
                        <Badge tone={on ? 'accent' : item.status === 'ARCHIVED' ? 'danger' : 'neutral'}>
                          {config.state.kind === 'status' ? String(item.status).charAt(0) + String(item.status).slice(1).toLowerCase() : on ? 'Active' : 'Inactive'}
                        </Badge>
                      )}
                      {Boolean(item.featured) && <Badge tone="primary">Featured</Badge>}
                    </div>
                    {config.subtitle && <p className="mt-0.5 line-clamp-2 break-words text-sm text-muted">{config.subtitle(item)}</p>}
                  </div>
                  <div className="flex flex-wrap items-center gap-1">
                    {canReorder && (
                      <>
                        <Button size="sm" variant="ghost" aria-label="Move up" disabled={index === 0} onClick={() => move(item, -1)}>
                          <ArrowUp className="size-4" />
                        </Button>
                        <Button size="sm" variant="ghost" aria-label="Move down" disabled={index === filtered.length - 1} onClick={() => move(item, 1)}>
                          <ArrowDown className="size-4" />
                        </Button>
                      </>
                    )}
                    {config.featured && (
                      <Button size="sm" variant="ghost" aria-label={item.featured ? 'Remove from featured' : 'Mark as featured'} aria-pressed={Boolean(item.featured)} onClick={() => toggleFeatured(item)}>
                        <Star className={`size-4 ${item.featured ? 'fill-current text-primary' : ''}`} />
                      </Button>
                    )}
                    {config.state && (
                      <Button size="sm" variant="secondary" onClick={() => toggleState(item)}>
                        {config.state.kind === 'status' ? (on ? 'Unpublish' : 'Publish') : on ? 'Disable' : 'Enable'}
                      </Button>
                    )}
                    {href && (
                      <Link href={href} target="_blank" aria-label="View on site" className="grid size-9 place-items-center rounded-lg hover:bg-surface-strong">
                        <ExternalLink className="size-4" />
                      </Link>
                    )}
                    <Button size="sm" variant="ghost" aria-label="Edit" onClick={() => openEditor(item)}>
                      <Pencil className="size-4" />
                    </Button>
                    {mayDelete && (
                      <Button size="sm" variant="ghost" aria-label="Delete" className="text-danger" onClick={() => setToDelete(item)}>
                        <Trash2 className="size-4" />
                      </Button>
                    )}
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      )}

      {pageCount > 1 && (
        <nav aria-label="Pagination" className="mt-6 flex items-center justify-between text-sm">
          <span className="text-muted">
            Page {currentPage} of {pageCount}
          </span>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>
              Previous
            </Button>
            <Button size="sm" variant="secondary" disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)}>
              Next
            </Button>
          </div>
        </nav>
      )}

      <ConfirmDialog
        open={toDelete !== null}
        title={`Delete this ${config.singular}?`}
        description={`“${toDelete ? config.title(toDelete) : ''}” will be permanently removed from the website. This cannot be undone.${config.state?.kind === 'status' ? ' Consider archiving or unpublishing instead.' : ''}`}
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
