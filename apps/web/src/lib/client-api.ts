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

export async function apiRequest<T>(method: 'POST' | 'PUT' | 'PATCH' | 'DELETE', path: string, body?: unknown): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`/api${path}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError('Could not reach the server. Check your connection and try again.', 0);
  }

  if (response.status === 204) return undefined as T;
  const payload = (await response.json().catch(() => ({}))) as T & ErrorPayload;
  if (!response.ok) {
    throw new ApiError(payload.message ?? 'Request failed. Please try again.', response.status, payload.errors);
  }
  return payload;
}

export async function uploadImage(file: File): Promise<string> {
  if (file.size > 5 * 1024 * 1024) throw new ApiError('Image must be 5 MB or smaller.', 400);
  let response: Response;
  try {
    response = await fetch(`/api/admin/media?name=${encodeURIComponent(file.name)}`, { method: 'POST', headers: { 'Content-Type': file.type }, body: file });
  } catch {
    throw new ApiError('Could not reach the server. Check your connection and try again.', 0);
  }
  const payload = (await response.json().catch(() => ({}))) as { url?: string; message?: string };
  if (!response.ok || !payload.url) throw new ApiError(payload.message ?? 'Upload failed.', response.status);
  return payload.url;
}

export async function apiGet<T>(path: string): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`/api${path}`, { headers: { Accept: 'application/json' }, cache: 'no-store' });
  } catch {
    throw new ApiError('Could not reach the server. Check your connection and try again.', 0);
  }
  const payload = (await response.json().catch(() => ({}))) as T & ErrorPayload;
  if (!response.ok) throw new ApiError(payload.message ?? 'Request failed. Please try again.', response.status, payload.errors);
  return payload;
}
