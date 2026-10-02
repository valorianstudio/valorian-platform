'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Search, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/field';
import { useToast } from '@/components/ui/toast';
import { ApiError, apiGet, uploadImage } from '@/lib/client-api';

export interface MediaItem {
  id: string;
  filename: string;
  originalFilename: string;
  url: string;
  mimeType: string;
  size: number;
  width: number | null;
  height: number | null;
  altText: string | null;
  title: string | null;
  caption: string | null;
  createdAt: string;
}

export interface MediaPage {
  items: MediaItem[];
  total: number;
  page: number;
  pageSize: number;
}

export function formatBytes(bytes: number): string {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

interface MediaPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (media: MediaItem) => void;
}

/** Modal media chooser shared by every editor. Uploading here also adds to the library. */
export function MediaPicker({ open, onClose, onSelect }: MediaPickerProps) {
  const toast = useToast();
  const dialog = useRef<HTMLDialogElement>(null);
  const file = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [data, setData] = useState<MediaPage | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = useCallback(
    async (nextPage: number, q: string) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page: String(nextPage) });
        if (q) params.set('q', q);
        setData(await apiGet<MediaPage>(`/admin/media?${params}`));
        setPage(nextPage);
      } catch (error) {
        toast.error(error instanceof ApiError ? error.message : 'Could not load the media library.');
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (open && !element.open) {
      element.showModal();
      void load(1, '');
    }
    if (!open && element.open) element.close();
  }, [open, load]);

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const selected of Array.from(files)) await uploadImage(selected);
      toast.success(files.length > 1 ? 'Images uploaded.' : 'Image uploaded.');
      await load(1, query);
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : 'Upload failed.');
    } finally {
      setUploading(false);
      if (file.current) file.current.value = '';
    }
  }

  const pageCount = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;

  return (
    <dialog
      ref={dialog}
      onClose={onClose}
      onClick={(e) => e.target === dialog.current && onClose()}
      aria-label="Choose from media library"
      className="m-auto max-h-[90vh] w-[calc(100%-1.5rem)] max-w-4xl overflow-hidden rounded-2xl border border-border bg-background p-0 text-foreground shadow-2xl backdrop:bg-foreground/50"
    >
      <div className="flex max-h-[90vh] flex-col">
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
          <h2 className="font-semibold">Media library</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="grid size-9 place-items-center rounded-lg hover:bg-surface-strong">
            <X className="size-5" aria-hidden />
          </button>
        </div>
        <div role="search" className="flex flex-wrap gap-2 border-b border-border px-4 py-3 sm:px-5">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
            <Input aria-label="Search media" placeholder="Search by name or alt text…" className="pl-10" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); void load(1, query); } }} />
          </div>
          <input ref={file} type="file" multiple accept="image/png,image/jpeg,image/webp,image/gif" className="sr-only" tabIndex={-1} onChange={(e) => onFiles(e.target.files)} />
          <Button type="button" variant="secondary" loading={uploading} onClick={() => file.current?.click()}>
            <Upload className="size-4" aria-hidden /> Upload
          </Button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5" aria-busy={loading}>
          {data && data.items.length === 0 ? (
            <p className="py-12 text-center text-muted">{query ? 'No files match your search.' : 'No images yet. Upload your first image.'}</p>
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {data?.items.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(item)}
                    className="group block w-full overflow-hidden rounded-xl border border-border bg-surface text-left transition-colors hover:border-primary"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.url} alt={item.altText ?? ''} loading="lazy" decoding="async" width={240} height={180} className="aspect-[4/3] w-full object-cover" />
                    <span className="block truncate px-2.5 py-2 text-xs text-muted">{item.originalFilename}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        {pageCount > 1 && (
          <div className="flex items-center justify-between border-t border-border px-4 py-3 text-sm sm:px-5">
            <span className="text-muted">Page {page} of {pageCount}</span>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" disabled={page === 1 || loading} onClick={() => load(page - 1, query)}>Previous</Button>
              <Button size="sm" variant="secondary" disabled={page === pageCount || loading} onClick={() => load(page + 1, query)}>Next</Button>
            </div>
          </div>
        )}
      </div>
    </dialog>
  );
}
