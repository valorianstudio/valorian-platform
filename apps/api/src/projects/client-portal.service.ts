import { ConflictException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as argon2 from 'argon2';
import { AuditRequestMeta, AuditService } from '../audit/audit.service';
import type { ClientPrincipal } from '../client-auth/client-auth.service';
import { emptyToNull } from '../portal/portal-utils';
import { PrismaService } from '../prisma/prisma.service';
import { generateTemporaryPassword, validatePassword } from '../rbac/password-policy';
import { SecuritySettingsService } from '../rbac/security-settings.service';

/** The only project fields a client may see. Internal notes, pricing and CRM links are never selected. */
const clientProjectSelect = {
  id: true,
  projectCode: true,
  name: true,
  description: true,
  status: true,
  startDate: true,
  estimatedEndDate: true,
  actualEndDate: true,
  progressPercentage: true,
  technologies: true,
} satisfies Prisma.ProjectSelect;

const fileSelect = { id: true, name: true, fileType: true, size: true, category: true, createdAt: true } satisfies Prisma.ProjectFileSelect;

@Injectable()
export class ClientPortalService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly security: SecuritySettingsService,
  ) {}

  /** Every project query is scoped to the caller's organization in the where clause itself. */
  private own(client: ClientPrincipal): Prisma.ProjectWhereInput {
    return { organizationId: client.organizationId, archivedAt: null };
  }

  async dashboard(client: ClientPrincipal) {
    const projectIds = (await this.prisma.project.findMany({ where: this.own(client), select: { id: true } })).map((p) => p.id);
    const [projects, updates, files, messages, unread, openRequests, delayed] = await Promise.all([
      this.prisma.project.findMany({
        where: this.own(client),
        orderBy: [{ status: 'asc' }, { updatedAt: 'desc' }],
        select: { ...clientProjectSelect, milestones: { where: { status: { not: 'COMPLETED' } }, orderBy: [{ order: 'asc' }], take: 1, select: { title: true, status: true, dueDate: true } } },
      }),
      this.prisma.projectUpdate.findMany({ where: { projectId: { in: projectIds }, visibleToClient: true }, orderBy: { createdAt: 'desc' }, take: 5, select: { id: true, title: true, content: true, createdAt: true, project: { select: { id: true, name: true } } } }),
      this.prisma.projectFile.findMany({ where: { projectId: { in: projectIds }, visibleToClient: true }, orderBy: { createdAt: 'desc' }, take: 5, select: { ...fileSelect, project: { select: { id: true, name: true } } } }),
      this.prisma.projectMessage.findMany({ where: { projectId: { in: projectIds }, visibleToClient: true }, orderBy: { createdAt: 'desc' }, take: 5, select: { id: true, senderType: true, senderName: true, message: true, createdAt: true, project: { select: { id: true, name: true } } } }),
      this.prisma.projectMessage.groupBy({ by: ['projectId'], where: { projectId: { in: projectIds }, visibleToClient: true, senderType: 'TEAM', readAt: null }, _count: true }),
      this.prisma.clientRequest.count({ where: { projectId: { in: projectIds }, status: { in: ['OPEN', 'REVIEWING'] } } }),
      this.prisma.projectMilestone.count({ where: { projectId: { in: projectIds }, status: 'DELAYED' } }),
    ]);
    const unreadBy = new Map(unread.map((u) => [u.projectId, u._count]));
    return {
      companyName: client.companyName,
      projects: projects.map(({ milestones, ...p }) => ({ ...p, nextMilestone: milestones[0] ?? null, unreadMessages: unreadBy.get(p.id) ?? 0 })),
      recentUpdates: updates,
      recentFiles: files,
      latestMessages: messages,
      pending: { unreadMessages: unread.reduce((sum, u) => sum + u._count, 0), openRequests, delayedMilestones: delayed },
    };
  }

  async projects(client: ClientPrincipal) {
    return this.prisma.project.findMany({ where: this.own(client), orderBy: { createdAt: 'desc' }, select: clientProjectSelect });
  }

  async project(client: ClientPrincipal, id: string) {
    const project = await this.prisma.project.findFirst({
      where: { id, ...this.own(client) },
      select: {
        ...clientProjectSelect,
        milestones: { orderBy: [{ order: 'asc' }, { createdAt: 'asc' }], select: { id: true, title: true, description: true, status: true, dueDate: true, completedDate: true, order: true } },
        updates: { where: { visibleToClient: true }, orderBy: { createdAt: 'desc' }, take: 50, select: { id: true, title: true, content: true, createdAt: true, createdByName: true } },
        files: { where: { visibleToClient: true }, orderBy: { createdAt: 'desc' }, select: fileSelect },
        requests: { orderBy: { createdAt: 'desc' }, take: 50, select: { id: true, title: true, description: true, type: true, priority: true, status: true, createdAt: true } },
      },
    });
    if (!project) throw new NotFoundException('Project not found.');
    return project;
  }

  /* ---------- company users (owner only) ---------- */

  team(client: ClientPrincipal) {
    return this.prisma.clientUser.findMany({ where: { organizationId: client.organizationId }, orderBy: [{ role: 'asc' }, { name: 'asc' }], select: { id: true, name: true, email: true, role: true, active: true, lastLoginAt: true } });
  }

  async addMember(client: ClientPrincipal, input: { name: string; email: string; phone?: string | null }, meta: AuditRequestMeta) {
    const plain = generateTemporaryPassword();
    const minimum = (await this.security.get()).minPasswordLength;
    if (validatePassword(plain, input, minimum)) throw new UnprocessableEntityException('Could not create a password. Try again.');
    try {
      const user = await this.prisma.clientUser.create({
        data: { organizationId: client.organizationId, name: input.name, email: input.email, phone: emptyToNull(input.phone), role: 'MEMBER', passwordHash: await argon2.hash(plain), mustChangePassword: true },
        select: { id: true, name: true, email: true },
      });
      await this.audit.log({ actor: { id: null, name: `${client.name} (client)`, email: client.email }, action: 'CREATE', module: 'clients', entityType: 'ClientUser', entityId: user.id, entityLabel: user.email, summary: `${client.companyName} owner added portal user ${user.email}`, meta });
      return { ...user, temporaryPassword: plain };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') throw new ConflictException('That email address already has portal access.');
      throw error;
    }
  }

  async setMemberActive(client: ClientPrincipal, userId: string, active: boolean, meta: AuditRequestMeta) {
    // Owners manage members of their own company only, and cannot lock themselves out.
    const user = await this.prisma.clientUser.findFirst({ where: { id: userId, organizationId: client.organizationId, role: 'MEMBER' } });
    if (!user) throw new NotFoundException('User not found.');
    await this.prisma.clientUser.update({ where: { id: userId }, data: { active, ...(active ? {} : { tokenVersion: { increment: 1 } }) } });
    await this.audit.log({ actor: { id: null, name: `${client.name} (client)`, email: client.email }, action: 'STATUS_CHANGE', module: 'clients', entityType: 'ClientUser', entityId: userId, entityLabel: user.email, summary: `${client.companyName} owner ${active ? 'reactivated' : 'deactivated'} portal user ${user.email}`, meta });
    return { ok: true };
  }
}
