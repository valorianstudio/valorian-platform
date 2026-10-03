import { unwrap } from './api-response';

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly details: string[] = [],
  ) {
    super(message);
  }
}

interface ErrorPayload {
  message?: string;
  errors?: string[];
}

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'] as const;

/** Where an upload is used; becomes the Cloudinary sub-folder. Mirrors MEDIA_FOLDERS in the API. */
export type MediaFolder = 'general' | 'profile' | 'projects' | 'portfolio' | 'certificates' | 'blog' | 'services' | 'testimonials' | 'demos' | 'case-studies';

const DEFAULT_TIMEOUT_MS = 20_000;
const RETRY_STATUSES = new Set([502, 503, 504]);

const NETWORK_MESSAGE = 'Could not reach the server. Check your connection and try again.';
const TIMEOUT_MESSAGE = 'The server is taking too long to respond. Please try again.';

const GENERIC_MESSAGES = new Set(['Unauthorized', 'Forbidden', 'Forbidden resource', 'Bad Request', 'Internal Server Error']);

/** Friendly wording for statuses where the server message would not help the person reading it. */
function messageFor(status: number, serverMessage?: string): string {
  // Specific messages ("Invalid email or password") are kept; Nest's generic ones are replaced.
  const specific = serverMessage && !GENERIC_MESSAGES.has(serverMessage) ? serverMessage : undefined;
  if (status === 401) return specific ?? 'Your session has expired. Please sign in again.';
  if (status === 403) return specific ?? 'You do not have permission to do that.';
  if (status === 413) return 'That file is too large.';
  if (status === 429) return 'Too many requests. Please wait a moment and try again.';
  if (status >= 500) return serverMessage ?? 'The server ran into a problem. Please try again in a moment.';
  return serverMessage ?? 'Request failed. Please try again.';
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface RequestOptions {
  signal?: AbortSignal;
  timeoutMs?: number;
  /** Extra attempts after a network failure or 502/503/504. Only ever used for reads, which are safe to repeat. */
  retries?: number;
}

/** fetch with a timeout, caller cancellation and bounded retries with backoff. */
async function send(url: string, init: RequestInit, { signal, timeoutMs = DEFAULT_TIMEOUT_MS, retries = 0 }: RequestOptions): Promise<Response> {
  for (let attempt = 0; ; attempt += 1) {
    const controller = new AbortController();
    const onAbort = () => controller.abort();
    signal?.addEventListener('abort', onAbort, { once: true });
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, timeoutMs);
    try {
      const response = await fetch(url, { ...init, signal: controller.signal });
      if (RETRY_STATUSES.has(response.status) && attempt < retries) {
        await wait(400 * 2 ** attempt);
        continue;
      }
      return response;
    } catch {
      if (signal?.aborted) throw new ApiError('Request cancelled.', 0);
      if (attempt < retries) {
        await wait(400 * 2 ** attempt);
        continue;
      }
      throw new ApiError(timedOut ? TIMEOUT_MESSAGE : NETWORK_MESSAGE, 0);
    } finally {
      clearTimeout(timer);
      signal?.removeEventListener('abort', onAbort);
    }
  }
}

async function parse<T>(response: Response): Promise<T> {
  if (response.status === 204) return undefined as T;
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = payload as ErrorPayload;
    throw new ApiError(messageFor(response.status, error.message), response.status, error.errors);
  }
  return unwrap<T>(payload);
}

export async function apiRequest<T>(method: 'POST' | 'PUT' | 'PATCH' | 'DELETE', path: string, body?: unknown, options: RequestOptions = {}): Promise<T> {
  const response = await send(
    `/api${path}`,
    { method, headers: { 'Content-Type': 'application/json' }, body: body === undefined ? undefined : JSON.stringify(body) },
    options,
  );
  return parse<T>(response);
}

export async function apiGet<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await send(`/api${path}`, { headers: { Accept: 'application/json' }, cache: 'no-store' }, { retries: 2, ...options });
  return parse<T>(response);
}

export interface UploadedMedia {
  id: string;
  url: string;
  publicId: string | null;
  width: number | null;
  height: number | null;
  size: number;
  mimeType: string;
  originalFilename: string;
}

export interface UploadOptions {
  folder?: MediaFolder;
  /** 0-100 while the file is being sent. */
  onProgress?: (percent: number) => void;
  signal?: AbortSignal;
}

/** Client-side checks that mirror the API, so obvious mistakes are reported instantly instead of after an upload. */
export function validateImageFile(file: File): string | null {
  if (!(IMAGE_TYPES as readonly string[]).includes(file.type)) return 'Use a PNG, JPEG, WebP or GIF image.';
  if (file.size === 0) return 'That file is empty.';
  if (file.size > MAX_IMAGE_BYTES) return 'Image must be 5 MB or smaller.';
  return null;
}

/** XMLHttpRequest rather than fetch: it is the only browser API that reports upload progress. */
function transfer(method: 'POST' | 'PUT', url: string, file: File, { onProgress, signal }: UploadOptions): Promise<UploadedMedia> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.timeout = 90_000;
    xhr.responseType = 'text';
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress?.(Math.min(99, Math.round((event.loaded / event.total) * 100)));
    };
    xhr.onload = () => {
      let payload: unknown = {};
      try {
        payload = JSON.parse(xhr.responseText);
      } catch {
        // non-JSON body (proxy error page): handled by the status check below
      }
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress?.(100);
        resolve(unwrap<UploadedMedia>(payload));
      } else {
        const error = payload as ErrorPayload;
        reject(new ApiError(messageFor(xhr.status, error.message), xhr.status, error.errors));
      }
    };
    xhr.onerror = () => reject(new ApiError(NETWORK_MESSAGE, 0));
    xhr.ontimeout = () => reject(new ApiError('The upload timed out. Check your connection and try again.', 0));
    xhr.onabort = () => reject(new ApiError('Upload cancelled.', 0));
    signal?.addEventListener('abort', () => xhr.abort(), { once: true });
    onProgress?.(0);
    xhr.send(file);
  });
}

export function uploadMedia(file: File, options: UploadOptions = {}): Promise<UploadedMedia> {
  const problem = validateImageFile(file);
  if (problem) return Promise.reject(new ApiError(problem, 400));
  const params = new URLSearchParams({ name: file.name, folder: options.folder ?? 'general' });
  return transfer('POST', `/api/admin/media?${params}`, file, options);
}

/** Swaps the file behind an existing library item; the API repoints every page that used the old URL. */
export function replaceMedia(id: string, file: File, options: UploadOptions = {}): Promise<UploadedMedia> {
  const problem = validateImageFile(file);
  if (problem) return Promise.reject(new ApiError(problem, 400));
  return transfer('PUT', `/api/admin/media/${encodeURIComponent(id)}?name=${encodeURIComponent(file.name)}`, file, options);
}

export async function uploadImage(file: File, options: UploadOptions = {}): Promise<string> {
  return (await uploadMedia(file, options)).url;
}
