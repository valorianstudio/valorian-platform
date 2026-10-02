import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { z } from 'zod';
import type { AdminProfile } from '../admin-users/admin-users.service';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequirePermission } from '../auth/permissions.decorator';
import { ZodBodyPipe } from '../cms/zod-body.pipe';
import { CreateUserInput, UpdateUserInput, UserListQuery, UsersService } from './users.service';

const email = z.string().trim().toLowerCase().email('must be a valid email address').max(160);
const name = z.string().trim().min(1, 'is required').max(80);
const id = z.string().min(1).max(40);

const createSchema = z.object({
  name,
  email,
  roleId: id,
  isActive: z.boolean(),
  password: z.string().max(128).optional(),
  confirmPassword: z.string().max(128).optional(),
});
const updateSchema = z.object({ name: name.optional(), email: email.optional(), roleId: id.optional(), isActive: z.boolean().optional(), confirmPassword: z.string().max(128).optional() });
const confirmSchema = z.object({ confirmPassword: z.string().max(128).optional() });

const meta = (request: FastifyRequest) => ({ ip: request.ip, userAgent: request.headers['user-agent'] });

@Controller('admin/users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get()
  @RequirePermission('users.view')
  list(@Query() query: UserListQuery) {
    return this.users.list(query);
  }

  @Get(':id')
  @RequirePermission('users.view')
  get(@Param('id') userId: string) {
    return this.users.get(userId);
  }

  @Post()
  @RequirePermission('users.manage')
  create(@CurrentUser() actor: AdminProfile, @Body(new ZodBodyPipe(createSchema)) body: CreateUserInput, @Req() request: FastifyRequest) {
    return this.users.create(actor, body, meta(request));
  }

  @Patch(':id')
  @RequirePermission('users.manage')
  update(@CurrentUser() actor: AdminProfile, @Param('id') userId: string, @Body(new ZodBodyPipe(updateSchema)) body: UpdateUserInput, @Req() request: FastifyRequest) {
    return this.users.update(actor, userId, body, meta(request));
  }

  @Post(':id/reset-password')
  @HttpCode(200)
  @RequirePermission('users.manage')
  reset(@CurrentUser() actor: AdminProfile, @Param('id') userId: string, @Req() request: FastifyRequest) {
    return this.users.resetPassword(actor, userId, meta(request));
  }

  @Delete(':id')
  @HttpCode(204)
  @RequirePermission('users.manage')
  async remove(@CurrentUser() actor: AdminProfile, @Param('id') userId: string, @Body(new ZodBodyPipe(confirmSchema)) body: { confirmPassword?: string }, @Req() request: FastifyRequest): Promise<void> {
    await this.users.remove(actor, userId, body.confirmPassword, meta(request));
  }
}
