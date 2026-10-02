import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AdminUsersModule } from '../admin-users/admin-users.module';
import { env } from '../config/env';
import { AdminProfileController } from './admin-profile.controller';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { SESSION_MAX_AGE_SECONDS } from './session.constants';

@Module({
  imports: [
    AdminUsersModule,
    JwtModule.register({ secret: env.JWT_SECRET, signOptions: { expiresIn: SESSION_MAX_AGE_SECONDS } }),
  ],
  controllers: [AuthController, AdminProfileController],
  providers: [AuthService, JwtAuthGuard],
  exports: [JwtModule, AdminUsersModule, JwtAuthGuard],
})
export class AuthModule {}
