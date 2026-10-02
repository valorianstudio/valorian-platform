import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put, Query, Res, UseGuards } from '@nestjs/common';
import type { FastifyReply } from 'fastify';
import type { AdminProfile } from '../admin-users/admin-users.service';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ZodBodyPipe } from '../cms/zod-body.pipe';
import { activitySchema, leadSettingsSchema, leadUpdateSchema, noteSchema, statusChangeSchema } from './lead-schemas';
import type { LeadUpdateInput, StatusChangeInput } from './lead-schemas';
import { LeadsService } from './leads.service';
import type { LeadListQuery } from './leads.service';
import { PrismaService } from '../prisma/prisma.service';

const author = (user: AdminProfile) => ({ id: user.id, name: user.name });

@Controller('admin/leads')
@UseGuards(JwtAuthGuard)
export class AdminLeadsController {
  constructor(
    private readonly leads: LeadsService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  list(@Query() query: LeadListQuery) {
    return this.leads.list(query);
  }

  @Get('stats')
  stats() {
    return this.leads.stats();
  }

  @Get('export')
  async export(@Query() query: LeadListQuery, @Res() reply: FastifyReply) {
    const csv = await this.leads.exportCsv(query);
    await reply
      .header('Content-Type', 'text/csv; charset=utf-8')
      .header('Content-Disposition', `attachment; filename="leads-${new Date().toISOString().slice(0, 10)}.csv"`)
      .send(`﻿${csv}`);
  }

  @Get('settings')
  settings() {
    return this.leads.getSettings();
  }

  @Put('settings')
  async updateSettings(@Body(new ZodBodyPipe(leadSettingsSchema)) body: ReturnType<typeof leadSettingsSchema.parse>) {
    await this.leads.getSettings();
    return this.prisma.leadSettings.update({ where: { id: 'leads' }, data: body });
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.leads.get(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body(new ZodBodyPipe(leadUpdateSchema)) body: LeadUpdateInput, @CurrentUser() user: AdminProfile) {
    return this.leads.update(id, body, author(user));
  }

  @Post(':id/status')
  @HttpCode(200)
  status(@Param('id') id: string, @Body(new ZodBodyPipe(statusChangeSchema)) body: StatusChangeInput, @CurrentUser() user: AdminProfile) {
    return this.leads.changeStatus(id, body, author(user));
  }

  @Post(':id/notes')
  addNote(@Param('id') id: string, @Body(new ZodBodyPipe(noteSchema)) body: { content: string }, @CurrentUser() user: AdminProfile) {
    return this.leads.addNote(id, body.content, author(user));
  }

  @Patch('notes/:noteId')
  editNote(@Param('noteId') noteId: string, @Body(new ZodBodyPipe(noteSchema)) body: { content: string }, @CurrentUser() user: AdminProfile) {
    return this.leads.editNote(noteId, body.content, author(user));
  }

  @Delete('notes/:noteId')
  @HttpCode(204)
  async deleteNote(@Param('noteId') noteId: string, @CurrentUser() user: AdminProfile) {
    await this.leads.deleteNote(noteId, author(user));
  }

  @Post(':id/activities')
  addActivity(@Param('id') id: string, @Body(new ZodBodyPipe(activitySchema)) body: Parameters<LeadsService['addActivity']>[1], @CurrentUser() user: AdminProfile) {
    return this.leads.addActivity(id, body, author(user));
  }

  @Post(':id/archive')
  @HttpCode(200)
  archive(@Param('id') id: string, @CurrentUser() user: AdminProfile) {
    return this.leads.setArchived(id, true, author(user));
  }

  @Post(':id/restore')
  @HttpCode(200)
  restore(@Param('id') id: string, @CurrentUser() user: AdminProfile) {
    return this.leads.setArchived(id, false, author(user));
  }
}
