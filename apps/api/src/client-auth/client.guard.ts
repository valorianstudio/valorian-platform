import { CanActivate, ExecutionContext, ForbiddenException, Injectable, SetMetadata, UnauthorizedException, createParamDecorator } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { FastifyRequest } from 'fastify';
import { CLIENT_COOKIE, ClientAuthService, ClientPrincipal } from './client-auth.service';

const ALLOW_PENDING = 'client:allow-password-pending';
const OWNER_ONLY = 'client:owner-only';

export type ClientRequestContext = FastifyRequest & { client: ClientPrincipal };

/** Reachable while a first-login password change is still pending. */
export const AllowClientPasswordPending = () => SetMetadata(ALLOW_PENDING, true);
/** Only the organization owner may call this route. */
export const ClientOwnerOnly = () => SetMetadata(OWNER_ONLY, true);

export const CurrentClient = createParamDecorator((_: unknown, ctx: ExecutionContext): ClientPrincipal => ctx.switchToHttp().getRequest<ClientRequestContext>().client);

/**
 * Authenticates the client session cookie. This is a separate identity from the admin session:
 * the cookie, token purpose and user table are all different, so a client can never reach an admin route.
 */
@Injectable()
export class ClientGuard implements CanActivate {
  constructor(
    private readonly auth: ClientAuthService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<ClientRequestContext>();
    const token = (request.cookies as Record<string, string | undefined>)[CLIENT_COOKIE];
    if (!token) throw new UnauthorizedException('Authentication required.');
    const client = await this.auth.verify(token);
    if (!client) throw new UnauthorizedException('Session expired. Please sign in again.');
    request.client = client;

    const read = <T>(key: string) => this.reflector.getAllAndOverride<T | undefined>(key, [context.getHandler(), context.getClass()]);
    if (client.mustChangePassword && !read<boolean>(ALLOW_PENDING)) {
      throw new ForbiddenException({ message: 'You must change your password before continuing.', code: 'PASSWORD_CHANGE_REQUIRED' });
    }
    if (read<boolean>(OWNER_ONLY) && client.role !== 'OWNER') throw new ForbiddenException('Only the account owner can do this.');
    return true;
  }
}
