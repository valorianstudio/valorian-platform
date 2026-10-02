import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { FastifyRequest } from 'fastify';
import { AdminProfile, AdminUsersService } from '../admin-users/admin-users.service';
import { SESSION_COOKIE } from './session.constants';

export type AuthenticatedRequest = FastifyRequest & { user: AdminProfile };

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly users: AdminUsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = request.cookies[SESSION_COOKIE];
    if (!token) throw new UnauthorizedException('Authentication required.');

    let userId: string;
    try {
      userId = (await this.jwt.verifyAsync<{ sub: string }>(token)).sub;
    } catch {
      throw new UnauthorizedException('Session expired. Please sign in again.');
    }

    const user = await this.users.findActiveProfile(userId);
    if (!user) throw new UnauthorizedException('Session expired. Please sign in again.');
    request.user = user;
    return true;
  }
}
