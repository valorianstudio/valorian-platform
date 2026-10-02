import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { AuditAction } from '@prisma/client';
import { Observable, from, mergeMap, tap } from 'rxjs';
import type { AuthenticatedRequest } from '../auth/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService, diffSnapshots, sanitizeSnapshot } from './audit.service';
import { ENTITY_DELEGATES, PRICE_KEYS, resolveTarget } from './audit-routes';
import type { AuditTarget } from './audit-routes';

type Row = Record<string, unknown>;
type Finder = { findUnique(args: object): Promise<Row | null> };

const LABEL_KEYS = ['name', 'title', 'referenceCode', 'label', 'question', 'clientName', 'key', 'slug', 'email', 'originalFilename', 'category', 'pageKey'];
const VERB: Record<string, string> = { create: 'Created', update: 'Updated', delete: 'Deleted', archive: 'Archived', restore: 'Restored', status: 'Changed status of', settings: 'Updated settings for', order: 'Reordered', collection: 'Updated' };

/** Records an audit entry after every successful, mapped admin mutation. Reads are never audited. */
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    if (request.method === 'GET' || request.method === 'OPTIONS') return next.handle();
    const target = resolveTarget(request.method, request.url.split('?')[0].replace(/^\/api/, ''));
    if (!target) return next.handle();

    const id = target.entityId ?? target.fixedId;
    return from(id && target.base !== 'create' ? this.load(target.entityType, id) : Promise.resolve(null)).pipe(
      mergeMap((before) =>
        next.handle().pipe(
          tap((response) => {
            void this.record(request, target, before, response).catch(() => undefined);
          }),
        ),
      ),
    );
  }

  private async load(entityType: string, id: string): Promise<Row | null> {
    const config = ENTITY_DELEGATES[entityType];
    if (!config) return null;
    const finder = (this.prisma as unknown as Record<string, Finder>)[config.delegate];
    try {
      return await finder.findUnique({ where: config.where ? config.where(id) : { id } });
    } catch {
      return null;
    }
  }

  private label(row: Row | null): string | undefined {
    if (!row) return undefined;
    for (const key of LABEL_KEYS) if (typeof row[key] === 'string' && row[key]) return String(row[key]);
    return undefined;
  }

  private async record(request: AuthenticatedRequest, target: AuditTarget, beforeRow: Row | null, response: unknown): Promise<void> {
    const responseId = response && typeof response === 'object' && typeof (response as Row).id === 'string' ? ((response as Row).id as string) : undefined;
    const id = target.entityId ?? target.fixedId ?? responseId;
    const afterRow = target.base === 'delete' || !id ? null : await this.load(target.entityType, id);
    const before = sanitizeSnapshot(beforeRow);
    const after = sanitizeSnapshot(afterRow);
    const changes = target.base === 'create' || target.base === 'delete' ? null : diffSnapshots(before, after);
    const label = this.label(afterRow) ?? this.label(beforeRow);

    let action: AuditAction;
    switch (target.base) {
      case 'create':
        action = 'CREATE';
        break;
      case 'delete':
        action = 'DELETE';
        break;
      case 'archive':
        action = 'ARCHIVE';
        break;
      case 'restore':
        action = 'RESTORE';
        break;
      case 'status':
        action = 'STATUS_CHANGE';
        break;
      case 'settings':
        action = target.module === 'pricing' ? 'PRICE_CHANGE' : 'SETTINGS_CHANGE';
        break;
      default: {
        action = 'UPDATE';
        const statusChange = changes?.status;
        if (statusChange) {
          const to = String(statusChange.after);
          const from = String(statusChange.before);
          action = to === 'PUBLISHED' ? 'PUBLISH' : from === 'PUBLISHED' ? (to === 'ARCHIVED' ? 'ARCHIVE' : 'UNPUBLISH') : to === 'ARCHIVED' ? 'ARCHIVE' : 'STATUS_CHANGE';
        } else if (target.module === 'pricing' && changes && PRICE_KEYS.some((key) => key in changes)) {
          action = 'PRICE_CHANGE';
        }
      }
    }

    // Idempotent saves that changed nothing are not worth a log line.
    if ((target.base === 'update' || target.base === 'settings') && changes && Object.keys(changes).length === 0) return;

    const verb = VERB[target.base] ?? 'Updated';
    const subject = label ? `${target.entityType} “${label}”` : target.entityType;
    let summary = target.base === 'order' ? `Reordered ${target.note ?? target.entityType}` : target.base === 'collection' ? `Updated ${target.note} of ${subject}` : target.note === 'duplicated' ? `Duplicated ${subject}` : `${verb} ${subject}`;
    if (changes?.status) summary += `: ${String(changes.status.before)} → ${String(changes.status.after)}`;
    else if (changes && Object.keys(changes).length > 0) summary += ` (${Object.keys(changes).slice(0, 6).join(', ')}${Object.keys(changes).length > 6 ? '…' : ''})`;

    const user = request.user;
    await this.audit.log({
      actor: { id: user.id, name: user.name, email: user.email },
      action,
      module: target.module,
      entityType: target.entityType,
      entityId: id,
      entityLabel: label,
      summary,
      changes: changes ?? (target.base === 'delete' ? { deleted: before ? { label } : null } : null),
      meta: { ip: request.ip, userAgent: request.headers['user-agent'] },
    });
  }
}
