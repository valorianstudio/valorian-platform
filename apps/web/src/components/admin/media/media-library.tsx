'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Copy, Search, Trash2, Upload, X } from 'lucide-react';
import { FormAlert } from '@/components/admin/form-alert';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/dialog';
import { Field, Input, Select, Textarea } from '@/components/ui/field';
import { EmptyState } from '@/components/ui/states';
import { useToast } from '@/components/ui/toast';
import { refreshContent } from '@/lib/actions';
import { ApiError, apiGet, apiRequest, uploadImage } from '@/lib/client-api';
import { formatBytes } from './media-picker';
import type { MediaItem, MediaPage } from './media-picker';

export function MediaLibrary({ initial }: { initial: MediaPage }) {
  const toast = useToast();
  const file = useRef<HTMLInputElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [data, setData] = useState(initial);
  const [query, setQuery] = useState('');
  const [type, setType] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [deleting, setDeleting] = useState<{ item: MediaItem; message: string | null } | null>(null);

  const load = useCallback(
    async (page: number, q: string, t: string) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page: String(page) });
        if (q) params.set('q', q);
        if (t) params.set('type', t);
        setData(await apiGet<MediaPage>(`/admin/media?${params}`));
      } catch (e) {
        toast.error(e instanceof ApiError ? e.message : 'Could not load media.');
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (selected && !element.open) element.showModal();
    if (!selected && element.open) element.close();
  }, [selected]);

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    let uploaded = 0;
    try {
      for (const f of Array.from(files)) {
        await uploadImage(f);
        uploaded += 1;
      }
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Upload failed.');
    } finally {
      setUploading(false);
      if (file.current) file.current.value = '';
      if (uploaded > 0) {
        toast.success(`${uploaded} ${uploaded === 1 ? 'image' : 'images'} uploaded.`);
        await load(1, query, type);
      }
    }
  }

  async function saveMeta(form: FormData) {
    if (!selected || saving) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await apiRequest<MediaItem>('PATCH', `/admin/media/${selected.id}`, {
        altText: String(form.get('altText') ?? ''),
        title: String(form.get('title') ?? ''),
        caption: String(form.get('caption') ?? ''),
      });
      setData((d) => ({ ...d, items: d.items.map((i) => (i.id === updated.id ? updated : i)) }));
      setSelected(updated);
      await refreshContent();
      toast.success('Details saved.');
    } catch (e) {
      setError(e instanceof ApiError ? e : null);
    } finally {
      setSaving(false);
    }
  }

  async function remove(force: boolean) {
    if (!deleting) return;
    try {
      await apiRequest('DELETE', `/admin/media/${deleting.item.id}${force ? '?force=1' : ''}`);
      setData((d) => ({ ...d, items: d.items.filter((i) => i.id !== deleting.item.id), total: d.total - 1 }));
      setSelected(null);
      setDeleting(null);
      toast.success('File deleted.');
    } catch (e) {
      if (e instanceof ApiError && e.status === 409) setDeleting({ item: deleting.item, message: e.message });
      else {
        toast.error(e instanceof ApiError ? e.message : 'Could not delete the file.');
        setDeleting(null);
      }
    }
  }

  const pageCount = Math.max(1, Math.ceil(data.total / data.pageSize));

  return (
    <div>
      <div role="search" className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_11rem_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
          <Input aria-label="Search media" placeholder="Search by name, title or alt text…" className="pl-10" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && load(1, query, type)} />
        </div>
        <Select
          aria-label="File type"
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            void load(1, query, e.target.value);
          }}
        >
          <option value="">All types</option>
          <option value="image/png">PNG</option>
          <option value="image/jpeg">JPEG</option>
          <option value="image/webp">WebP</option>
          <option value="image/gif">GIF</option>
        </Select>
        <input ref={file} type="file" multiple accept="image/png,image/jpeg,image/webp,image/gif" className="sr-only" tabIndex={-1} onChange={(e) => onFiles(e.target.files)} />
        <Button loading={uploading} onClick={() => file.current?.click()}>
          <Upload className="size-4" aria-hidden /> Upload
        </Button>
      </div>
      <p className="mb-4 text-sm text-muted" aria-live="polite">
        {data.total} {data.total === 1 ? 'file' : 'files'} · PNG, JPEG, WebP or GIF up to 5 MB
      </p>

      {data.items.length === 0 ? (
        <EmptyState title={query || type ? 'No files match' : 'No media yet'} description="Upload images to reuse them across your pages, demos, case studies and articles." />
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6" aria-busy={loading}>
          {data.items.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setSelected(item);
                }}
                className="block w-full overflow-hidden rounded-xl border border-border bg-surface text-left transition-colors hover:border-primary"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.url} alt={item.altText ?? ''} loading="lazy" decoding="async" width={240} height={180} className="aspect-[4/3] w-full object-cover" />
                <span className="block truncate px-2.5 pt-2 text-xs font-medium">{item.originalFilename}</span>
                <span className="block px-2.5 pb-2 text-xs text-muted">{item.altText ? formatBytes(item.size) : `${formatBytes(item.size)} · no alt text`}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {pageCount > 1 && (
        <nav aria-label="Pagination" className="mt-6 flex items-center justify-between text-sm">
          <span className="text-muted">Page {data.page} of {pageCount}</span>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" disabled={data.page === 1 || loading} onClick={() => load(data.page - 1, query, type)}>Previous</Button>
            <Button size="sm" variant="secondary" disabled={data.page === pageCount || loading} onClick={() => load(data.page + 1, query, type)}>Next</Button>
          </div>
        </nav>
      )}

      <dialog ref={dialog} onClose={() => setSelected(null)} onClick={(e) => e.target === dialog.current && setSelected(null)} aria-label="Media details" className="m-auto max-h-[92vh] w-[calc(100%-1.5rem)] max-w-3xl overflow-y-auto rounded-2xl border border-border bg-background p-0 text-foreground shadow-2xl backdrop:bg-foreground/50">
        {selected && (
          <div className="grid grid-cols-1 gap-5 p-5 sm:p-6 md:grid-cols-[1fr_1fr]">
            <div className="min-w-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={selected.url} alt={selected.altText ?? ''} className="max-h-[50vh] w-full rounded-xl border border-border bg-surface object-contain" />
              <dl className="mt-4 space-y-1 text-sm text-muted">
                <div className="flex justify-between gap-3"><dt>File</dt><dd className="truncate text-foreground">{selected.originalFilename}</dd></div>
                <div className="flex justify-between gap-3"><dt>Type</dt><dd className="text-foreground">{selected.mimeType}</dd></div>
                <div className="flex justify-between gap-3"><dt>Size</dt><dd className="text-foreground">{formatBytes(selected.size)}{selected.width ? ` · ${selected.width}×${selected.height}` : ''}</dd></div>
              </dl>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void saveMeta(new FormData(e.currentTarget));
              }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold">Details</h2>
                <button type="button" onClick={() => setSelected(null)} aria-label="Close" className="grid size-9 place-items-center rounded-lg hover:bg-surface-strong"><X className="size-5" aria-hidden /></button>
              </div>
              <FormAlert error={error} />
              <Field label="Alt text" hint="Describe the image for screen readers and search engines.">{(p) => <Input {...p} name="altText" defaultValue={selected.altText ?? ''} maxLength={200} />}</Field>
              <Field label="Title">{(p) => <Input {...p} name="title" defaultValue={selected.title ?? ''} maxLength={120} />}</Field>
              <Field label="Caption">{(p) => <Textarea {...p} name="caption" rows={2} defaultValue={selected.caption ?? ''} maxLength={240} className="min-h-16" />}</Field>
              <Field label="URL">{(p) => <Input {...p} readOnly value={selected.url} onFocus={(e) => e.target.select()} />}</Field>
              <div className="flex flex-wrap gap-2">
                <Button type="submit" loading={saving}>Save</Button>
                <Button
                  variant="secondary"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(new URL(selected.url, window.location.origin).toString());
                      toast.success('URL copied.');
                    } catch {
                      toast.error('Could not copy the URL.');
                    }
                  }}
                >
                  <Copy className="size-4" aria-hidden /> Copy URL
                </Button>
                <Button variant="ghost" className="text-danger" onClick={() => setDeleting({ item: selected, message: null })}>
                  <Trash2 className="size-4" aria-hidden /> Delete
                </Button>
              </div>
            </form>
          </div>
        )}
      </dialog>

      <ConfirmDialog
        open={deleting !== null}
        title={deleting?.message ? 'This file is in use' : 'Delete this file?'}
        description={deleting?.message ?? `“${deleting?.item.originalFilename ?? ''}” will be permanently removed from storage.`}
        confirmLabel={deleting?.message ? 'Delete anyway' : 'Delete'}
        onConfirm={() => remove(Boolean(deleting?.message))}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
