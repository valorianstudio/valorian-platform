import { Global, Module, OnApplicationBootstrap } from '@nestjs/common';
import { EmailService } from './email.service';
import { NotificationsService } from './notifications.service';

@Global()
@Module({ providers: [EmailService, NotificationsService], exports: [EmailService, NotificationsService] })
export class MailModule implements OnApplicationBootstrap {
  constructor(private readonly email: EmailService) {}

  onApplicationBootstrap(): void {
    void this.email.logStartupStatus();
  }
}
