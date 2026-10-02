import { BadRequestException, Injectable, NotFoundException, PayloadTooLargeException } from '@nestjs/common';
import { ProjectFileCategory } from '@prisma/client';
import type { FastifyReply } from 'fastify';
import type { AdminProfile } from '../admin-users/admin-users.service';
import { AuditRequestMeta, AuditService } from '../audit/audit.service';
import type { ClientPrincipal } from '../client-auth/client-auth.service';
import { actorOf } from '../portal/portal-utils';
import { PrismaService } from '../prisma/prisma.service';
import { FILE_KINDS, MAX_PROJECT_FILE_BYTES, ProjectFileStorage, extensionOf, safeFileName } from './project-file-storage';

export interface UploadOptions {
  name: string;
  category: ProjectFileCategory;
  visibleToClient: boolean;
}

@Injectable()
export class ProjectFilesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: ProjectFileStorage,
    private readonly audit: AuditService,
  ) {}

  async upload(admin: AdminProfile, projectId: string, body: unknown, options: UploadOptions, meta: AuditRequestMeta) {
    const project = await this.prisma.project.findUnique({ where: { id: projectId }, select: { projectCode: true } });
    if (!project) throw new NotFoundException('Project not found.');
    if (!Buffer.isBuffer(body) || body.length === 0) throw new BadRequestException('Choose a file to upload.');
    if (body.length > MAX_PROJECT_FILE_BYTES) throw new PayloadTooLargeException('Files must be 15 MB or smaller.');

    const name = safeFileName(options.name);
    const kind = FILE_KINDS[extensionOf(name)];
    if (!kind) throw new BadRequestException('This file type is not allowed. Use PDF, images, Office documents, text, CSV or ZIP.');
    if (!kind.check(body)) throw new BadRequestException('The file content does not match its type.');

    const key = this.storage.newKey();
    await this.storage.put(key, body);
    try {
      const file = await this.prisma.projectFile.create({
        data: { projectId, name, storageKey: key, fileType: kind.mime, size: body.length, category: options.category, uploadedById: admin.id, uploadedByName: admin.name, visibleToClient: options.visibleToClient },
        select: { id: true, name: true, fileType: true, size: true, category: true, uploadedByName: true, visibleToClient: true, createdAt: true },
      });
      await this.audit.log({ actor: actorOf(admin), action: 'CREATE', module: 'projects', entityType: 'ProjectFile', entityId: file.id, entityLabel: file.name, summary: `Uploaded file "${file.name}" to ${project.projectCode}${options.visibleToClient ? ' (shared with client)' : ' (internal)'}`, meta });
      return file;
    } catch (error) {
      await this.storage.remove(key);
      throw error;
    }
  }

  async update(admin: AdminProfile, projectId: string, id: string, input: { visibleToClient?: boolean; category?: ProjectFileCategory }, meta: AuditRequestMeta) {
    const file = await this.prisma.projectFile.findFirst({ where: { id, projectId } });
    if (!file) throw new NotFoundException('File not found.');
    await this.prisma.projectFile.update({ where: { id }, data: input });
    await this.audit.log({
      actor: actorOf(admin),
      action: input.visibleToClient !== undefined && input.visibleToClient !== file.visibleToClient ? (input.visibleToClient ? 'PUBLISH' : 'UNPUBLISH') : 'UPDATE',
      module: 'projects',
      entityType: 'ProjectFile',
      entityId: id,
      entityLabel: file.name,
      summary: `Updated file "${file.name}"`,
      changes: { ...(input.visibleToClient !== undefined ? { visibleToClient: { before: file.visibleToClient, after: input.visibleToClient } } : {}), ...(input.category ? { category: { before: file.category, after: input.category } } : {}) },
      meta,
    });
    return { ok: true };
  }

  async remove(admin: AdminProfile, projectId: string, id: string, meta: AuditRequestMeta) {
    const file = await this.prisma.projectFile.findFirst({ where: { id, projectId } });
    if (!file) throw new NotFoundException('File not found.');
    await this.prisma.projectFile.delete({ where: { id } });
    await this.storage.remove(file.storageKey);
    await this.audit.log({ actor: actorOf(admin), action: 'DELETE', module: 'projects', entityType: 'ProjectFile', entityId: id, entityLabel: file.name, summary: `Deleted file "${file.name}"`, meta });
  }

  private async send(file: { name: string; storageKey: string; fileType: string }, reply: FastifyReply): Promise<void> {
    const object = await this.storage.get(file.storageKey);
    if (!object) throw new NotFoundException('File not found.');
    await reply
      .type(file.fileType)
      .header('Content-Length', object.size)
      .header('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(file.name)}`)
      .header('X-Content-Type-Options', 'nosniff')
      .header('Cache-Control', 'private, no-store')
      .send(object.stream);
  }

  async adminDownload(projectId: string, id: string, reply: FastifyReply): Promise<void> {
    const file = await this.prisma.projectFile.findFirst({ where: { id, projectId } });
    if (!file) throw new NotFoundException('File not found.');
    await this.send(file, reply);
  }

  /** Ownership is part of the query: another organization's file is indistinguishable from a missing one. */
  async clientDownload(client: ClientPrincipal, id: string, reply: FastifyReply): Promise<void> {
    const file = await this.prisma.projectFile.findFirst({ where: { id, visibleToClient: true, project: { organizationId: client.organizationId, archivedAt: null } } });
    if (!file) throw new NotFoundException('File not found.');
    await this.send(file, reply);
  }
}
