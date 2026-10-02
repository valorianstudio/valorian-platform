import { BadRequestException, Body, ConflictException, Controller, Delete, ForbiddenException, Get, HttpCode, NotFoundException, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { FastifyRequest } from 'fastify';
import { z } from 'zod';
import { AdminProfile, AdminUsersService } from '../admin-users/admin-users.service';
import { AuditService } from '../audit/audit.service';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequireSuper } from '../auth/permissions.decorator';
import { ZodBodyPipe } from '../cms/zod-body.pipe';
import { PrismaService } from '../prisma/prisma.service';
import { ALL_PERMISSION_KEYS, PERMISSIONS, SUPER_ONLY, SUPER_ROLE_KEY } from '../rbac/permissions';

const name = z.string().trim().min(2).max(60);
const description = z.string().trim().max(240).transform((v) => (v === '' ? null : v)).nullable().optional();
const permissions = z.array(z.string().max(60)).max(100);
const createSchema = z.object({ name, description, permissions });
const updateSchema = z.object({ name: name.optional(), description, active: z.boolean().optional(), permissions: permissions.optional() });

const slug = (value: string) => value.toUpperCase().replace(/[^A-Z0-9]+/g, '_').replace(/^_|_$/g, '').slice(0, 40) || 'ROLE';
const meta = (request: FastifyRequest) => ({ ip: request.ip, userAgent: request.headers['user-agent'] });

@Controller('admin/roles')
@UseGuards(JwtAuthGuard)
@RequireSuper()
export class RolesController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly profiles: AdminUsersService,
    private readonly audit: AuditService,
  ) {}

  @Get('permissions')
  catalogue() {
    return PERMISSIONS.map((p) => ({ ...p, superOnly: SUPER_ONLY.includes(p.key) }));
  }

  @Get()
  async list() {
    const roles = await this.prisma.role.findMany({ orderBy: [{ isSystem: 'desc' }, { name: 'asc' }], include: { _count: { select: { users: true, permissions: true } } } });
    return roles.map(({ _count, ...role }) => ({ ...role, userCount: _count.users, permissionCount: _count.permissions }));
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    const role = await this.prisma.role.findUnique({ where: { id }, include: { permissions: { select: { permission: { select: { key: true } } } }, _count: { select: { users: true } } } });
    if (!role) throw new NotFoundException('Role not found.');
    const { permissions, _count, ...rest } = role;
    return { ...rest, permissions: rest.key === SUPER_ROLE_KEY ? ALL_PERMISSION_KEYS : permissions.map((p) => p.permission.key), userCount: _count.users };
  }

  private async permissionIds(keys: string[]) {
    const unique = [...new Set(keys)];
    const unknown = unique.filter((k) => !ALL_PERMISSION_KEYS.includes(k));
    if (unknown.length > 0) throw new BadRequestException('Unknown permission.');
    if (unique.some((k) => SUPER_ONLY.includes(k))) throw new BadRequestException('Roles and security permissions are reserved for Super Admins.');
    const rows = await this.prisma.permission.findMany({ where: { key: { in: unique } }, select: { id: true, key: true } });
    return rows;
  }

  @Post()
  async create(@CurrentUser() actor: AdminProfile, @Body(new ZodBodyPipe(createSchema)) body: z.infer<typeof createSchema>, @Req() request: FastifyRequest) {
    const rows = await this.permissionIds(body.permissions);
    let key = slug(body.name);
    for (let n = 2; await this.prisma.role.findUnique({ where: { key } }); n += 1) key = `${slug(body.name)}_${n}`;
    try {
      const role = await this.prisma.role.create({
        data: { key, name: body.name, description: body.description ?? null, isSystem: false, permissions: { create: rows.map((r) => ({ permissionId: r.id })) } },
        select: { id: true, name: true },
      });
      await this.audit.log({ actor: { id: actor.id, name: actor.name, email: actor.email }, action: 'CREATE', module: 'roles', entityType: 'Role', entityId: role.id, entityLabel: role.name, summary: `Created role ${role.name} with ${rows.length} permissions`, changes: { permissions: { before: null, after: rows.map((r) => r.key) } }, meta: meta(request) });
      return role;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') throw new ConflictException('A role with that name already exists.');
      throw error;
    }
  }

  @Patch(':id')
  async update(@CurrentUser() actor: AdminProfile, @Param('id') id: string, @Body(new ZodBodyPipe(updateSchema)) body: z.infer<typeof updateSchema>, @Req() request: FastifyRequest) {
    const role = await this.prisma.role.findUnique({ where: { id }, include: { permissions: { select: { permission: { select: { key: true } } } } } });
    if (!role) throw new NotFoundException('Role not found.');
    const isSuperRole = role.key === SUPER_ROLE_KEY;
    if (isSuperRole && (body.permissions || body.active === false || body.name)) throw new ForbiddenException('The Super Admin role cannot be changed.');
    if (role.isSystem && (body.name || body.active === false)) throw new ForbiddenException('Built-in roles cannot be renamed or deactivated.');

    const before = role.permissions.map((p) => p.permission.key).sort();
    const changes: Record<string, { before: unknown; after: unknown }> = {};
    const data: Prisma.RoleUpdateInput = {};
    if (body.name !== undefined && body.name !== role.name) {
      data.name = body.name;
      changes.name = { before: role.name, after: body.name };
    }
    if (body.description !== undefined && body.description !== role.description) {
      data.description = body.description;
      changes.description = { before: role.description, after: body.description };
    }
    if (body.active !== undefined && body.active !== role.active) {
      if (!body.active && (await this.prisma.adminUser.count({ where: { roleId: id } })) > 0) throw new ConflictException('Reassign the users in this role before deactivating it.');
      data.active = body.active;
      changes.active = { before: role.active, after: body.active };
    }

    let rows: { id: string; key: string }[] | null = null;
    if (body.permissions) {
      rows = await this.permissionIds(body.permissions);
      const after = rows.map((r) => r.key).sort();
      const added = after.filter((k) => !before.includes(k));
      const removed = before.filter((k) => !after.includes(k));
      if (added.length || removed.length) changes.permissions = { before: { removed }, after: { added } };
      else rows = null;
    }
    if (Object.keys(changes).length === 0) return this.get(id);

    try {
      await this.prisma.$transaction(async (tx) => {
        if (rows) {
          await tx.rolePermission.deleteMany({ where: { roleId: id } });
          await tx.rolePermission.createMany({ data: rows.map((r) => ({ roleId: id, permissionId: r.id })) });
        }
        await tx.role.update({ where: { id }, data });
        // Sessions of users in this role pick up new permissions immediately via the cache reset below.
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') throw new ConflictException('A role with that name already exists.');
      throw error;
    }
    this.profiles.invalidateProfiles();
    await this.audit.log({
      actor: { id: actor.id, name: actor.name, email: actor.email },
      action: changes.permissions ? 'ROLE_CHANGE' : 'UPDATE',
      module: 'roles',
      entityType: 'Role',
      entityId: id,
      entityLabel: body.name ?? role.name,
      summary: changes.permissions ? `Changed permissions of role ${role.name}` : `Updated role ${role.name}`,
      changes,
      meta: meta(request),
    });
    return this.get(id);
  }

  @Post(':id/duplicate')
  @HttpCode(201)
  async duplicate(@CurrentUser() actor: AdminProfile, @Param('id') id: string, @Req() request: FastifyRequest) {
    const role = await this.prisma.role.findUnique({ where: { id }, include: { permissions: { select: { permissionId: true, permission: { select: { key: true } } } } } });
    if (!role) throw new NotFoundException('Role not found.');
    let name = `${role.name} copy`;
    for (let n = 2; await this.prisma.role.findUnique({ where: { name } }); n += 1) name = `${role.name} copy ${n}`;
    let key = slug(name);
    for (let n = 2; await this.prisma.role.findUnique({ where: { key } }); n += 1) key = `${slug(name)}_${n}`;
    const copy = await this.prisma.role.create({
      data: { key, name, description: role.description, isSystem: false, permissions: { create: role.permissions.filter((p) => !SUPER_ONLY.includes(p.permission.key)).map((p) => ({ permissionId: p.permissionId })) } },
      select: { id: true, name: true },
    });
    await this.audit.log({ actor: { id: actor.id, name: actor.name, email: actor.email }, action: 'CREATE', module: 'roles', entityType: 'Role', entityId: copy.id, entityLabel: copy.name, summary: `Duplicated role ${role.name} as ${copy.name}`, meta: meta(request) });
    return copy;
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@CurrentUser() actor: AdminProfile, @Param('id') id: string, @Req() request: FastifyRequest): Promise<void> {
    const role = await this.prisma.role.findUnique({ where: { id }, include: { _count: { select: { users: true } } } });
    if (!role) throw new NotFoundException('Role not found.');
    if (role.isSystem) throw new ForbiddenException('Built-in roles cannot be deleted.');
    if (role._count.users > 0) throw new ConflictException('Reassign the users in this role before deleting it.');
    await this.prisma.role.delete({ where: { id } });
    this.profiles.invalidateProfiles();
    await this.audit.log({ actor: { id: actor.id, name: actor.name, email: actor.email }, action: 'DELETE', module: 'roles', entityType: 'Role', entityId: id, entityLabel: role.name, summary: `Deleted role ${role.name}`, meta: meta(request) });
  }
}
