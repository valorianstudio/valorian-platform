import type { FastifyRequest } from 'fastify';
import type { AdminProfile } from '../admin-users/admin-users.service';
import type { AuditActor, AuditRequestMeta } from '../audit/audit.service';

export const actorOf = (admin: AdminProfile): AuditActor => ({ id: admin.id, name: admin.name, email: admin.email });
export const metaOf = (request: FastifyRequest): AuditRequestMeta => ({ ip: request.ip, userAgent: request.headers['user-agent'] });

/** Field-level before/after for fields that actually changed. Callers pass only non-sensitive keys. */
export function changed<T extends Record<string, unknown>>(before: T, after: Partial<T>): Record<string, { before: unknown; after: unknown }> {
  const out: Record<string, { before: unknown; after: unknown }> = {};
  for (const [key, value] of Object.entries(after)) {
    if (value === undefined) continue;
    const prev = before[key];
    const same = prev instanceof Date || value instanceof Date ? new Date(prev as Date).getTime() === new Date(value as Date).getTime() : prev === value;
    if (!same) out[key] = { before: prev ?? null, after: value };
  }
  return out;
}

export const emptyToNull = (value: string | null | undefined): string | null => (value && value.trim() !== '' ? value.trim() : null);
