import { Body, Controller, Get, Param, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { ClientPrincipal } from '../client-auth/client-auth.service';
import { ClientGuard, ClientOwnerOnly, CurrentClient } from '../client-auth/client.guard';
import { ClientRequestsService } from '../client-requests/client-requests.service';
import { ZodBodyPipe } from '../cms/zod-body.pipe';
import { metaOf } from '../portal/portal-utils';
import { ProjectFilesService } from '../project-files/project-files.service';
import { MessagesService } from '../project-messages/messages.service';
import { ClientPortalService } from './client-portal.service';

const messageSchema = z.object({ message: z.string().trim().min(1).max(4000) });
const requestSchema = z.object({
  title: z.string().trim().min(1).max(140),
  description: z.string().trim().min(1).max(4000),
  type: z.enum(['QUESTION', 'CHANGE_REQUEST', 'BUG_REPORT', 'MAINTENANCE']),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).default('NORMAL'),
});
const memberSchema = z.object({ name: z.string().trim().min(1).max(80), email: z.string().trim().toLowerCase().email().max(160), phone: z.string().trim().max(30).nullable().optional() });
const activeSchema = z.object({ active: z.boolean() });

/** Everything a signed-in client can do. Each handler receives the client from the guard and scopes queries by organization. */
@Controller('client')
@UseGuards(ClientGuard)
export class ClientPortalController {
  constructor(
    private readonly portal: ClientPortalService,
    private readonly messages: MessagesService,
    private readonly requests: ClientRequestsService,
    private readonly files: ProjectFilesService,
  ) {}

  @Get('dashboard')
  dashboard(@CurrentClient() client: ClientPrincipal) {
    return this.portal.dashboard(client);
  }

  @Get('projects')
  projects(@CurrentClient() client: ClientPrincipal) {
    return this.portal.projects(client);
  }

  @Get('projects/:id')
  project(@CurrentClient() client: ClientPrincipal, @Param('id') id: string) {
    return this.portal.project(client, id);
  }

  @Get('projects/:id/messages')
  thread(@CurrentClient() client: ClientPrincipal, @Param('id') id: string) {
    return this.messages.clientThread(client, id);
  }

  @Post('projects/:id/messages')
  send(@CurrentClient() client: ClientPrincipal, @Param('id') id: string, @Body(new ZodBodyPipe(messageSchema)) body: z.infer<typeof messageSchema>) {
    return this.messages.clientSend(client, id, body.message);
  }

  @Post('projects/:id/requests')
  @ClientOwnerOnly()
  request(@CurrentClient() client: ClientPrincipal, @Param('id') id: string, @Body(new ZodBodyPipe(requestSchema)) body: z.infer<typeof requestSchema>) {
    return this.requests.create(client, id, body);
  }

  @Get('files/:id/download')
  async download(@CurrentClient() client: ClientPrincipal, @Param('id') id: string, @Res() reply: FastifyReply): Promise<void> {
    await this.files.clientDownload(client, id, reply);
  }

  @Get('team')
  @ClientOwnerOnly()
  team(@CurrentClient() client: ClientPrincipal) {
    return this.portal.team(client);
  }

  @Post('team')
  @ClientOwnerOnly()
  addMember(@CurrentClient() client: ClientPrincipal, @Body(new ZodBodyPipe(memberSchema)) body: z.infer<typeof memberSchema>, @Req() request: FastifyRequest) {
    return this.portal.addMember(client, body, metaOf(request));
  }

  @Patch('team/:userId')
  @ClientOwnerOnly()
  setActive(@CurrentClient() client: ClientPrincipal, @Param('userId') userId: string, @Body(new ZodBodyPipe(activeSchema)) body: z.infer<typeof activeSchema>, @Req() request: FastifyRequest) {
    return this.portal.setMemberActive(client, userId, body.active, metaOf(request));
  }
}
