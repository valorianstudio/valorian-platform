import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { EstimatorController } from './estimator.controller';
import { EstimatorService } from './estimator.service';

@Module({ imports: [AuthModule], controllers: [EstimatorController], providers: [EstimatorService] })
export class EstimatorModule {}
