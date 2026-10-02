import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ClientAuthController } from '../client-auth/client-auth.controller';
import { ClientAuthService } from '../client-auth/client-auth.service';
import { ClientGuard } from '../client-auth/client.guard';
import { ClientRequestsService } from '../client-requests/client-requests.service';
import { ClientsController } from '../clients/clients.controller';
import { ClientsService } from '../clients/clients.service';
import { LocalProjectFileStorage, ProjectFileStorage } from '../project-files/project-file-storage';
import { ProjectFilesService } from '../project-files/project-files.service';
import { MessagesService } from '../project-messages/messages.service';
import { ClientPortalController } from '../projects/client-portal.controller';
import { ClientPortalService } from '../projects/client-portal.service';
import { ProjectsController } from '../projects/projects.controller';
import { ProjectsService } from '../projects/projects.service';

/** Client portal: client sign-in, client-facing APIs, and the admin side that manages clients and projects. */
@Module({
  imports: [AuthModule],
  controllers: [ClientAuthController, ClientPortalController, ClientsController, ProjectsController],
  providers: [ClientAuthService, ClientGuard, ClientsService, ProjectsService, ProjectFilesService, { provide: ProjectFileStorage, useClass: LocalProjectFileStorage }, MessagesService, ClientRequestsService, ClientPortalService],
})
export class PortalModule {}
