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

/** Reads pixel dimensions from the image header without decoding the whole file. */
export function imageSize(data: Buffer): { width: number; height: number } | null {
  try {
    if (data.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return { width: data.readUInt32BE(16), height: data.readUInt32BE(20) };
    if (data.subarray(0, 4).toString('ascii') === 'GIF8') return { width: data.readUInt16LE(6), height: data.readUInt16LE(8) };
    if (data.subarray(0, 4).toString('ascii') === 'RIFF' && data.subarray(8, 12).toString('ascii') === 'WEBP') {
      const chunk = data.subarray(12, 16).toString('ascii');
      if (chunk === 'VP8X') return { width: 1 + data.readUIntLE(24, 3), height: 1 + data.readUIntLE(27, 3) };
      if (chunk === 'VP8 ') return { width: data.readUInt16LE(26) & 0x3fff, height: data.readUInt16LE(28) & 0x3fff };
      if (chunk === 'VP8L') {
        const bits = data.readUInt32LE(21);
        return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
      }
    }
    if (data[0] === 0xff && data[1] === 0xd8) {
      let offset = 2;
      while (offset + 9 < data.length) {
        if (data[offset] !== 0xff) return null;
        const marker = data[offset + 1];
        const length = data.readUInt16BE(offset + 2);
        if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) return { height: data.readUInt16BE(offset + 5), width: data.readUInt16BE(offset + 7) };
        offset += 2 + length;
      }
    }
  } catch {
    return null;
  }
  return null;
}
