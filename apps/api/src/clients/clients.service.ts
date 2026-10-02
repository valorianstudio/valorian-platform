import { ConflictException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as argon2 from 'argon2';
import type { AdminProfile } from '../admin-users/admin-users.service';
import { AuditRequestMeta, AuditService } from '../audit/audit.service';
import { PrismaService } from '../prisma/prisma.service';
import { generateTemporaryPassword, validatePassword } from '../rbac/password-policy';
import { SecuritySettingsService } from '../rbac/security-settings.service';
import { actorOf, changed, emptyToNull } from '../portal/portal-utils';

const PAGE_SIZE = 20;

export interface OrgInput {
  companyName: string;
  industry?: string | null;
  website?: string | null;
  logo?: string | null;
  contactEmail: string;
  contactPhone?: string | null;
  internalNotes?: string | null;
  active?: boolean;
}

export interface UserInput {
  name: string;
  email: string;
  phone?: string | null;
  role: 'OWNER' | 'MEMBER';
  password?: string;
}

const userSelect = { id: true, name: true, email: true, phone: true, role: true, active: true, mustChangePassword: true, lastLoginAt: true, createdAt: true } satisfies Prisma.ClientUserSelect;

@Injectable()
export class ClientsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly security: SecuritySettingsService,
  ) {}

  async list(query: { q?: string; active?: string; page?: string }) {
    const page = Math.max(1, Number.parseInt(query.page ?? '1', 10) || 1);
    const q = query.q?.trim();
    const where: Prisma.ClientOrganizationWhereInput = {
      ...(query.active === 'true' ? { active: true } : query.active === 'false' ? { active: false } : {}),
      ...(q ? { OR: [{ companyName: { contains: q, mode: 'insensitive' } }, { contactEmail: { contains: q, mode: 'insensitive' } }, { users: { some: { email: { contains: q, mode: 'insensitive' } } } }] } : {}),
    };
    const [items, total] = await Promise.all([
      this.prisma.clientOrganization.findMany({
        where,
        orderBy: [{ active: 'desc' }, { companyName: 'asc' }],
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        select: { id: true, companyName: true, industry: true, contactEmail: true, active: true, createdAt: true, _count: { select: { users: true, projects: true } } },
      }),
      this.prisma.clientOrganization.count({ where }),
    ]);
    return { items: items.map(({ _count, ...org }) => ({ ...org, userCount: _count.users, projectCount: _count.projects })), total, page, pageSize: PAGE_SIZE };
  }

  /** Light list for pickers (project creation). */
  options() {
    return this.prisma.clientOrganization.findMany({ where: { active: true }, orderBy: { companyName: 'asc' }, select: { id: true, companyName: true } });
  }

  async get(id: string) {
    const org = await this.prisma.clientOrganization.findUnique({
      where: { id },
      include: {
        users: { orderBy: [{ role: 'asc' }, { name: 'asc' }], select: userSelect },
        projects: { where: { archivedAt: null }, orderBy: { createdAt: 'desc' }, select: { id: true, projectCode: true, name: true, status: true, progressPercentage: true } },
      },
    });
    if (!org) throw new NotFoundException('Client not found.');
    const activity = await this.prisma.auditLog.findMany({
      where: { module: 'clients', entityId: { in: [id, ...org.users.map((u) => u.id)] } },
      orderBy: { createdAt: 'desc' },
      take: 15,
      select: { id: true, action: true, summary: true, adminName: true, createdAt: true },
    });
    return { ...org, activity };
  }

  private async password(provided: string | undefined, who: { email: string; name: string }): Promise<{ plain: string; generated: boolean }> {
    const value = provided?.trim();
    if (!value) return { plain: generateTemporaryPassword(), generated: true };
    const problem = validatePassword(value, who, (await this.security.get()).minPasswordLength);
    if (problem) throw new UnprocessableEntityException(problem);
    return { plain: value, generated: false };
  }

  private async makeUser(orgId: string, input: UserInput) {
    const { plain, generated } = await this.password(input.password, input);
    try {
      const user = await this.prisma.clientUser.create({
        data: { organizationId: orgId, name: input.name, email: input.email, phone: emptyToNull(input.phone), role: input.role, passwordHash: await argon2.hash(plain), mustChangePassword: true },
        select: { id: true, email: true, name: true },
      });
      return { ...user, temporaryPassword: generated ? plain : null };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') throw new ConflictException('That email address already has portal access.');
      throw error;
    }
  }

  async create(admin: AdminProfile, input: OrgInput & { owner?: UserInput }, meta: AuditRequestMeta) {
    const org = await this.prisma.clientOrganization.create({
      data: { companyName: input.companyName, industry: emptyToNull(input.industry), website: emptyToNull(input.website), logo: emptyToNull(input.logo), contactEmail: input.contactEmail, contactPhone: emptyToNull(input.contactPhone), internalNotes: emptyToNull(input.internalNotes) },
      select: { id: true, companyName: true },
    });
    let owner: Awaited<ReturnType<ClientsService['makeUser']>> | null = null;
    try {
      if (input.owner) owner = await this.makeUser(org.id, { ...input.owner, role: 'OWNER' });
    } catch (error) {
      await this.prisma.clientOrganization.delete({ where: { id: org.id } });
      throw error;
    }
    await this.audit.log({ actor: actorOf(admin), action: 'CREATE', module: 'clients', entityType: 'ClientOrganization', entityId: org.id, entityLabel: org.companyName, summary: `Created client ${org.companyName}${owner ? ` with portal user ${owner.email}` : ''}`, meta });
    return { id: org.id, owner };
  }

  async update(admin: AdminProfile, id: string, input: Partial<OrgInput>, meta: AuditRequestMeta) {
    const before = await this.prisma.clientOrganization.findUnique({ where: { id } });
    if (!before) throw new NotFoundException('Client not found.');
    const data: Prisma.ClientOrganizationUpdateInput = {};
    for (const key of ['companyName', 'contactEmail'] as const) if (input[key] !== undefined) data[key] = input[key];
    for (const key of ['industry', 'website', 'logo', 'contactPhone', 'internalNotes'] as const) if (input[key] !== undefined) data[key] = emptyToNull(input[key]);
    if (input.active !== undefined) data.active = input.active;
    // Internal notes are recorded as changed but their content never enters the audit trail.
    const { internalNotes: notes, ...rest } = data as Record<string, unknown>;
    const diff = changed(before as unknown as Record<string, unknown>, rest);
    if (notes !== undefined && notes !== before.internalNotes) diff.internalNotes = { before: '(hidden)', after: '(updated)' };
    if (Object.keys(diff).length === 0) return this.get(id);
    await this.prisma.clientOrganization.update({ where: { id }, data });
    await this.audit.log({
      actor: actorOf(admin),
      action: diff.active ? 'STATUS_CHANGE' : 'UPDATE',
      module: 'clients',
      entityType: 'ClientOrganization',
      entityId: id,
      entityLabel: input.companyName ?? before.companyName,
      summary: diff.active ? `${input.active ? 'Activated' : 'Deactivated'} client ${before.companyName}` : `Updated client ${before.companyName}`,
      changes: diff,
      meta,
    });
    return this.get(id);
  }

  async addUser(admin: AdminProfile, orgId: string, input: UserInput, meta: AuditRequestMeta) {
    const org = await this.prisma.clientOrganization.findUnique({ where: { id: orgId }, select: { companyName: true } });
    if (!org) throw new NotFoundException('Client not found.');
    const user = await this.makeUser(orgId, input);
    await this.audit.log({ actor: actorOf(admin), action: 'CREATE', module: 'clients', entityType: 'ClientUser', entityId: user.id, entityLabel: user.email, summary: `Gave ${user.email} portal access for ${org.companyName} as ${input.role.toLowerCase()}`, meta });
    return user;
  }

  async updateUser(admin: AdminProfile, orgId: string, userId: string, input: { name?: string; phone?: string | null; role?: 'OWNER' | 'MEMBER'; active?: boolean }, meta: AuditRequestMeta) {
    const user = await this.prisma.clientUser.findFirst({ where: { id: userId, organizationId: orgId } });
    if (!user) throw new NotFoundException('User not found.');
    const loses = (input.role && input.role !== 'OWNER' && user.role === 'OWNER') || input.active === false;
    if (user.role === 'OWNER' && user.active && loses) {
      const others = await this.prisma.clientUser.count({ where: { organizationId: orgId, role: 'OWNER', active: true, id: { not: userId } } });
      if (others === 0) throw new ConflictException('The organization needs at least one active owner.');
    }
    const data: Prisma.ClientUserUpdateInput = {};
    if (input.name !== undefined) data.name = input.name;
    if (input.phone !== undefined) data.phone = emptyToNull(input.phone);
    if (input.role !== undefined) data.role = input.role;
    if (input.active !== undefined) {
      data.active = input.active;
      if (!input.active) data.tokenVersion = { increment: 1 };
    }
    const diff = changed(user as unknown as Record<string, unknown>, { name: data.name as string | undefined, phone: data.phone as string | null | undefined, role: input.role, active: input.active });
    if (Object.keys(diff).length === 0) return { ok: true };
    await this.prisma.clientUser.update({ where: { id: userId }, data });
    await this.audit.log({ actor: actorOf(admin), action: diff.active ? 'STATUS_CHANGE' : diff.role ? 'ROLE_CHANGE' : 'UPDATE', module: 'clients', entityType: 'ClientUser', entityId: userId, entityLabel: user.email, summary: `Updated portal user ${user.email}`, changes: diff, meta });
    return { ok: true };
  }

  async resetPassword(admin: AdminProfile, orgId: string, userId: string, meta: AuditRequestMeta) {
    const user = await this.prisma.clientUser.findFirst({ where: { id: userId, organizationId: orgId } });
    if (!user) throw new NotFoundException('User not found.');
    const plain = generateTemporaryPassword();
    await this.prisma.clientUser.update({ where: { id: userId }, data: { passwordHash: await argon2.hash(plain), mustChangePassword: true, tokenVersion: { increment: 1 }, failedLogins: 0, lockedUntil: null } });
    await this.audit.log({ actor: actorOf(admin), action: 'PASSWORD_CHANGE', module: 'clients', entityType: 'ClientUser', entityId: userId, entityLabel: user.email, summary: `Reset the portal password for ${user.email}`, meta });
    return { temporaryPassword: plain };
  }
}
