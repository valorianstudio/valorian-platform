import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { AuditAction, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { SecuritySettingsService } from '../rbac/security-settings.service';

export interface AuditActor {
  id: string | null;
  name: string;
  email?: string | null;
}

export interface AuditRequestMeta {
  ip?: string;
  userAgent?: string;
}

export interface AuditEntry {
  actor: AuditActor;
  action: AuditAction;
  module: string;
  entityType?: string;
  entityId?: string;
  entityLabel?: string;
  summary: string;
  changes?: Record<string, unknown> | null;
  meta?: AuditRequestMeta;
}

export interface AuditQuery {
  q?: string;
  user?: string;
  action?: string;
  module?: string;
  entityType?: string;
  from?: string;
  to?: string;
  page?: string;
}

const PAGE_SIZE = 25;
const SENSITIVE_KEY = /pass(word)?|hash|secret|token|backup|totp|cookie|authorization/i;
const IGNORED_KEYS = new Set(['updatedAt', 'createdAt', 'id']);
const RICH_KEYS = new Set(['content', 'fullDescription', 'fullOverview', 'description', 'overview', 'approach', 'challenge', 'solution', 'answer', 'quote', 'clientMessage', 'message']);

/** Masks the host part of an address so the log can show a network, never a specific device. */
export function maskIp(ip: string | undefined): string | undefined {
  if (!ip) return undefined;
  const clean = ip.replace(/^::ffff:/, '');
  if (clean.includes('.')) return clean.split('.').slice(0, 3).join('.') + '.0';
  return clean.split(':').slice(0, 3).join(':') + '::';
}

/** Reduces a record to safe, short, comparable values. */
export function sanitizeSnapshot(record: Record<string, unknown> | null): Record<string, unknown> | null {
  if (!record) return null;
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(record)) {
    if (IGNORED_KEYS.has(key) || SENSITIVE_KEY.test(key) || value === undefined) continue;
    if (RICH_KEYS.has(key)) {
      out[key] = typeof value === 'string' ? `[text, ${value.length} chars]` : '[rich content]';
      if (typeof value === 'string') out[`${key}__hash`] = value.length + ':' + value.slice(0, 40) + ':' + value.slice(-40);
      continue;
    }
    if (value instanceof Date) out[key] = value.toISOString();
    else if (typeof value === 'string') out[key] = value.length > 160 ? `${value.slice(0, 157)}…` : value;
    else if (typeof value === 'number' || typeof value === 'boolean' || value === null) out[key] = value;
    else {
      const text = JSON.stringify(value);
      out[key] = text.length > 300 ? '[large value]' : value;
    }
  }
  return out;
}

export function diffSnapshots(before: Record<string, unknown> | null, after: Record<string, unknown> | null): Record<string, { before: unknown; after: unknown }> {
  const changes: Record<string, { before: unknown; after: unknown }> = {};
  const keys = new Set([...Object.keys(before ?? {}), ...Object.keys(after ?? {})]);
  for (const key of keys) {
    if (key.endsWith('__hash')) continue;
    const a = before?.[key];
    const b = after?.[key];
    const hashA = before?.[`${key}__hash`];
    const hashB = after?.[`${key}__hash`];
    const same = hashA !== undefined || hashB !== undefined ? hashA === hashB : JSON.stringify(a) === JSON.stringify(b);
    if (!same) changes[key] = { before: a ?? null, after: b ?? null };
    if (Object.keys(changes).length >= 25) break;
  }
  return changes;
}

@Injectable()
export class AuditService implements OnModuleInit {
  private readonly logger = new Logger(AuditService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly security: SecuritySettingsService,
  ) {}

  onModuleInit(): void {
    const timer = setInterval(() => void this.cleanup(), 12 * 60 * 60 * 1000);
    timer.unref();
  }

  /** Retention is a controlled system rule; there is no API to edit or delete individual entries. */
  async cleanup(): Promise<void> {
    try {
      const { auditRetentionDays } = await this.security.get();
      await this.prisma.auditLog.deleteMany({ where: { createdAt: { lt: new Date(Date.now() - auditRetentionDays * 86_400_000) } } });
    } catch (error) {
      this.logger.warn(`Audit cleanup failed: ${error instanceof Error ? error.message : 'unknown error'}`);
    }
  }

  /** Never throws: auditing must not break the action it describes. */
  async log(entry: AuditEntry): Promise<void> {
    try {
      const changes = entry.changes && Object.keys(entry.changes).length > 0 ? entry.changes : undefined;
      await this.prisma.auditLog.create({
        data: {
          adminUserId: entry.actor.id,
          adminName: entry.actor.name.slice(0, 120),
          adminEmail: entry.actor.email?.slice(0, 160),
          action: entry.action,
          module: entry.module,
          entityType: entry.entityType,
          entityId: entry.entityId,
          entityLabel: entry.entityLabel?.slice(0, 160),
          summary: entry.summary.slice(0, 300),
          changes: changes as Prisma.InputJsonObject | undefined,
          ipMasked: maskIp(entry.meta?.ip),
          userAgent: entry.meta?.userAgent?.slice(0, 200),
        },
      });
    } catch (error) {
      this.logger.warn(`Audit write failed: ${error instanceof Error ? error.message : 'unknown error'}`);
    }
  }

  async list(query: AuditQuery) {
    const page = Math.max(1, Number.parseInt(query.page ?? '1', 10) || 1);
    const q = query.q?.trim();
    const from = query.from ? new Date(query.from) : null;
    const to = query.to ? new Date(query.to) : null;
    const where: Prisma.AuditLogWhereInput = {
      ...(query.user ? { adminUserId: query.user } : {}),
      ...(query.action && Object.hasOwn(AuditAction, query.action) ? { action: query.action as AuditAction } : {}),
      ...(query.module ? { module: query.module } : {}),
      ...(query.entityType ? { entityType: query.entityType } : {}),
      ...(q ? { OR: [{ summary: { contains: q, mode: 'insensitive' } }, { entityLabel: { contains: q, mode: 'insensitive' } }, { adminName: { contains: q, mode: 'insensitive' } }] } : {}),
      ...((from && !Number.isNaN(from.getTime())) || (to && !Number.isNaN(to.getTime()))
        ? { createdAt: { ...(from && !Number.isNaN(from.getTime()) ? { gte: from } : {}), ...(to && !Number.isNaN(to.getTime()) ? { lt: new Date(to.getTime() + 86_400_000) } : {}) } }
        : {}),
    };
    const [items, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        select: { id: true, adminUserId: true, adminName: true, action: true, module: true, entityType: true, entityId: true, entityLabel: true, summary: true, createdAt: true },
      }),
      this.prisma.auditLog.count({ where }),
    ]);
    return { items, total, page, pageSize: PAGE_SIZE };
  }

  get(id: string) {
    return this.prisma.auditLog.findUnique({ where: { id } });
  }

  async filters() {
    const [users, modules, entityTypes] = await Promise.all([
      this.prisma.adminUser.findMany({ orderBy: { name: 'asc' }, select: { id: true, name: true } }),
      this.prisma.auditLog.findMany({ distinct: ['module'], select: { module: true }, orderBy: { module: 'asc' } }),
      this.prisma.auditLog.findMany({ distinct: ['entityType'], where: { entityType: { not: null } }, select: { entityType: true }, orderBy: { entityType: 'asc' } }),
    ]);
    return { users, modules: modules.map((m) => m.module), entityTypes: entityTypes.map((e) => e.entityType) };
  }

  recentForUser(adminUserId: string, take = 10) {
    return this.prisma.auditLog.findMany({ where: { adminUserId }, orderBy: { createdAt: 'desc' }, take, select: { id: true, action: true, module: true, summary: true, createdAt: true } });
  }
}
