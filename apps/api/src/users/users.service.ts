import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as argon2 from 'argon2';
import { AdminProfile, AdminUsersService } from '../admin-users/admin-users.service';
import { AuditRequestMeta, AuditService } from '../audit/audit.service';
import { PrismaService } from '../prisma/prisma.service';
import { generateTemporaryPassword, validatePassword } from '../rbac/password-policy';
import { SUPER_ROLE_KEY } from '../rbac/permissions';
import { SecuritySettingsService } from '../rbac/security-settings.service';

const PAGE_SIZE = 20;
const listSelect = {
  id: true,
  name: true,
  email: true,
  isActive: true,
  lastLoginAt: true,
  createdAt: true,
  mustChangePassword: true,
  totpEnabled: true,
  roleRef: { select: { id: true, key: true, name: true } },
} satisfies Prisma.AdminUserSelect;

export interface UserListQuery {
  q?: string;
  role?: string;
  active?: string;
  page?: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  roleId: string;
  isActive: boolean;
  password?: string;
  confirmPassword?: string;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  roleId?: string;
  isActive?: boolean;
  confirmPassword?: string;
}

const DENIED = 'You do not have permission to perform this action.';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly profiles: AdminUsersService,
    private readonly audit: AuditService,
    private readonly security: SecuritySettingsService,
  ) {}

  async list(query: UserListQuery) {
    const page = Math.max(1, Number.parseInt(query.page ?? '1', 10) || 1);
    const q = query.q?.trim();
    const where: Prisma.AdminUserWhereInput = {
      ...(query.role ? { roleId: query.role } : {}),
      ...(query.active === 'true' ? { isActive: true } : query.active === 'false' ? { isActive: false } : {}),
      ...(q ? { OR: [{ name: { contains: q, mode: 'insensitive' } }, { email: { contains: q, mode: 'insensitive' } }] } : {}),
    };
    const [items, total, roles] = await Promise.all([
      this.prisma.adminUser.findMany({ where, orderBy: [{ isActive: 'desc' }, { name: 'asc' }], skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE, select: listSelect }),
      this.prisma.adminUser.count({ where }),
      this.assignableRoles(),
    ]);
    return { items, total, page, pageSize: PAGE_SIZE, roles };
  }

  /** Roles the list/filter UI can show. */
  private assignableRoles() {
    return this.prisma.role.findMany({ orderBy: [{ isSystem: 'desc' }, { name: 'asc' }], select: { id: true, key: true, name: true, active: true, isSystem: true } });
  }

  async get(id: string) {
    const user = await this.prisma.adminUser.findUnique({ where: { id }, select: { ...listSelect, passwordChangedAt: true, createdById: true } });
    if (!user) throw new NotFoundException('User not found.');
    const [recent, roles] = await Promise.all([this.audit.recentForUser(id), this.assignableRoles()]);
    return { ...user, recent, roles };
  }

  /* ---------- authority rules ---------- */

  private async roleOf(roleId: string) {
    const role = await this.prisma.role.findUnique({ where: { id: roleId }, include: { permissions: { select: { permission: { select: { key: true } } } } } });
    if (!role || !role.active) throw new BadRequestException('Choose an active role.');
    return role;
  }

  private assertCanAssign(actor: AdminProfile, role: { key: string; permissions: { permission: { key: string } }[] }): void {
    if (actor.isSuper) return;
    if (role.key === SUPER_ROLE_KEY) throw new ForbiddenException(DENIED);
    const held = new Set(actor.permissions);
    // Nobody can hand out access they do not hold themselves.
    if (role.permissions.some((p) => !held.has(p.permission.key))) throw new ForbiddenException('You cannot assign a role with more access than your own.');
  }

  private async activeSuperCount(excludingId?: string): Promise<number> {
    return this.prisma.adminUser.count({ where: { isActive: true, roleRef: { key: SUPER_ROLE_KEY }, ...(excludingId ? { id: { not: excludingId } } : {}) } });
  }

  async confirm(actor: AdminProfile, password: string | undefined): Promise<void> {
    if (!password || !(await this.profiles.verifyPassword(actor.id, password))) throw new UnauthorizedException('Confirm your password to continue.');
  }

  /* ---------- mutations ---------- */

  async create(actor: AdminProfile, input: CreateUserInput, meta: AuditRequestMeta) {
    const role = await this.roleOf(input.roleId);
    this.assertCanAssign(actor, role);
    if (role.key === SUPER_ROLE_KEY) await this.confirm(actor, input.confirmPassword);

    const settings = await this.security.get();
    const provided = input.password?.trim();
    if (provided) {
      const problem = validatePassword(provided, { email: input.email, name: input.name }, settings.minPasswordLength);
      if (problem) throw new UnprocessableEntityException(problem);
    }
    const password = provided || generateTemporaryPassword();
    try {
      const user = await this.prisma.adminUser.create({
        data: { name: input.name, email: input.email, roleId: role.id, isActive: input.isActive, passwordHash: await argon2.hash(password), mustChangePassword: true, passwordChangedAt: null, createdById: actor.id },
        select: { id: true, name: true, email: true },
      });
      this.profiles.invalidateProfiles();
      await this.audit.log({
        actor: { id: actor.id, name: actor.name, email: actor.email },
        action: 'CREATE',
        module: 'users',
        entityType: 'AdminUser',
        entityId: user.id,
        entityLabel: user.email,
        summary: `Created admin user ${user.email} with role ${role.name}`,
        changes: { role: { before: null, after: role.name }, active: { before: null, after: input.isActive } },
        meta,
      });
      return { ...user, temporaryPassword: provided ? null : password };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') throw new ConflictException('That email address is already in use.');
      throw error;
    }
  }

  async update(actor: AdminProfile, id: string, input: UpdateUserInput, meta: AuditRequestMeta) {
    const target = await this.prisma.adminUser.findUnique({ where: { id }, include: { roleRef: true } });
    if (!target) throw new NotFoundException('User not found.');
    const targetIsSuper = target.roleRef?.key === SUPER_ROLE_KEY;
    if (targetIsSuper && !actor.isSuper) throw new ForbiddenException(DENIED);

    const data: Prisma.AdminUserUncheckedUpdateInput = {};
    const changes: Record<string, { before: unknown; after: unknown }> = {};
    let action: 'UPDATE' | 'ROLE_CHANGE' | 'STATUS_CHANGE' = 'UPDATE';
    let needsPassword = false;

    if (input.name !== undefined && input.name !== target.name) {
      data.name = input.name;
      changes.name = { before: target.name, after: input.name };
    }
    if (input.email !== undefined && input.email !== target.email) {
      data.email = input.email;
      changes.email = { before: target.email, after: input.email };
    }
    if (input.roleId !== undefined && input.roleId !== target.roleId) {
      if (id === actor.id) throw new ForbiddenException('You cannot change your own role.');
      const role = await this.roleOf(input.roleId);
      this.assertCanAssign(actor, role);
      if (targetIsSuper && role.key !== SUPER_ROLE_KEY && (await this.activeSuperCount(id)) === 0) throw new ConflictException('At least one active Super Admin is required.');
      if (targetIsSuper || role.key === SUPER_ROLE_KEY) needsPassword = true;
      data.roleId = role.id;
      changes.role = { before: target.roleRef?.name ?? null, after: role.name };
      action = 'ROLE_CHANGE';
    }
    if (input.isActive !== undefined && input.isActive !== target.isActive) {
      if (!input.isActive) {
        if (id === actor.id) throw new ForbiddenException('You cannot deactivate your own account.');
        if (targetIsSuper && (await this.activeSuperCount(id)) === 0) throw new ConflictException('At least one active Super Admin is required.');
        if (targetIsSuper) needsPassword = true;
        data.tokenVersion = { increment: 1 };
      }
      data.isActive = input.isActive;
      changes.active = { before: target.isActive, after: input.isActive };
      if (action === 'UPDATE') action = 'STATUS_CHANGE';
    }
    if (Object.keys(changes).length === 0) return this.get(id);
    if (needsPassword) await this.confirm(actor, input.confirmPassword);
    if (action === 'ROLE_CHANGE') data.tokenVersion = { increment: 1 };

    try {
      await this.prisma.adminUser.update({ where: { id }, data });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') throw new ConflictException('That email address is already in use.');
      throw error;
    }
    this.profiles.invalidateProfiles();
    await this.audit.log({
      actor: { id: actor.id, name: actor.name, email: actor.email },
      action,
      module: 'users',
      entityType: 'AdminUser',
      entityId: id,
      entityLabel: input.email ?? target.email,
      summary: `${action === 'ROLE_CHANGE' ? 'Changed role of' : action === 'STATUS_CHANGE' ? (input.isActive ? 'Activated' : 'Deactivated') : 'Updated'} ${target.email}`,
      changes,
      meta,
    });
    return this.get(id);
  }

  async resetPassword(actor: AdminProfile, id: string, meta: AuditRequestMeta) {
    const target = await this.prisma.adminUser.findUnique({ where: { id }, include: { roleRef: true } });
    if (!target) throw new NotFoundException('User not found.');
    if (target.roleRef?.key === SUPER_ROLE_KEY && !actor.isSuper) throw new ForbiddenException(DENIED);
    if (id === actor.id) throw new ForbiddenException('Change your own password from your profile.');

    const password = generateTemporaryPassword();
    await this.prisma.adminUser.update({
      where: { id },
      data: { passwordHash: await argon2.hash(password), mustChangePassword: true, tokenVersion: { increment: 1 }, failedLogins: 0, lockedUntil: null },
    });
    this.profiles.invalidateProfiles();
    await this.audit.log({
      actor: { id: actor.id, name: actor.name, email: actor.email },
      action: 'PASSWORD_CHANGE',
      module: 'users',
      entityType: 'AdminUser',
      entityId: id,
      entityLabel: target.email,
      summary: `Reset password for ${target.email} (change required at next sign-in)`,
      meta,
    });
    return { temporaryPassword: password };
  }

  async remove(actor: AdminProfile, id: string, confirmPassword: string | undefined, meta: AuditRequestMeta): Promise<void> {
    const target = await this.prisma.adminUser.findUnique({ where: { id }, include: { roleRef: true } });
    if (!target) throw new NotFoundException('User not found.');
    if (id === actor.id) throw new ForbiddenException('You cannot delete your own account.');
    const targetIsSuper = target.roleRef?.key === SUPER_ROLE_KEY;
    if (targetIsSuper && !actor.isSuper) throw new ForbiddenException(DENIED);
    if (targetIsSuper && (await this.activeSuperCount(id)) === 0) throw new ConflictException('At least one active Super Admin is required.');
    await this.confirm(actor, confirmPassword);

    await this.prisma.adminUser.delete({ where: { id } });
    this.profiles.invalidateProfiles();
    await this.audit.log({
      actor: { id: actor.id, name: actor.name, email: actor.email },
      action: 'DELETE',
      module: 'users',
      entityType: 'AdminUser',
      entityId: id,
      entityLabel: target.email,
      summary: `Deleted admin user ${target.email}`,
      meta,
    });
  }
}
