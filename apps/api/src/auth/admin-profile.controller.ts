import { Body, Controller, HttpCode, Patch, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from './current-user.decorator';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AdminProfile, AdminUsersService } from '../admin-users/admin-users.service';
import { ChangePasswordDto, UpdateProfileDto } from '../admin-users/dto/profile.dto';

@Controller('admin/profile')
@UseGuards(JwtAuthGuard)
export class AdminProfileController {
  constructor(private readonly users: AdminUsersService) {}

  @Patch()
  update(@CurrentUser() user: AdminProfile, @Body() dto: UpdateProfileDto): Promise<AdminProfile> {
    return this.users.updateProfile(user.id, dto);
  }

  @Post('password')
  @HttpCode(204)
  async changePassword(@CurrentUser() user: AdminProfile, @Body() dto: ChangePasswordDto): Promise<void> {
    await this.users.changePassword(user.id, dto);
  }
}

