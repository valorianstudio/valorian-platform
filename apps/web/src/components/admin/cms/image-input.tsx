'use client';

import { useId, useRef, useState } from 'react';
import { ImageIcon, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/field';
import { useToast } from '@/components/ui/toast';
import { ApiError, uploadImage } from '@/lib/client-api';

interface ImageInputProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
  disabled?: boolean;
}

export function ImageInput({ label, value, onChange, hint, disabled }: ImageInputProps) {
  const id = useId();
  const toast = useToast();
  const file = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function onFile(selected: File | undefined) {
    if (!selected) return;
    setUploading(true);
    try {
      onChange(await uploadImage(selected));
      toast.success('Image uploaded.');
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : 'Upload failed.');
    } finally {
      setUploading(false);
      if (file.current) file.current.value = '';
    }
  }

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      <div className="flex items-start gap-3">
        <span className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-lg border border-border bg-surface text-muted">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="size-full object-cover" />
          ) : (
            <ImageIcon className="size-5" aria-hidden />
          )}
        </span>
        <div className="min-w-0 flex-1 space-y-2">
          <Input id={id} value={value} placeholder="Paste an image URL or upload" disabled={disabled} onChange={(e) => onChange(e.target.value)} />
          <div className="flex flex-wrap gap-2">
            <input ref={file} type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="sr-only" tabIndex={-1} onChange={(e) => onFile(e.target.files?.[0])} />
            <Button size="sm" variant="secondary" loading={uploading} disabled={disabled} onClick={() => file.current?.click()}>
              <Upload className="size-4" aria-hidden /> {value ? 'Replace' : 'Upload'}
            </Button>
            {value && (
              <Button size="sm" variant="ghost" className="text-danger" disabled={disabled} onClick={() => onChange('')}>
                <Trash2 className="size-4" aria-hidden /> Remove
              </Button>
            )}
          </div>
          {hint && <p className="text-sm text-muted">{hint}</p>}
        </div>
      </div>
    </div>
  );
}
