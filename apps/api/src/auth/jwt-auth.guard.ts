import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import type { FastifyRequest } from 'fastify';
import { AdminProfile, AdminUsersService } from '../admin-users/admin-users.service';
import { ALLOW_PASSWORD_PENDING, ANY_ADMIN, REQUIRE_ALL, REQUIRE_ANY, REQUIRE_SUPER } from './permissions.decorator';
import { SESSION_COOKIE } from './session.constants';

export type AuthenticatedRequest = FastifyRequest & { user: AdminProfile };

export interface SessionPayload {
  sub: string;
  tv?: number;
  purpose?: string;
}

const DENIED = 'You do not have permission to perform this action.';

/**
 * Authenticates the session cookie and enforces permissions on the backend.
 * Default-deny: a protected route must declare what it needs (RequirePermission, RequireAnyPermission,
 * RequireSuper or AnyAdmin). Super Admins pass every permission check.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly users: AdminUsersService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = request.cookies[SESSION_COOKIE];
    if (!token) throw new UnauthorizedException('Authentication required.');

    let payload: SessionPayload;
    try {
      payload = await this.jwt.verifyAsync<SessionPayload>(token);
    } catch {
      throw new UnauthorizedException('Session expired. Please sign in again.');
    }
    if (payload.purpose) throw new UnauthorizedException('Session expired. Please sign in again.');

    const user = await this.users.findActiveProfile(payload.sub);
    if (!user || (payload.tv ?? 0) !== user.tokenVersion) throw new UnauthorizedException('Session expired. Please sign in again.');
    request.user = user;

    const read = <T>(key: string) => this.reflector.getAllAndOverride<T | undefined>(key, [context.getHandler(), context.getClass()]);
    if (user.mustChangePassword && !read<boolean>(ALLOW_PASSWORD_PENDING)) {
      throw new ForbiddenException({ message: 'You must change your password before continuing.', code: 'PASSWORD_CHANGE_REQUIRED' });
    }
    if (user.isSuper) return true;

    if (read<boolean>(REQUIRE_SUPER)) throw new ForbiddenException(DENIED);
    const all = read<string[]>(REQUIRE_ALL);
    const any = read<string[]>(REQUIRE_ANY);
    if (read<boolean>(ANY_ADMIN) && !all && !any) return true;
    if (!all && !any) throw new ForbiddenException(DENIED);

    const held = new Set(user.permissions);
    if (all && !all.every((key) => held.has(key))) throw new ForbiddenException(DENIED);
    if (any && !any.some((key) => held.has(key))) throw new ForbiddenException(DENIED);
    return true;
  }
}

/** For checks that depend on the request body (for example publishing while updating). */
export function assertPermission(user: AdminProfile, key: string): void {
  if (!user.isSuper && !user.permissions.includes(key)) throw new ForbiddenException(DENIED);
}
