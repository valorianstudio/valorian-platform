import { ConflictException, Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { ALL_PERMISSION_KEYS, SUPER_ROLE_KEY } from '../rbac/permissions';
import { validatePassword } from '../rbac/password-policy';
import { SecuritySettingsService } from '../rbac/security-settings.service';
import { ChangePasswordDto, UpdateProfileDto } from './dto/profile.dto';

export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  role: { id: string; key: string; name: string } | null;
  isSuper: boolean;
  permissions: string[];
  mustChangePassword: boolean;
  totpEnabled: boolean;
  tokenVersion: number;
  lastLoginAt: Date | null;
  createdAt: Date;
}

const profileInclude = {
  roleRef: { select: { id: true, key: true, name: true, active: true, permissions: { select: { permission: { select: { key: true } } } } } },
} satisfies Prisma.AdminUserInclude;

type UserWithRole = Prisma.AdminUserGetPayload<{ include: typeof profileInclude }>;

const CACHE_MS = 10_000;

@Injectable()
export class AdminUsersService {
  private readonly cache = new Map<string, { profile: AdminProfile | null; expires: number }>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly security: SecuritySettingsService,
  ) {}

  /** Drop cached permission snapshots. Call after any role, permission or user change. */
  invalidateProfiles(): void {
    this.cache.clear();
  }

  toProfile(user: UserWithRole): AdminProfile {
    const role = user.roleRef;
    const isSuper = role?.key === SUPER_ROLE_KEY;
    const permissions = isSuper ? ALL_PERMISSION_KEYS : role?.active ? role.permissions.map((p) => p.permission.key) : [];
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: role ? { id: role.id, key: role.key, name: role.name } : null,
      isSuper,
      permissions,
      mustChangePassword: user.mustChangePassword,
      totpEnabled: user.totpEnabled,
      tokenVersion: user.tokenVersion,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
    };
  }

  async findActiveProfile(id: string): Promise<AdminProfile | null> {
    const hit = this.cache.get(id);
    if (hit && hit.expires > Date.now()) return hit.profile;
    const user = await this.prisma.adminUser.findFirst({ where: { id, isActive: true }, include: profileInclude });
    const profile = user ? this.toProfile(user) : null;
    this.cache.set(id, { profile, expires: Date.now() + CACHE_MS });
    return profile;
  }

  findByEmail(email: string) {
    return this.prisma.adminUser.findUnique({ where: { email } });
  }

  async markLoggedIn(id: string): Promise<void> {
    await this.prisma.adminUser.update({ where: { id }, data: { lastLoginAt: new Date(), failedLogins: 0, lockedUntil: null } });
    this.invalidateProfiles();
  }

  async updateProfile(id: string, dto: UpdateProfileDto): Promise<AdminProfile> {
    try {
      const user = await this.prisma.adminUser.update({ where: { id }, data: { name: dto.name, email: dto.email }, include: profileInclude });
      this.invalidateProfiles();
      return this.toProfile(user);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('That email address is already in use.');
      }
      throw error;
    }
  }

  /** Verifies the current password, applies the policy, rotates the hash and ends all other sessions. */
  async changePassword(id: string, dto: ChangePasswordDto): Promise<{ tokenVersion: number }> {
    const user = await this.prisma.adminUser.findUnique({ where: { id } });
    if (!user || !(await argon2.verify(user.passwordHash, dto.currentPassword))) {
      throw new UnauthorizedException('Current password is incorrect.');
    }
    if (dto.currentPassword === dto.newPassword) {
      throw new UnprocessableEntityException('New password must be different from the current one.');
    }
    const { minPasswordLength } = await this.security.get();
    const problem = validatePassword(dto.newPassword, { email: user.email, name: user.name }, minPasswordLength);
    if (problem) throw new UnprocessableEntityException(problem);

    const updated = await this.prisma.adminUser.update({
      where: { id },
      data: { passwordHash: await argon2.hash(dto.newPassword), mustChangePassword: false, passwordChangedAt: new Date(), tokenVersion: { increment: 1 } },
      select: { tokenVersion: true },
    });
    this.invalidateProfiles();
    return updated;
  }

  async verifyPassword(id: string, password: string): Promise<boolean> {
    const user = await this.prisma.adminUser.findUnique({ where: { id }, select: { passwordHash: true } });
    return Boolean(user && (await argon2.verify(user.passwordHash, password)));
  }
}
