import { Injectable, NotFoundException } from '@nestjs/common';
import type { AdminProfile } from '../admin-users/admin-users.service';
import type { ClientPrincipal } from '../client-auth/client-auth.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async teamReply(admin: AdminProfile, projectId: string, message: string, visibleToClient: boolean) {
    if (!(await this.prisma.project.findUnique({ where: { id: projectId }, select: { id: true } }))) throw new NotFoundException('Project not found.');
    return this.prisma.projectMessage.create({ data: { projectId, senderType: 'TEAM', senderId: admin.id, senderName: admin.name, message, visibleToClient } });
  }

  /** The project is looked up through the client's organization, so another company's project is simply "not found". */
  async clientSend(client: ClientPrincipal, projectId: string, message: string) {
    const project = await this.prisma.project.findFirst({ where: { id: projectId, organizationId: client.organizationId, archivedAt: null }, select: { id: true } });
    if (!project) throw new NotFoundException('Project not found.');
    return this.prisma.projectMessage.create({
      data: { projectId, senderType: 'CLIENT', senderId: client.id, senderName: client.name, message, visibleToClient: true },
      select: { id: true, senderType: true, senderName: true, message: true, createdAt: true },
    });
  }

  /** Only messages marked visible to the client; opening the thread marks the team's messages as read. */
  async clientThread(client: ClientPrincipal, projectId: string) {
    const project = await this.prisma.project.findFirst({ where: { id: projectId, organizationId: client.organizationId, archivedAt: null }, select: { id: true } });
    if (!project) throw new NotFoundException('Project not found.');
    const messages = await this.prisma.projectMessage.findMany({ where: { projectId, visibleToClient: true }, orderBy: { createdAt: 'asc' }, take: 300, select: { id: true, senderType: true, senderName: true, message: true, createdAt: true, readAt: true } });
    await this.prisma.projectMessage.updateMany({ where: { projectId, visibleToClient: true, senderType: 'TEAM', readAt: null }, data: { readAt: new Date() } });
    return messages;
  }
}
