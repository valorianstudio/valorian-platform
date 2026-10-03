import { BadGatewayException, Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import type { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { cloudinaryEnabled, env } from '../config/env';

/** Where an upload is used. Each purpose gets its own Cloudinary sub-folder so the account stays browsable. */
export const MEDIA_FOLDERS = ['general', 'profile', 'projects', 'portfolio', 'certificates', 'blog', 'services', 'testimonials', 'demos', 'case-studies'] as const;
export type MediaFolder = (typeof MEDIA_FOLDERS)[number];

export function isMediaFolder(value: unknown): value is MediaFolder {
  return typeof value === 'string' && (MEDIA_FOLDERS as readonly string[]).includes(value);
}

export interface CloudinaryAsset {
  publicId: string;
  url: string;
  width: number;
  height: number;
  bytes: number;
  format: string;
  folder: string;
  assetId: string;
  version: number;
}

const UPLOAD_TIMEOUT_MS = 30_000;

/**
 * Thin wrapper over the Cloudinary SDK. Files go straight from memory to Cloudinary, so nothing is ever written to the
 * API's (ephemeral) disk. The secret stays in this process; browsers only ever see the resulting public URL.
 */
@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);
  readonly enabled = cloudinaryEnabled;

  constructor() {
    if (this.enabled) {
      cloudinary.config({ cloud_name: env.CLOUDINARY_CLOUD_NAME, api_key: env.CLOUDINARY_API_KEY, api_secret: env.CLOUDINARY_API_SECRET, secure: true });
    } else {
      this.logger.warn('Cloudinary is not configured (CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET). Image uploads are disabled in production.');
    }
  }

  async upload(data: Buffer, options: { folder: MediaFolder; tags?: string[] }): Promise<CloudinaryAsset> {
    this.assertEnabled();
    const folder = `${env.CLOUDINARY_FOLDER}/${options.folder}`;
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          // The format was already verified from the file's magic bytes; Cloudinary re-checks it against this allow-list.
          allowed_formats: ['png', 'jpg', 'webp', 'gif'],
          unique_filename: true,
          use_filename: false,
          overwrite: false,
          tags: ['valorian', ...(options.tags ?? [])],
          timeout: UPLOAD_TIMEOUT_MS,
        },
        (error: UploadApiErrorResponse | undefined, response: UploadApiResponse | undefined) => {
          if (error || !response) reject(error ?? new Error('Empty response from Cloudinary'));
          else resolve(response);
        },
      );
      stream.on('error', reject);
      stream.end(data);
    }).catch((error: unknown) => {
      this.logger.error(`Upload failed: ${describe(error)}`);
      throw new BadGatewayException('The image could not be stored. Please try again in a moment.');
    });

    return {
      publicId: result.public_id,
      url: result.secure_url,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
      format: result.format,
      folder,
      assetId: result.asset_id,
      version: result.version,
    };
  }

  /** Removes an asset. "not found" counts as success so a retry after a partial failure converges. */
  async destroy(publicId: string): Promise<void> {
    this.assertEnabled();
    try {
      const result = (await withTimeout(cloudinary.uploader.destroy(publicId, { resource_type: 'image', invalidate: true }), UPLOAD_TIMEOUT_MS)) as { result?: string };
      if (result.result !== 'ok' && result.result !== 'not found') throw new Error(`Unexpected result: ${String(result.result)}`);
    } catch (error) {
      this.logger.error(`Delete failed for ${publicId}: ${describe(error)}`);
      throw new BadGatewayException('The image could not be removed from storage. Please try again.');
    }
  }

  private assertEnabled(): void {
    if (!this.enabled) throw new ServiceUnavailableException('Image uploads are not configured on this server yet.');
  }
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: NodeJS.Timeout;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`Timed out after ${ms} ms`)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

function describe(error: unknown): string {
  if (error && typeof error === 'object' && 'message' in error) return String((error as { message: unknown }).message).slice(0, 200);
  return 'unknown error';
}
