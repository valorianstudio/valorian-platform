import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { AdminProfile } from '../admin-users/admin-users.service';
import type { AuthenticatedRequest } from './jwt-auth.guard';

export const CurrentUser = createParamDecorator((_: unknown, ctx: ExecutionContext): AdminProfile => {
  return ctx.switchToHttp().getRequest<AuthenticatedRequest>().user;
});
