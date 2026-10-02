import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AdminDemosController } from './admin-demos.controller';
import { PublicDemosController } from './public-demos.controller';

@Module({ imports: [AuthModule], controllers: [AdminDemosController, PublicDemosController] })
export class DemosModule {}
