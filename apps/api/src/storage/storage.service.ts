import { Injectable } from '@nestjs/common';
import { randomBytes } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { mkdir, stat, unlink, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import type { Readable } from 'node:stream';
import { env } from '../config/env';

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export interface StoredObject {
  stream: Readable;
  contentType: string;
  size: number;
}

/**
 * Storage contract. Swap the implementation provided in StorageModule
 * (e.g. Cloudflare R2 or Supabase Storage) without touching callers.
 */
export abstract class StorageService {
  abstract put(key: string, data: Buffer, contentType: string): Promise<void>;
  abstract get(key: string): Promise<StoredObject | null>;
  abstract remove(key: string): Promise<void>;
  /** Public URL (relative or absolute) the browser uses to load an object. */
  abstract urlFor(key: string): string;
}

const TYPES: Record<string, string> = { png: 'image/png', jpg: 'image/jpeg', webp: 'image/webp', gif: 'image/gif' };

export function detectImage(data: Buffer): { ext: string; contentType: string } | null {
  const ext = (() => {
    if (data.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'png';
    if (data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff) return 'jpg';
    if (data.subarray(0, 4).toString('ascii') === 'RIFF' && data.subarray(8, 12).toString('ascii') === 'WEBP') return 'webp';
    if (data.subarray(0, 4).toString('ascii') === 'GIF8') return 'gif';
    return null;
  })();
  return ext ? { ext, contentType: TYPES[ext] } : null;
}

export function newObjectKey(ext: string): string {
  return `${Date.now().toString(36)}-${randomBytes(6).toString('hex')}.${ext}`;
}

@Injectable()
export class LocalStorageService extends StorageService {
  private readonly root = resolve(env.UPLOAD_DIR);

  private path(key: string): string | null {
    return /^[a-z0-9-]+\.(png|jpg|webp|gif)$/.test(key) ? join(this.root, key) : null;
  }

  async put(key: string, data: Buffer): Promise<void> {
    const target = this.path(key);
    if (!target) throw new Error('Invalid storage key');
    await mkdir(this.root, { recursive: true });
    await writeFile(target, data);
  }

  async get(key: string): Promise<StoredObject | null> {
    const target = this.path(key);
    if (!target) return null;
    try {
      const info = await stat(target);
      return { stream: createReadStream(target), contentType: TYPES[key.split('.').pop() ?? ''], size: info.size };
    } catch {
      return null;
    }
  }

  async remove(key: string): Promise<void> {
    const target = this.path(key);
    if (target) await unlink(target).catch(() => undefined);
  }

  urlFor(key: string): string {
    return `/api/media/${key}`;
  }
}
