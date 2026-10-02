import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { MediaController } from './media.controller';
import { LocalStorageService, StorageService } from './storage.service';

@Module({
  imports: [AuthModule],
  controllers: [MediaController],
  providers: [{ provide: StorageService, useClass: LocalStorageService }],
  exports: [StorageService],
})
export class StorageModule {}
