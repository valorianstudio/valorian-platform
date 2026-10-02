import { Injectable, UnprocessableEntityException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { validatePassword } from '../rbac/password-policy';
import { SecuritySettingsService } from '../rbac/security-settings.service';

export const CLIENT_COOKIE = 'valorian_client';
export const CLIENT_SESSION_SECONDS = 60 * 60 * 24 * 7;
const MAX_FAILURES = 5;
const LOCK_MINUTES = 15;
const INVALID = 'Invalid email or password.';

/** What the portal knows about the signed-in client. Never includes the password hash. */
export interface ClientPrincipal {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: 'OWNER' | 'MEMBER';
  organizationId: string;
  companyName: string;
  mustChangePassword: boolean;
  lastLoginAt: Date | null;
  tokenVersion: number;
}

@Injectable()
export class ClientAuthService {
  private dummyHash?: Promise<string>;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly security: SecuritySettingsService,
  ) {}

  private getDummyHash(): Promise<string> {
    this.dummyHash ??= argon2.hash('not-a-real-password');
    return this.dummyHash;
  }

  /** Signed with purpose "client" so the admin guard can never accept it, and vice versa. */
  sign(userId: string, tokenVersion: number): Promise<string> {
    return this.jwt.signAsync({ sub: userId, tv: tokenVersion, purpose: 'client' }, { expiresIn: CLIENT_SESSION_SECONDS });
  }

  async login(email: string, password: string): Promise<{ token: string; principal: ClientPrincipal }> {
    const user = await this.prisma.clientUser.findUnique({ where: { email }, include: { organization: { select: { active: true } } } });
    const valid = await argon2.verify(user?.passwordHash ?? (await this.getDummyHash()), password);
    const locked = Boolean(user?.lockedUntil && user.lockedUntil > new Date());
    if (!user || !valid || !user.active || !user.organization.active || locked) {
      if (user && user.active && !valid && !locked) {
        const failures = user.failedLogins + 1;
        await this.prisma.clientUser.update({
          where: { id: user.id },
          data: failures >= MAX_FAILURES ? { failedLogins: 0, lockedUntil: new Date(Date.now() + LOCK_MINUTES * 60_000) } : { failedLogins: failures },
        });
      }
      throw new UnauthorizedException(INVALID);
    }
    await this.prisma.clientUser.update({ where: { id: user.id }, data: { lastLoginAt: new Date(), failedLogins: 0, lockedUntil: null } });
    const principal = await this.principal(user.id);
    if (!principal) throw new UnauthorizedException(INVALID);
    return { token: await this.sign(user.id, user.tokenVersion), principal };
  }

  async principal(id: string): Promise<ClientPrincipal | null> {
    const user = await this.prisma.clientUser.findUnique({ where: { id }, include: { organization: { select: { id: true, companyName: true, active: true } } } });
    if (!user || !user.active || !user.organization.active) return null;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      organizationId: user.organization.id,
      companyName: user.organization.companyName,
      mustChangePassword: user.mustChangePassword,
      lastLoginAt: user.lastLoginAt,
      tokenVersion: user.tokenVersion,
    };
  }

  async verify(token: string): Promise<ClientPrincipal | null> {
    try {
      const payload = await this.jwt.verifyAsync<{ sub: string; tv?: number; purpose?: string }>(token);
      if (payload.purpose !== 'client') return null;
      const principal = await this.principal(payload.sub);
      return principal && principal.tokenVersion === (payload.tv ?? 0) ? principal : null;
    } catch {
      return null;
    }
  }

  /** Changing the password ends every other session and clears the forced-change flag. */
  async changePassword(client: ClientPrincipal, currentPassword: string, newPassword: string): Promise<string> {
    const row = await this.prisma.clientUser.findUnique({ where: { id: client.id }, select: { passwordHash: true } });
    if (!row || !(await argon2.verify(row.passwordHash, currentPassword))) throw new UnauthorizedException('Current password is incorrect.');
    const { minPasswordLength } = await this.security.get();
    const problem = validatePassword(newPassword, { email: client.email, name: client.name }, minPasswordLength);
    if (problem) throw new UnprocessableEntityException(problem);
    if (await argon2.verify(row.passwordHash, newPassword)) throw new UnprocessableEntityException('Choose a password different from your current one.');
    const updated = await this.prisma.clientUser.update({
      where: { id: client.id },
      data: { passwordHash: await argon2.hash(newPassword), mustChangePassword: false, tokenVersion: { increment: 1 } },
      select: { tokenVersion: true },
    });
    return this.sign(client.id, updated.tokenVersion);
  }
}
