import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { EstimatorCurrency, ProjectFileCategory } from '@prisma/client';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import type { AdminProfile } from '../admin-users/admin-users.service';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RequirePermission } from '../auth/permissions.decorator';
import { ZodBodyPipe } from '../cms/zod-body.pipe';
import { ProjectFilesService } from '../project-files/project-files.service';
import { MessagesService } from '../project-messages/messages.service';
import { metaOf } from '../portal/portal-utils';
import { ClientRequestsService } from '../client-requests/client-requests.service';
import { ProjectsService } from './projects.service';

const date = z.preprocess((v) => (v === '' || v === null || v === undefined ? null : new Date(String(v))), z.date().nullable());
const text = (max: number) => z.string().trim().max(max);
const currency = z.nativeEnum(EstimatorCurrency).nullable();
const status = z.enum(['DISCOVERY', 'DESIGN', 'DEVELOPMENT', 'TESTING', 'REVIEW', 'DEPLOYMENT', 'COMPLETED', 'ON_HOLD', 'CANCELLED']);
const technologies = z.array(text(40).min(1)).max(30);

const base = {
  name: text(120).min(1),
  description: text(4000).nullable().optional(),
  status,
  startDate: date,
  estimatedEndDate: date,
  actualEndDate: date,
  progressPercentage: z.number().int().min(0).max(100),
  technologies,
  finalValue: z.number().int().min(0).max(2_000_000_000).nullable(),
  finalCurrency: currency,
  internalNotes: text(4000).nullable().optional(),
};
const createSchema = z.object({ ...base, organizationId: z.string().min(1).max(40), leadId: z.string().min(1).max(40).nullable().optional() }).partial({ status: true, startDate: true, estimatedEndDate: true, actualEndDate: true, progressPercentage: true, technologies: true, finalValue: true, finalCurrency: true });
const updateSchema = z.object(base).partial();
const milestoneBase = { title: text(120).min(1), description: text(1000).nullable().optional(), status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'DELAYED']), dueDate: date, order: z.number().int().min(0).max(10000) };
const milestoneCreate = z.object(milestoneBase).partial({ status: true, dueDate: true, order: true, description: true });
const milestoneUpdate = z.object(milestoneBase).partial();
const updateCreate = z.object({ title: text(140).min(1), content: text(8000).min(1), visibleToClient: z.boolean() });
const updateEdit = updateCreate.partial();
const messageSchema = z.object({ message: text(4000).min(1), visibleToClient: z.boolean().default(true) });
const fileUpdate = z.object({ visibleToClient: z.boolean().optional(), category: z.nativeEnum(ProjectFileCategory).optional() });
const requestUpdate = z.object({ status: z.enum(['OPEN', 'REVIEWING', 'RESOLVED', 'CLOSED']) });

@Controller('admin/projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(
    private readonly projects: ProjectsService,
    private readonly files: ProjectFilesService,
    private readonly messages: MessagesService,
    private readonly requests: ClientRequestsService,
  ) {}

  @Get()
  @RequirePermission('projects.view')
  list(@Query() query: { q?: string; status?: string; client?: string; archived?: string; page?: string }) {
    return this.projects.list(query);
  }

  @Get('lead-options')
  @RequirePermission('projects.view')
  leadOptions() {
    return this.projects.leadOptions();
  }

  @Get('by-lead/:leadId')
  @RequirePermission('projects.view')
  byLead(@Param('leadId') leadId: string) {
    return this.projects.byLead(leadId);
  }

  @Get(':id')
  @RequirePermission('projects.view')
  get(@Param('id') id: string) {
    return this.projects.get(id);
  }

  @Post()
  @RequirePermission('projects.manage')
  create(@CurrentUser() admin: AdminProfile, @Body(new ZodBodyPipe(createSchema)) body: z.infer<typeof createSchema>, @Req() request: FastifyRequest) {
    return this.projects.create(admin, body, metaOf(request));
  }

  @Patch(':id')
  @RequirePermission('projects.manage')
  update(@CurrentUser() admin: AdminProfile, @Param('id') id: string, @Body(new ZodBodyPipe(updateSchema)) body: z.infer<typeof updateSchema>, @Req() request: FastifyRequest) {
    return this.projects.update(admin, id, body, metaOf(request));
  }

  @Post(':id/archive')
  @HttpCode(200)
  @RequirePermission('projects.manage')
  archive(@CurrentUser() admin: AdminProfile, @Param('id') id: string, @Req() request: FastifyRequest) {
    return this.projects.setArchived(admin, id, true, metaOf(request));
  }

  @Post(':id/restore')
  @HttpCode(200)
  @RequirePermission('projects.manage')
  restore(@CurrentUser() admin: AdminProfile, @Param('id') id: string, @Req() request: FastifyRequest) {
    return this.projects.setArchived(admin, id, false, metaOf(request));
  }

  /* milestones */

  @Post(':id/milestones')
  @RequirePermission('projects.manage')
  addMilestone(@CurrentUser() admin: AdminProfile, @Param('id') id: string, @Body(new ZodBodyPipe(milestoneCreate)) body: z.infer<typeof milestoneCreate>, @Req() request: FastifyRequest) {
    return this.projects.addMilestone(admin, id, body, metaOf(request));
  }

  @Patch(':id/milestones/:milestoneId')
  @RequirePermission('projects.manage')
  updateMilestone(@CurrentUser() admin: AdminProfile, @Param('id') id: string, @Param('milestoneId') milestoneId: string, @Body(new ZodBodyPipe(milestoneUpdate)) body: z.infer<typeof milestoneUpdate>, @Req() request: FastifyRequest) {
    return this.projects.updateMilestone(admin, id, milestoneId, body, metaOf(request));
  }

  @Delete(':id/milestones/:milestoneId')
  @HttpCode(204)
  @RequirePermission('projects.manage')
  async deleteMilestone(@CurrentUser() admin: AdminProfile, @Param('id') id: string, @Param('milestoneId') milestoneId: string, @Req() request: FastifyRequest): Promise<void> {
    await this.projects.deleteMilestone(admin, id, milestoneId, metaOf(request));
  }

  /* updates */

  @Post(':id/updates')
  @RequirePermission('projects.manage')
  addUpdate(@CurrentUser() admin: AdminProfile, @Param('id') id: string, @Body(new ZodBodyPipe(updateCreate)) body: z.infer<typeof updateCreate>, @Req() request: FastifyRequest) {
    return this.projects.addUpdate(admin, id, body, metaOf(request));
  }

  @Patch(':id/updates/:updateId')
  @RequirePermission('projects.manage')
  editUpdate(@CurrentUser() admin: AdminProfile, @Param('id') id: string, @Param('updateId') updateId: string, @Body(new ZodBodyPipe(updateEdit)) body: z.infer<typeof updateEdit>, @Req() request: FastifyRequest) {
    return this.projects.editUpdate(admin, id, updateId, body, metaOf(request));
  }

  @Delete(':id/updates/:updateId')
  @HttpCode(204)
  @RequirePermission('projects.manage')
  async deleteUpdate(@CurrentUser() admin: AdminProfile, @Param('id') id: string, @Param('updateId') updateId: string, @Req() request: FastifyRequest): Promise<void> {
    await this.projects.deleteUpdate(admin, id, updateId, metaOf(request));
  }

  /* files */

  @Post(':id/files')
  @RequirePermission('projects.manage')
  upload(@CurrentUser() admin: AdminProfile, @Param('id') id: string, @Body() body: unknown, @Query() query: { name?: string; category?: string; visible?: string }, @Req() request: FastifyRequest) {
    const category = query.category && Object.hasOwn(ProjectFileCategory, query.category) ? (query.category as ProjectFileCategory) : 'OTHER';
    return this.files.upload(admin, id, body, { name: query.name ?? 'file', category, visibleToClient: query.visible !== 'false' }, metaOf(request));
  }

  @Patch(':id/files/:fileId')
  @RequirePermission('projects.manage')
  updateFile(@CurrentUser() admin: AdminProfile, @Param('id') id: string, @Param('fileId') fileId: string, @Body(new ZodBodyPipe(fileUpdate)) body: z.infer<typeof fileUpdate>, @Req() request: FastifyRequest) {
    return this.files.update(admin, id, fileId, body, metaOf(request));
  }

  @Delete(':id/files/:fileId')
  @HttpCode(204)
  @RequirePermission('projects.manage')
  async deleteFile(@CurrentUser() admin: AdminProfile, @Param('id') id: string, @Param('fileId') fileId: string, @Req() request: FastifyRequest): Promise<void> {
    await this.files.remove(admin, id, fileId, metaOf(request));
  }

  @Get(':id/files/:fileId/download')
  @RequirePermission('projects.view')
  async download(@Param('id') id: string, @Param('fileId') fileId: string, @Res() reply: FastifyReply): Promise<void> {
    await this.files.adminDownload(id, fileId, reply);
  }

  /* messages and requests */

  @Post(':id/messages')
  @RequirePermission('projects.manage')
  reply(@CurrentUser() admin: AdminProfile, @Param('id') id: string, @Body(new ZodBodyPipe(messageSchema)) body: z.infer<typeof messageSchema>) {
    return this.messages.teamReply(admin, id, body.message, body.visibleToClient);
  }

  @Patch(':id/requests/:requestId')
  @RequirePermission('projects.manage')
  updateRequest(@CurrentUser() admin: AdminProfile, @Param('id') id: string, @Param('requestId') requestId: string, @Body(new ZodBodyPipe(requestUpdate)) body: z.infer<typeof requestUpdate>, @Req() request: FastifyRequest) {
    return this.requests.setStatus(admin, id, requestId, body.status, metaOf(request));
  }
}
