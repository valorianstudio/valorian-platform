import { Injectable, NotFoundException } from '@nestjs/common';
import { ClientRequestStatus, ClientRequestType, LeadPriority } from '@prisma/client';
import type { AdminProfile } from '../admin-users/admin-users.service';
import { AuditRequestMeta, AuditService } from '../audit/audit.service';
import type { ClientPrincipal } from '../client-auth/client-auth.service';
import { actorOf } from '../portal/portal-utils';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClientRequestsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async create(client: ClientPrincipal, projectId: string, input: { title: string; description: string; type: ClientRequestType; priority: LeadPriority }) {
    const project = await this.prisma.project.findFirst({ where: { id: projectId, organizationId: client.organizationId, archivedAt: null }, select: { id: true } });
    if (!project) throw new NotFoundException('Project not found.');
    return this.prisma.clientRequest.create({
      data: { projectId, createdById: client.id, ...input },
      select: { id: true, title: true, description: true, type: true, priority: true, status: true, createdAt: true },
    });
  }

  async setStatus(admin: AdminProfile, projectId: string, id: string, status: ClientRequestStatus, meta: AuditRequestMeta) {
    const request = await this.prisma.clientRequest.findFirst({ where: { id, projectId }, include: { project: { select: { projectCode: true } } } });
    if (!request) throw new NotFoundException('Request not found.');
    if (request.status === status) return { ok: true };
    await this.prisma.clientRequest.update({ where: { id }, data: { status } });
    await this.audit.log({ actor: actorOf(admin), action: 'STATUS_CHANGE', module: 'projects', entityType: 'ClientRequest', entityId: id, entityLabel: request.title, summary: `Marked request "${request.title}" on ${request.project.projectCode} as ${status}`, changes: { status: { before: request.status, after: status } }, meta });
    return { ok: true };
  }
}
