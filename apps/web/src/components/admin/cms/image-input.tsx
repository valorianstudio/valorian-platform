'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { ImageIcon, Images, RefreshCw, Trash2, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/dialog';
import { FallbackImage } from '@/components/ui/fallback-image';
import { Input } from '@/components/ui/field';
import { useToast } from '@/components/ui/toast';
import { cn } from '@/lib/cn';
import { validateImageFile } from '@/lib/client-api';
import type { MediaFolder } from '@/lib/client-api';
import { MediaPicker, formatBytes } from '../media/media-picker';
import { useMediaUpload } from '../media/use-media-upload';

/** Picks the Cloudinary folder from the field being edited, so assets stay organised without extra clicks. */
export function folderForField(name: string): MediaFolder {
  if (/avatar|photo/i.test(name)) return 'profile';
  if (/featuredImage/i.test(name)) return 'blog';
  if (/cover|screenshot|thumbnail/i.test(name)) return 'portfolio';
  if (/imageUrl|logo/i.test(name)) return 'testimonials';
  return 'general';
}

interface ImageInputProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
  disabled?: boolean;
  /** Where the image is used; decides the Cloudinary folder. */
  folder?: MediaFolder;
}

interface Staged {
  file: File;
  previewUrl: string;
}

/**
 * Image field: pick or drop a file, check the preview, then upload with live progress.
 * Uploading again over an existing image replaces it in this field; removing asks for confirmation.
 */
export function ImageInput({ label, value, onChange, hint, disabled, folder = 'general' }: ImageInputProps) {
  const id = useId();
  const toast = useToast();
  const upload = useMediaUpload();
  const file = useRef<HTMLInputElement>(null);
  const abort = useRef<AbortController | null>(null);
  const [staged, setStaged] = useState<Staged | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [failed, setFailed] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const uploading = progress !== null;

  const clear = useCallback(() => {
    setStaged((current) => {
      if (current) URL.revokeObjectURL(current.previewUrl);
      return null;
    });
    setProgress(null);
    setFailed(false);
    if (file.current) file.current.value = '';
  }, []);

  useEffect(() => () => abort.current?.abort(), []);

  function stage(selected: File | undefined) {
    if (!selected || disabled) return;
    const problem = validateImageFile(selected);
    if (problem) {
      toast.warning(problem);
      if (file.current) file.current.value = '';
      return;
    }
    setStaged((current) => {
      if (current) URL.revokeObjectURL(current.previewUrl);
      return { file: selected, previewUrl: URL.createObjectURL(selected) };
    });
    setFailed(false);
  }

  async function send() {
    if (!staged || uploading) return;
    abort.current = new AbortController();
    setProgress(0);
    setFailed(false);
    try {
      const media = await upload({ file: staged.file, folder, signal: abort.current.signal, onProgress: setProgress });
      onChange(media.url);
      clear();
    } catch {
      setProgress(null);
      setFailed(true);
    }
  }

  function cancelUpload() {
    abort.current?.abort();
    clear();
  }

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <span className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-lg border border-border bg-surface text-muted">
          {staged ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={staged.previewUrl} alt="Selected image preview" className="size-full object-cover" />
          ) : value ? (
            <FallbackImage src={value} alt="" width={160} height={160} sizes="80px" unoptimized={value.startsWith('blob:')} className="size-full object-cover" />
          ) : (
            <ImageIcon className="size-6" aria-hidden />
          )}
        </span>

        <div className="min-w-0 flex-1 space-y-2">
          <Input id={id} value={value} placeholder="Paste an image URL or upload" disabled={disabled || uploading} onChange={(e) => onChange(e.target.value)} />

          <input ref={file} type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="sr-only" tabIndex={-1} onChange={(e) => stage(e.target.files?.[0])} />

          {staged ? (
            <div className="space-y-2 rounded-xl border border-border bg-surface p-3" aria-live="polite">
              <p className="truncate text-sm font-medium">{staged.file.name}</p>
              <p className="text-xs text-muted">{formatBytes(staged.file.size)}{failed ? ' · Upload failed. Check your connection and retry.' : ''}</p>
              {uploading && (
                <div role="progressbar" aria-label="Upload progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} className="h-2 overflow-hidden rounded-full bg-surface-strong">
                  <div className="h-full rounded-full bg-primary transition-[width] duration-200" style={{ width: `${Math.max(3, progress)}%` }} />
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                <Button size="sm" loading={uploading} onClick={() => void send()}>
                  {failed ? <RefreshCw className="size-4" aria-hidden /> : <Upload className="size-4" aria-hidden />}
                  {uploading ? `Uploading ${progress}%` : failed ? 'Retry upload' : value ? 'Replace image' : 'Upload image'}
                </Button>
                <Button size="sm" variant="ghost" onClick={uploading ? cancelUpload : clear}>
                  <X className="size-4" aria-hidden /> Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div
              onDragOver={(event) => {
                event.preventDefault();
                if (!disabled) setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(event) => {
                event.preventDefault();
                setDragging(false);
                stage(event.dataTransfer.files[0]);
              }}
              className={cn('flex flex-wrap items-center gap-2 rounded-xl border border-dashed p-2 transition-colors', dragging ? 'border-primary bg-primary-soft' : 'border-border')}
            >
              <Button size="sm" variant="secondary" disabled={disabled} onClick={() => file.current?.click()}>
                <Upload className="size-4" aria-hidden /> {value ? 'Replace' : 'Upload'}
              </Button>
              <Button size="sm" variant="secondary" disabled={disabled} onClick={() => setPickerOpen(true)}>
                <Images className="size-4" aria-hidden /> Library
              </Button>
              {value && (
                <Button size="sm" variant="ghost" className="text-danger" disabled={disabled} onClick={() => setConfirmRemove(true)}>
                  <Trash2 className="size-4" aria-hidden /> Remove
                </Button>
              )}
              <span className="text-xs text-muted">or drop an image here · PNG, JPEG, WebP, GIF · up to 5 MB</span>
            </div>
          )}
          {hint && <p className="text-sm text-muted">{hint}</p>}
        </div>
      </div>

      <MediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        folder={folder}
        onSelect={(media) => {
          onChange(media.url);
          setPickerOpen(false);
        }}
      />
      <ConfirmDialog
        open={confirmRemove}
        title="Remove this image?"
        description="It is removed from this field only. The file stays in your media library and can be chosen again."
        confirmLabel="Remove"
        onConfirm={() => {
          onChange('');
          setConfirmRemove(false);
        }}
        onCancel={() => setConfirmRemove(false)}
      />
    </div>
  );
}
