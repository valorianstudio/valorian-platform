import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { EstimatorCurrency, MilestoneStatus, Prisma, ProjectStatus } from '@prisma/client';
import type { AdminProfile } from '../admin-users/admin-users.service';
import { AuditRequestMeta, AuditService } from '../audit/audit.service';
import { actorOf, changed, emptyToNull } from '../portal/portal-utils';
import { PrismaService } from '../prisma/prisma.service';

const PAGE_SIZE = 20;

export interface ProjectInput {
  name: string;
  description?: string | null;
  organizationId: string;
  status?: ProjectStatus;
  startDate?: Date | null;
  estimatedEndDate?: Date | null;
  actualEndDate?: Date | null;
  progressPercentage?: number;
  technologies?: string[];
  leadId?: string | null;
  finalValue?: number | null;
  finalCurrency?: EstimatorCurrency | null;
  internalNotes?: string | null;
}

export interface MilestoneInput {
  title: string;
  description?: string | null;
  status?: MilestoneStatus;
  dueDate?: Date | null;
  order?: number;
}

export interface UpdateInput {
  title: string;
  content: string;
  visibleToClient: boolean;
}

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async list(query: { q?: string; status?: string; client?: string; archived?: string; page?: string }) {
    const page = Math.max(1, Number.parseInt(query.page ?? '1', 10) || 1);
    const q = query.q?.trim();
    const where: Prisma.ProjectWhereInput = {
      archivedAt: query.archived === 'true' ? { not: null } : null,
      ...(query.status && Object.hasOwn(ProjectStatus, query.status) ? { status: query.status as ProjectStatus } : {}),
      ...(query.client ? { organizationId: query.client } : {}),
      ...(q ? { OR: [{ name: { contains: q, mode: 'insensitive' } }, { projectCode: { contains: q, mode: 'insensitive' } }, { organization: { companyName: { contains: q, mode: 'insensitive' } } }] } : {}),
    };
    const [items, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        select: { id: true, projectCode: true, name: true, status: true, progressPercentage: true, estimatedEndDate: true, archivedAt: true, organization: { select: { id: true, companyName: true } }, _count: { select: { requests: { where: { status: { in: ['OPEN', 'REVIEWING'] } } } } } },
      }),
      this.prisma.project.count({ where }),
    ]);
    const unread = await this.prisma.projectMessage.groupBy({ by: ['projectId'], where: { projectId: { in: items.map((p) => p.id) }, senderType: 'CLIENT', readAt: null }, _count: true });
    const unreadBy = new Map(unread.map((u) => [u.projectId, u._count]));
    return { items: items.map(({ _count, ...p }) => ({ ...p, openRequests: _count.requests, unreadMessages: unreadBy.get(p.id) ?? 0 })), total, page, pageSize: PAGE_SIZE };
  }

  /** WON leads that do not have a project yet. */
  leadOptions() {
    return this.prisma.lead.findMany({
      where: { status: 'WON', project: null },
      orderBy: { wonAt: 'desc' },
      take: 100,
      select: { id: true, referenceCode: true, name: true, companyName: true, email: true, phone: true, projectType: true, finalProjectValue: true, finalCurrency: true },
    });
  }

  /** The project created from a lead, if any (null when none). */
  async byLead(leadId: string) {
    return (await this.prisma.project.findUnique({ where: { leadId }, select: { id: true, projectCode: true, name: true } })) ?? { id: null };
  }

  async get(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        organization: { select: { id: true, companyName: true } },
        lead: { select: { id: true, referenceCode: true, name: true } },
        milestones: { orderBy: [{ order: 'asc' }, { createdAt: 'asc' }] },
        updates: { orderBy: { createdAt: 'desc' } },
        files: { orderBy: { createdAt: 'desc' }, select: { id: true, name: true, fileType: true, size: true, category: true, uploadedByName: true, visibleToClient: true, createdAt: true } },
        messages: { orderBy: { createdAt: 'asc' } },
        requests: { orderBy: { createdAt: 'desc' }, include: { createdBy: { select: { name: true } } } },
      },
    });
    if (!project) throw new NotFoundException('Project not found.');
    // Opening the project marks the client's messages as seen by the team.
    await this.prisma.projectMessage.updateMany({ where: { projectId: id, senderType: 'CLIENT', readAt: null }, data: { readAt: new Date() } });
    return project;
  }

  private async nextCode(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.prisma.project.count({ where: { projectCode: { startsWith: `VAL-${year}-` } } });
    for (let n = count + 1; ; n += 1) {
      const code = `VAL-${year}-${String(n).padStart(3, '0')}`;
      if (!(await this.prisma.project.findUnique({ where: { projectCode: code }, select: { id: true } }))) return code;
    }
  }

  async create(admin: AdminProfile, input: ProjectInput, meta: AuditRequestMeta) {
    const org = await this.prisma.clientOrganization.findUnique({ where: { id: input.organizationId }, select: { id: true, companyName: true } });
    if (!org) throw new BadRequestException('Choose a client for this project.');

    let leadData: Partial<Prisma.ProjectUncheckedCreateInput> = {};
    if (input.leadId) {
      const lead = await this.prisma.lead.findUnique({ where: { id: input.leadId }, select: { id: true, referenceCode: true, estimatedMin: true, estimatedMax: true, currency: true, finalProjectValue: true, finalCurrency: true, project: { select: { id: true } } } });
      if (!lead) throw new BadRequestException('That lead no longer exists.');
      if (lead.project) throw new ConflictException('That lead already has a project.');
      // The lead is only read: CRM history stays untouched.
      leadData = { leadId: lead.id, originalEstimateMin: lead.estimatedMin, originalEstimateMax: lead.estimatedMax, estimateCurrency: lead.currency, finalValue: input.finalValue ?? lead.finalProjectValue, finalCurrency: input.finalCurrency ?? lead.finalCurrency };
    }

    const status = input.status ?? 'DISCOVERY';
    const project = await this.prisma.project.create({
      data: {
        projectCode: await this.nextCode(),
        name: input.name,
        description: emptyToNull(input.description),
        organizationId: org.id,
        status,
        startDate: input.startDate ?? null,
        estimatedEndDate: input.estimatedEndDate ?? null,
        progressPercentage: input.progressPercentage ?? 0,
        technologies: input.technologies ?? [],
        internalNotes: emptyToNull(input.internalNotes),
        ...(input.leadId ? {} : { finalValue: input.finalValue ?? null, finalCurrency: input.finalCurrency ?? null }),
        ...leadData,
      },
      select: { id: true, projectCode: true, name: true },
    });
    await this.audit.log({ actor: actorOf(admin), action: 'CREATE', module: 'projects', entityType: 'Project', entityId: project.id, entityLabel: `${project.projectCode} ${project.name}`, summary: `Created project ${project.projectCode} for ${org.companyName}${input.leadId ? ' from a won lead' : ''}`, meta });
    return project;
  }

  async update(admin: AdminProfile, id: string, input: Partial<Omit<ProjectInput, 'organizationId' | 'leadId'>>, meta: AuditRequestMeta) {
    const before = await this.prisma.project.findUnique({ where: { id } });
    if (!before) throw new NotFoundException('Project not found.');
    const data: Prisma.ProjectUncheckedUpdateInput = {};
    if (input.name !== undefined) data.name = input.name;
    if (input.description !== undefined) data.description = emptyToNull(input.description);
    if (input.internalNotes !== undefined) data.internalNotes = emptyToNull(input.internalNotes);
    if (input.technologies !== undefined) data.technologies = input.technologies;
    if (input.startDate !== undefined) data.startDate = input.startDate;
    if (input.estimatedEndDate !== undefined) data.estimatedEndDate = input.estimatedEndDate;
    if (input.actualEndDate !== undefined) data.actualEndDate = input.actualEndDate;
    if (input.progressPercentage !== undefined) data.progressPercentage = input.progressPercentage;
    if (input.finalValue !== undefined) data.finalValue = input.finalValue;
    if (input.finalCurrency !== undefined) data.finalCurrency = input.finalCurrency;
    if (input.status !== undefined) {
      data.status = input.status;
      if (input.status === 'COMPLETED') {
        data.progressPercentage = input.progressPercentage ?? 100;
        if (!before.actualEndDate && input.actualEndDate === undefined) data.actualEndDate = new Date();
      }
    }

    const { internalNotes: notes, ...visible } = data as Record<string, unknown>;
    const diff = changed(before as unknown as Record<string, unknown>, visible);
    if (notes !== undefined && notes !== before.internalNotes) diff.internalNotes = { before: '(hidden)', after: '(updated)' };
    if (Object.keys(diff).length === 0) return { ok: true };
    await this.prisma.project.update({ where: { id }, data });
    await this.audit.log({
      actor: actorOf(admin),
      action: diff.status ? 'STATUS_CHANGE' : 'UPDATE',
      module: 'projects',
      entityType: 'Project',
      entityId: id,
      entityLabel: `${before.projectCode} ${before.name}`,
      summary: diff.status ? `Moved ${before.projectCode} from ${before.status} to ${input.status}` : `Updated project ${before.projectCode}`,
      changes: diff,
      meta,
    });
    return { ok: true };
  }

  async setArchived(admin: AdminProfile, id: string, archived: boolean, meta: AuditRequestMeta) {
    const project = await this.prisma.project.findUnique({ where: { id }, select: { projectCode: true, name: true, archivedAt: true } });
    if (!project) throw new NotFoundException('Project not found.');
    if (Boolean(project.archivedAt) === archived) return { ok: true };
    await this.prisma.project.update({ where: { id }, data: { archivedAt: archived ? new Date() : null } });
    await this.audit.log({ actor: actorOf(admin), action: archived ? 'ARCHIVE' : 'RESTORE', module: 'projects', entityType: 'Project', entityId: id, entityLabel: `${project.projectCode} ${project.name}`, summary: `${archived ? 'Archived' : 'Restored'} project ${project.projectCode}`, meta });
    return { ok: true };
  }

  /* ---------- milestones ---------- */

  private async projectLabel(id: string) {
    const project = await this.prisma.project.findUnique({ where: { id }, select: { projectCode: true, name: true } });
    if (!project) throw new NotFoundException('Project not found.');
    return project;
  }

  async addMilestone(admin: AdminProfile, projectId: string, input: MilestoneInput, meta: AuditRequestMeta) {
    const project = await this.projectLabel(projectId);
    const last = await this.prisma.projectMilestone.aggregate({ where: { projectId }, _max: { order: true } });
    const status = input.status ?? 'PENDING';
    const milestone = await this.prisma.projectMilestone.create({
      data: { projectId, title: input.title, description: emptyToNull(input.description), status, dueDate: input.dueDate ?? null, completedDate: status === 'COMPLETED' ? new Date() : null, order: input.order ?? (last._max.order ?? 0) + 1 },
    });
    await this.audit.log({ actor: actorOf(admin), action: 'CREATE', module: 'projects', entityType: 'ProjectMilestone', entityId: milestone.id, entityLabel: milestone.title, summary: `Added milestone "${milestone.title}" to ${project.projectCode}`, meta });
    return milestone;
  }

  async updateMilestone(admin: AdminProfile, projectId: string, id: string, input: Partial<MilestoneInput>, meta: AuditRequestMeta) {
    const before = await this.prisma.projectMilestone.findFirst({ where: { id, projectId } });
    if (!before) throw new NotFoundException('Milestone not found.');
    const data: Prisma.ProjectMilestoneUpdateInput = {};
    if (input.title !== undefined) data.title = input.title;
    if (input.description !== undefined) data.description = emptyToNull(input.description);
    if (input.dueDate !== undefined) data.dueDate = input.dueDate;
    if (input.order !== undefined) data.order = input.order;
    if (input.status !== undefined) {
      data.status = input.status;
      data.completedDate = input.status === 'COMPLETED' ? (before.completedDate ?? new Date()) : null;
    }
    const diff = changed(before as unknown as Record<string, unknown>, { title: data.title, description: data.description, dueDate: data.dueDate, order: data.order, status: data.status });
    if (Object.keys(diff).length === 0) return before;
    const updated = await this.prisma.projectMilestone.update({ where: { id }, data });
    const project = await this.projectLabel(projectId);
    await this.audit.log({ actor: actorOf(admin), action: diff.status ? 'STATUS_CHANGE' : 'UPDATE', module: 'projects', entityType: 'ProjectMilestone', entityId: id, entityLabel: before.title, summary: `Updated milestone "${before.title}" on ${project.projectCode}`, changes: diff, meta });
    return updated;
  }

  async deleteMilestone(admin: AdminProfile, projectId: string, id: string, meta: AuditRequestMeta) {
    const milestone = await this.prisma.projectMilestone.findFirst({ where: { id, projectId } });
    if (!milestone) throw new NotFoundException('Milestone not found.');
    await this.prisma.projectMilestone.delete({ where: { id } });
    const project = await this.projectLabel(projectId);
    await this.audit.log({ actor: actorOf(admin), action: 'DELETE', module: 'projects', entityType: 'ProjectMilestone', entityId: id, entityLabel: milestone.title, summary: `Removed milestone "${milestone.title}" from ${project.projectCode}`, meta });
  }

  /* ---------- updates ---------- */

  async addUpdate(admin: AdminProfile, projectId: string, input: UpdateInput, meta: AuditRequestMeta) {
    const project = await this.projectLabel(projectId);
    const update = await this.prisma.projectUpdate.create({ data: { projectId, title: input.title, content: input.content, visibleToClient: input.visibleToClient, createdById: admin.id, createdByName: admin.name } });
    await this.audit.log({ actor: actorOf(admin), action: input.visibleToClient ? 'PUBLISH' : 'CREATE', module: 'projects', entityType: 'ProjectUpdate', entityId: update.id, entityLabel: update.title, summary: `${input.visibleToClient ? 'Published' : 'Saved internal'} update "${update.title}" on ${project.projectCode}`, meta });
    return update;
  }

  async editUpdate(admin: AdminProfile, projectId: string, id: string, input: Partial<UpdateInput>, meta: AuditRequestMeta) {
    const before = await this.prisma.projectUpdate.findFirst({ where: { id, projectId } });
    if (!before) throw new NotFoundException('Update not found.');
    const diff = changed({ title: before.title, visibleToClient: before.visibleToClient, content: before.content } as Record<string, unknown>, { title: input.title, visibleToClient: input.visibleToClient, content: input.content });
    if (Object.keys(diff).length === 0) return before;
    const updated = await this.prisma.projectUpdate.update({ where: { id }, data: input });
    const project = await this.projectLabel(projectId);
    const { content: _content, ...logged } = diff;
    await this.audit.log({ actor: actorOf(admin), action: diff.visibleToClient ? (input.visibleToClient ? 'PUBLISH' : 'UNPUBLISH') : 'UPDATE', module: 'projects', entityType: 'ProjectUpdate', entityId: id, entityLabel: before.title, summary: `Edited update "${before.title}" on ${project.projectCode}`, changes: { ...logged, ...(_content ? { content: { before: '(hidden)', after: '(edited)' } } : {}) }, meta });
    return updated;
  }

  async deleteUpdate(admin: AdminProfile, projectId: string, id: string, meta: AuditRequestMeta) {
    const update = await this.prisma.projectUpdate.findFirst({ where: { id, projectId } });
    if (!update) throw new NotFoundException('Update not found.');
    await this.prisma.projectUpdate.delete({ where: { id } });
    const project = await this.projectLabel(projectId);
    await this.audit.log({ actor: actorOf(admin), action: 'DELETE', module: 'projects', entityType: 'ProjectUpdate', entityId: id, entityLabel: update.title, summary: `Deleted update "${update.title}" from ${project.projectCode}`, meta });
  }
}
