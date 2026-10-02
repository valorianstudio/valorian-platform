import { Injectable } from '@nestjs/common';
import { randomBytes } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { mkdir, stat, unlink, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import type { Readable } from 'node:stream';
import { env } from '../config/env';
import { detectImage } from '../storage/storage.service';

export const MAX_PROJECT_FILE_BYTES = 15 * 1024 * 1024;

interface FileKind {
  mime: string;
  /** Verifies the content really is this kind of file; the extension alone is never trusted. */
  check: (data: Buffer) => boolean;
}

const startsWith = (data: Buffer, bytes: number[]) => bytes.every((b, i) => data[i] === b);
const zip = (data: Buffer) => startsWith(data, [0x50, 0x4b, 0x03, 0x04]);
const text = (data: Buffer) => !data.subarray(0, 4096).includes(0);
const image = (ext: string) => (data: Buffer) => detectImage(data)?.ext === ext;

export const FILE_KINDS: Record<string, FileKind> = {
  pdf: { mime: 'application/pdf', check: (d) => startsWith(d, [0x25, 0x50, 0x44, 0x46]) },
  png: { mime: 'image/png', check: image('png') },
  jpg: { mime: 'image/jpeg', check: image('jpg') },
  jpeg: { mime: 'image/jpeg', check: image('jpg') },
  webp: { mime: 'image/webp', check: image('webp') },
  gif: { mime: 'image/gif', check: image('gif') },
  docx: { mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', check: zip },
  xlsx: { mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', check: zip },
  pptx: { mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', check: zip },
  zip: { mime: 'application/zip', check: zip },
  txt: { mime: 'text/plain; charset=utf-8', check: text },
  csv: { mime: 'text/csv; charset=utf-8', check: text },
  md: { mime: 'text/plain; charset=utf-8', check: text },
};

export function extensionOf(name: string): string {
  return (name.split('.').pop() ?? '').toLowerCase();
}

/** Strips path parts and control characters so the name is safe to store and to put in a header. */
export function safeFileName(name: string): string {
  const base = name.split(/[\\/]/).pop() ?? 'file';
  // eslint-disable-next-line no-control-regex
  return base.replace(/[\u0000-\u001f"<>|:*?]/g, '').trim().slice(0, 120) || 'file';
}

export interface PrivateObject {
  stream: Readable;
  size: number;
}

/**
 * Storage contract for private client documents. There is deliberately no URL method: files are only ever
 * streamed through an authorized endpoint. Implement this for S3-compatible storage (Cloudflare R2, Supabase Storage,
 * AWS S3) with private buckets and provide it in PortalModule instead of the local implementation.
 */
export abstract class ProjectFileStorage {
  abstract newKey(): string;
  abstract put(key: string, data: Buffer): Promise<void>;
  abstract get(key: string): Promise<PrivateObject | null>;
  abstract remove(key: string): Promise<void>;
}

/** Local disk storage. Keys are generated here and validated on every access, never taken from users. */
@Injectable()
export class LocalProjectFileStorage extends ProjectFileStorage {
  private readonly root = resolve(env.PRIVATE_UPLOAD_DIR);

  newKey(): string {
    return randomBytes(24).toString('hex');
  }

  private path(key: string): string | null {
    return /^[a-f0-9]{48}$/.test(key) ? join(this.root, key) : null;
  }

  async put(key: string, data: Buffer): Promise<void> {
    const target = this.path(key);
    if (!target) throw new Error('Invalid storage key');
    await mkdir(this.root, { recursive: true });
    await writeFile(target, data, { mode: 0o600 });
  }

  async get(key: string): Promise<PrivateObject | null> {
    const target = this.path(key);
    if (!target) return null;
    try {
      const info = await stat(target);
      return { stream: createReadStream(target), size: info.size };
    } catch {
      return null;
    }
  }

  async remove(key: string): Promise<void> {
    const target = this.path(key);
    if (target) await unlink(target).catch(() => undefined);
  }
}
