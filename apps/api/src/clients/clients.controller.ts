import { Body, Controller, Get, HttpCode, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { z } from 'zod';
import type { AdminProfile } from '../admin-users/admin-users.service';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequireAnyPermission, RequirePermission } from '../auth/permissions.decorator';
import { ZodBodyPipe } from '../cms/zod-body.pipe';
import { metaOf } from '../portal/portal-utils';
import { ClientsService } from './clients.service';

const text = (max: number) => z.string().trim().max(max);
const optional = (max: number) => text(max).nullable().optional();
const url = z.string().trim().max(200).refine((v) => v === '' || /^https?:\/\//i.test(v), 'must start with http:// or https://').nullable().optional();
const email = z.string().trim().toLowerCase().email().max(160);

const userSchema = z.object({ name: text(80).min(1), email, phone: optional(30), role: z.enum(['OWNER', 'MEMBER']), password: z.string().max(128).optional() });
const orgFields = {
  companyName: text(120).min(1),
  industry: optional(80),
  website: url,
  logo: url,
  contactEmail: email,
  contactPhone: optional(30),
  internalNotes: optional(4000),
};
const createSchema = z.object({ ...orgFields, owner: userSchema.omit({ role: true }).extend({ role: z.enum(['OWNER', 'MEMBER']).default('OWNER') }).optional() });
const updateSchema = z.object(orgFields).partial().extend({ active: z.boolean().optional() });
const userUpdateSchema = z.object({ name: text(80).min(1).optional(), phone: optional(30), role: z.enum(['OWNER', 'MEMBER']).optional(), active: z.boolean().optional() });

@Controller('admin/clients')
@UseGuards(JwtAuthGuard)
export class ClientsController {
  constructor(private readonly clients: ClientsService) {}

  @Get()
  @RequirePermission('clients.view')
  list(@Query() query: { q?: string; active?: string; page?: string }) {
    return this.clients.list(query);
  }

  @Get('options')
  @RequireAnyPermission('clients.view', 'projects.view')
  options() {
    return this.clients.options();
  }

  @Get(':id')
  @RequirePermission('clients.view')
  get(@Param('id') id: string) {
    return this.clients.get(id);
  }

  @Post()
  @RequirePermission('clients.manage')
  create(@CurrentUser() admin: AdminProfile, @Body(new ZodBodyPipe(createSchema)) body: z.infer<typeof createSchema>, @Req() request: FastifyRequest) {
    return this.clients.create(admin, body, metaOf(request));
  }

  @Patch(':id')
  @RequirePermission('clients.manage')
  update(@CurrentUser() admin: AdminProfile, @Param('id') id: string, @Body(new ZodBodyPipe(updateSchema)) body: z.infer<typeof updateSchema>, @Req() request: FastifyRequest) {
    return this.clients.update(admin, id, body, metaOf(request));
  }

  @Post(':id/users')
  @RequirePermission('clients.manage')
  addUser(@CurrentUser() admin: AdminProfile, @Param('id') id: string, @Body(new ZodBodyPipe(userSchema)) body: z.infer<typeof userSchema>, @Req() request: FastifyRequest) {
    return this.clients.addUser(admin, id, body, metaOf(request));
  }

  @Patch(':id/users/:userId')
  @RequirePermission('clients.manage')
  updateUser(@CurrentUser() admin: AdminProfile, @Param('id') id: string, @Param('userId') userId: string, @Body(new ZodBodyPipe(userUpdateSchema)) body: z.infer<typeof userUpdateSchema>, @Req() request: FastifyRequest) {
    return this.clients.updateUser(admin, id, userId, body, metaOf(request));
  }

  @Post(':id/users/:userId/reset-password')
  @HttpCode(200)
  @RequirePermission('clients.manage')
  reset(@CurrentUser() admin: AdminProfile, @Param('id') id: string, @Param('userId') userId: string, @Req() request: FastifyRequest) {
    return this.clients.resetPassword(admin, id, userId, metaOf(request));
  }
}
