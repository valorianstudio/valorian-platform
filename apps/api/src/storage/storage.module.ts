import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CloudinaryService } from './cloudinary.service';
import { MediaController } from './media.controller';
import { LocalStorageService, StorageService } from './storage.service';

@Module({
  imports: [AuthModule],
  controllers: [MediaController],
  providers: [{ provide: StorageService, useClass: LocalStorageService }, CloudinaryService],
  exports: [StorageService, CloudinaryService],
})
export class StorageModule {}
