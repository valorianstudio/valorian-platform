'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ImageOff, RotateCw } from 'lucide-react';
import { cn } from '@/lib/cn';

/** Hosts the Next.js optimizer is allowed to fetch from (see images.remotePatterns in next.config.ts). */
const OPTIMIZED_HOSTS = new Set(['res.cloudinary.com']);

function isOptimizable(src: string): boolean {
  if (src.startsWith('/')) return !src.startsWith('//');
  try {
    return OPTIMIZED_HOSTS.has(new URL(src).hostname);
  } catch {
    return false;
  }
}

/** Neutral shimmer shown while an image loads, so the layout never jumps and no area is blank. */
const SHIMMER =
  'data:image/svg+xml;base64,' +
  'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjUiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjUiIGZpbGw9IiNlOWRmZDAiLz48L3N2Zz4=';

/** Cloudinary can hand back a tiny blurred rendition of the same asset, which makes a much nicer placeholder. */
function blurFor(src: string): string {
  return src.includes('res.cloudinary.com') && src.includes('/upload/') ? src.replace('/upload/', '/upload/w_32,q_30,e_blur:400,f_auto/') : SHIMMER;
}

export interface FallbackImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes?: string;
  className?: string;
  priority?: boolean;
  /** Show a "Try again" button when the image fails. Turn off when the image sits inside a link or button. */
  retry?: boolean;
  /** Skip the optimizer (admin previews of just-uploaded files, blob URLs). */
  unoptimized?: boolean;
}

/**
 * Every content image on the site goes through this: next/image where possible (responsive srcset, AVIF/WebP, lazy
 * loading) and a professional placeholder with a retry action instead of a broken-image icon when loading fails.
 */
export function FallbackImage({ src, alt, width, height, sizes = '100vw', className, priority = false, retry = true, unoptimized = false }: FallbackImageProps) {
  const [attempt, setAttempt] = useState(0);
  const [failedAttempt, setFailedAttempt] = useState<number | null>(null);
  const failed = failedAttempt === attempt;

  if (failed) {
    return (
      <div role="img" aria-label={alt || 'Image unavailable'} className={cn('flex flex-col items-center justify-center gap-2 bg-surface-strong p-2 text-center text-muted', className)}>
        <ImageOff className="size-5 shrink-0" aria-hidden />
        {retry && width >= 120 && (
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setAttempt((n) => n + 1);
            }}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground hover:border-primary"
          >
            <RotateCw className="size-3" aria-hidden /> Try again
          </button>
        )}
      </div>
    );
  }

  const onError = () => setFailedAttempt(attempt);

  if (unoptimized || !isOptimizable(src)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        key={attempt}
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : undefined}
        onError={onError}
        className={className}
      />
    );
  }

  return (
    <Image
      key={attempt}
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      placeholder="blur"
      blurDataURL={blurFor(src)}
      onError={onError}
      className={className}
    />
  );
}
