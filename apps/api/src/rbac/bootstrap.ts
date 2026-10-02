import type { PrismaClient } from '@prisma/client';
import { ALL_PERMISSION_KEYS, PERMISSIONS, ROLE_DEFAULTS, SUPER_ROLE_KEY } from './permissions';

/**
 * Idempotent RBAC setup, safe to run on every start and from the seed:
 * - upserts the permission catalogue,
 * - creates built-in roles once (admin edits to their permissions are preserved),
 * - keeps SUPER_ADMIN synced with the full catalogue,
 * - assigns the Super Admin role to any existing user that has no role yet.
 */
export async function ensureRbac(prisma: PrismaClient): Promise<void> {
  const known = new Set((await prisma.permission.findMany({ select: { key: true } })).map((p) => p.key));
  for (const permission of PERMISSIONS) {
    await prisma.permission.upsert({ where: { key: permission.key }, update: { module: permission.module, label: permission.label }, create: permission });
  }
  const permissions = await prisma.permission.findMany({ select: { id: true, key: true } });
  const idOf = new Map(permissions.map((p) => [p.key, p.id]));

  for (const role of ROLE_DEFAULTS) {
    const existing = await prisma.role.findUnique({ where: { key: role.key }, select: { id: true } });
    if (!existing) {
      await prisma.role.create({
        data: {
          key: role.key,
          name: role.name,
          description: role.description,
          isSystem: true,
          permissions: { create: role.permissions.filter((k) => idOf.has(k)).map((k) => ({ permissionId: idOf.get(k) as string })) },
        },
      });
    } else if (role.key !== SUPER_ROLE_KEY) {
      // Permissions introduced after the role was created are granted by default once, without undoing admin edits.
      const added = role.permissions.filter((k) => !known.has(k) && idOf.has(k));
      if (added.length > 0) await prisma.rolePermission.createMany({ data: added.map((k) => ({ roleId: existing.id, permissionId: idOf.get(k) as string })), skipDuplicates: true });
    } else {
      await prisma.rolePermission.createMany({ data: ALL_PERMISSION_KEYS.map((k) => ({ roleId: existing.id, permissionId: idOf.get(k) as string })), skipDuplicates: true });
    }
  }

  const superRole = await prisma.role.findUnique({ where: { key: SUPER_ROLE_KEY }, select: { id: true } });
  if (superRole) await prisma.adminUser.updateMany({ where: { roleId: null }, data: { roleId: superRole.id } });
  await prisma.securitySettings.upsert({ where: { id: 'security' }, update: {}, create: { id: 'security' } });
}
