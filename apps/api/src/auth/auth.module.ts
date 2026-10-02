import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AdminUsersModule } from '../admin-users/admin-users.module';
import { env } from '../config/env';
import { AdminProfileController } from './admin-profile.controller';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [AdminUsersModule, JwtModule.register({ secret: env.JWT_SECRET, signOptions: { expiresIn: 60 * 60 * 24 * 7 } })],
  controllers: [AuthController, AdminProfileController],
  providers: [AuthService, JwtAuthGuard],
  exports: [JwtModule, AdminUsersModule, JwtAuthGuard, AuthService],
})
export class AuthModule {}
