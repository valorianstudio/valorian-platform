import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminUser } from '@prisma/client';
import * as argon2 from 'argon2';
import { AdminProfile, AdminUsersService } from '../admin-users/admin-users.service';
import { AuditRequestMeta, AuditService } from '../audit/audit.service';
import { PrismaService } from '../prisma/prisma.service';
import { SecuritySettingsService } from '../rbac/security-settings.service';
import { decryptSecret, encryptSecret, generateBackupCodes, generateTotpSecret, hashBackupCode, otpauthUrl, verifyTotp } from '../rbac/totp';
import { LoginDto } from './dto/login.dto';
import type { SessionPayload } from './jwt-auth.guard';

const INVALID_CREDENTIALS = 'Invalid email or password.';
const INVALID_CODE = 'Invalid verification code.';

export type LoginResult = { kind: 'session'; token: string; maxAgeSeconds: number; user: AdminProfile } | { kind: 'two-factor'; challenge: string };

@Injectable()
export class AuthService {
  private dummyHash?: Promise<string>;

  constructor(
    private readonly users: AdminUsersService,
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
    private readonly security: SecuritySettingsService,
    private readonly audit: AuditService,
  ) {}

  async login(dto: LoginDto, meta: AuditRequestMeta): Promise<LoginResult> {
    const found = await this.users.findByEmail(dto.email);
    // Verify against a dummy hash for unknown accounts so timing does not reveal them.
    const valid = await argon2.verify(found?.passwordHash ?? (await this.getDummyHash()), dto.password);
    const locked = Boolean(found?.lockedUntil && found.lockedUntil > new Date());

    if (!found || !valid || !found.isActive || locked) {
      if (found && found.isActive && !valid && !locked) await this.registerFailure(found, meta);
      throw new UnauthorizedException(INVALID_CREDENTIALS);
    }
    if (found.totpEnabled) {
      return { kind: 'two-factor', challenge: await this.jwt.signAsync({ sub: found.id, purpose: '2fa' }, { expiresIn: 300 }) };
    }
    return this.issueSession(found, meta);
  }

  async loginWithCode(challenge: string, code: string, meta: AuditRequestMeta): Promise<LoginResult> {
    let payload: SessionPayload;
    try {
      payload = await this.jwt.verifyAsync<SessionPayload>(challenge);
    } catch {
      throw new UnauthorizedException(INVALID_CODE);
    }
    const user = payload.purpose === '2fa' ? await this.prisma.adminUser.findUnique({ where: { id: payload.sub } }) : null;
    if (!user || !user.isActive || !user.totpEnabled || (user.lockedUntil && user.lockedUntil > new Date())) throw new UnauthorizedException(INVALID_CODE);

    if (!(await this.checkSecondFactor(user, code))) {
      await this.registerFailure(user, meta, 'two-factor code');
      throw new UnauthorizedException(INVALID_CODE);
    }
    return this.issueSession(user, meta);
  }

  async logout(token: string | undefined, meta: AuditRequestMeta): Promise<void> {
    if (!token) return;
    try {
      const payload = await this.jwt.verifyAsync<SessionPayload>(token);
      const user = await this.users.findActiveProfile(payload.sub);
      if (user) await this.audit.log({ actor: { id: user.id, name: user.name, email: user.email }, action: 'LOGOUT', module: 'auth', entityType: 'AdminUser', entityId: user.id, entityLabel: user.email, summary: 'Signed out', meta });
    } catch {
      /* an expired or invalid token has nothing to record */
    }
  }

  /** Signs a fresh session token. Also used after a password change, which invalidates older sessions. */
  async signSession(userId: string, tokenVersion: number): Promise<{ token: string; maxAgeSeconds: number }> {
    const { sessionHours } = await this.security.get();
    const maxAgeSeconds = sessionHours * 3600;
    return { token: await this.jwt.signAsync({ sub: userId, tv: tokenVersion }, { expiresIn: maxAgeSeconds }), maxAgeSeconds };
  }

  private async issueSession(user: AdminUser, meta: AuditRequestMeta): Promise<LoginResult> {
    await this.users.markLoggedIn(user.id);
    const profile = await this.users.findActiveProfile(user.id);
    if (!profile) throw new UnauthorizedException(INVALID_CREDENTIALS);
    const { token, maxAgeSeconds } = await this.signSession(user.id, user.tokenVersion);
    await this.audit.log({ actor: { id: user.id, name: user.name, email: user.email }, action: 'LOGIN', module: 'auth', entityType: 'AdminUser', entityId: user.id, entityLabel: user.email, summary: 'Signed in', meta });
    return { kind: 'session', token, maxAgeSeconds, user: profile };
  }

  /** Counts a failed attempt for a known account and locks it temporarily after too many. Unknown emails are never stored. */
  private async registerFailure(user: AdminUser, meta: AuditRequestMeta, what = 'sign-in'): Promise<void> {
    const settings = await this.security.get();
    const attempts = user.failedLogins + 1;
    const lock = attempts >= settings.maxFailedLogins;
    await this.prisma.adminUser.update({
      where: { id: user.id },
      data: lock ? { failedLogins: 0, lockedUntil: new Date(Date.now() + settings.lockoutMinutes * 60_000) } : { failedLogins: attempts },
    });
    await this.audit.log({
      actor: { id: user.id, name: user.name, email: user.email },
      action: 'LOGIN_FAILED',
      module: 'auth',
      entityType: 'AdminUser',
      entityId: user.id,
      entityLabel: user.email,
      summary: lock ? `Failed ${what}; account locked for ${settings.lockoutMinutes} minutes` : `Failed ${what} attempt`,
      meta,
    });
  }

  private getDummyHash(): Promise<string> {
    this.dummyHash ??= argon2.hash('valorian-dummy-password');
    return this.dummyHash;
  }

  /* ---------- two-factor authentication ---------- */

  private async checkSecondFactor(user: AdminUser, code: string): Promise<boolean> {
    const secret = user.totpSecret ? decryptSecret(user.totpSecret) : null;
    if (secret && verifyTotp(secret, code.trim())) return true;
    const hash = hashBackupCode(code);
    if (user.backupCodes.includes(hash)) {
      await this.prisma.adminUser.update({ where: { id: user.id }, data: { backupCodes: user.backupCodes.filter((c) => c !== hash) } });
      return true;
    }
    return false;
  }

  async startTwoFactorSetup(userId: string) {
    const user = await this.prisma.adminUser.findUniqueOrThrow({ where: { id: userId } });
    if (user.totpEnabled) throw new ConflictException('Two-factor authentication is already enabled.');
    const secret = generateTotpSecret();
    await this.prisma.adminUser.update({ where: { id: userId }, data: { totpSecret: encryptSecret(secret) } });
    return { secret, otpauthUrl: otpauthUrl(secret, user.email, 'Valorian Studio') };
  }

  async enableTwoFactor(userId: string, code: string, meta: AuditRequestMeta): Promise<{ backupCodes: string[] }> {
    const user = await this.prisma.adminUser.findUniqueOrThrow({ where: { id: userId } });
    const secret = user.totpSecret ? decryptSecret(user.totpSecret) : null;
    if (user.totpEnabled || !secret || !verifyTotp(secret, code.trim())) throw new UnauthorizedException(INVALID_CODE);
    const backupCodes = generateBackupCodes();
    await this.prisma.adminUser.update({ where: { id: userId }, data: { totpEnabled: true, backupCodes: backupCodes.map(hashBackupCode) } });
    this.users.invalidateProfiles();
    await this.audit.log({ actor: { id: user.id, name: user.name, email: user.email }, action: 'SETTINGS_CHANGE', module: 'security', entityType: 'AdminUser', entityId: user.id, entityLabel: user.email, summary: 'Enabled two-factor authentication', meta });
    return { backupCodes };
  }

  async disableTwoFactor(userId: string, password: string, code: string, meta: AuditRequestMeta): Promise<void> {
    const user = await this.prisma.adminUser.findUniqueOrThrow({ where: { id: userId } });
    if (!(await argon2.verify(user.passwordHash, password)) || !(await this.checkSecondFactor(user, code))) throw new UnauthorizedException('Password or verification code is incorrect.');
    await this.prisma.adminUser.update({ where: { id: userId }, data: { totpEnabled: false, totpSecret: null, backupCodes: [] } });
    this.users.invalidateProfiles();
    await this.audit.log({ actor: { id: user.id, name: user.name, email: user.email }, action: 'SETTINGS_CHANGE', module: 'security', entityType: 'AdminUser', entityId: user.id, entityLabel: user.email, summary: 'Disabled two-factor authentication', meta });
  }
}
