'use client';

import { useId, useRef, useState } from 'react';
import { Eye, Images, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/field';
import { Prose } from '@/lib/markdown';
import { MediaPicker } from '../media/media-picker';

interface MarkdownFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  rows?: number;
  disabled?: boolean;
}

const HELP = 'Markdown: # headings, **bold**, *italic*, - lists, 1. numbered lists, > quotes, [links](https://…), ``` code blocks, ![alt](image-url).';

/** Markdown editor with a safe live preview and an image picker that inserts media-library images. */
export function MarkdownField({ label, value, onChange, hint, rows = 18, disabled }: MarkdownFieldProps) {
  const id = useId();
  const area = useRef<HTMLTextAreaElement>(null);
  const [preview, setPreview] = useState(false);
  const [picker, setPicker] = useState(false);

  function insert(text: string) {
    const element = area.current;
    const start = element?.selectionStart ?? value.length;
    const end = element?.selectionEnd ?? value.length;
    onChange(`${value.slice(0, start)}${text}${value.slice(end)}`);
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" disabled={disabled || preview} onClick={() => setPicker(true)}>
            <Images className="size-4" aria-hidden /> Insert image
          </Button>
          <Button size="sm" variant="ghost" aria-pressed={preview} onClick={() => setPreview(!preview)}>
            {preview ? <Pencil className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />} {preview ? 'Edit' : 'Preview'}
          </Button>
        </div>
      </div>
      {preview ? (
        <div className="max-h-[32rem] overflow-y-auto rounded-lg border border-border bg-background p-5">{value.trim() ? <Prose source={value} /> : <p className="text-muted">Nothing to preview yet.</p>}</div>
      ) : (
        <Textarea id={id} ref={area} rows={rows} disabled={disabled} value={value} onChange={(e) => onChange(e.target.value)} className="font-mono text-[0.9rem] leading-6" spellCheck />
      )}
      <p className="text-sm text-muted">{hint ?? HELP}</p>
      <MediaPicker
        open={picker}
        onClose={() => setPicker(false)}
        onSelect={(media) => {
          const size = media.width && media.height ? ` "${media.width}x${media.height}"` : '';
          insert(`\n\n![${(media.altText ?? '').replace(/[\]\n]/g, ' ')}](${media.url}${size})\n\n`);
          setPicker(false);
        }}
      />
    </div>
  );
}
