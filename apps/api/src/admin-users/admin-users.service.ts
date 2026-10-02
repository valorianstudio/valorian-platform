import { ConflictException, Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { AdminRole, Prisma } from '@prisma/client';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { ChangePasswordDto, UpdateProfileDto } from './dto/profile.dto';

export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  lastLoginAt: Date | null;
  createdAt: Date;
}

const profileSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  lastLoginAt: true,
  createdAt: true,
} satisfies Prisma.AdminUserSelect;

@Injectable()
export class AdminUsersService {
  constructor(private readonly prisma: PrismaService) {}

  findActiveProfile(id: string): Promise<AdminProfile | null> {
    return this.prisma.adminUser.findFirst({ where: { id, isActive: true }, select: profileSelect });
  }

  findByEmail(email: string) {
    return this.prisma.adminUser.findUnique({ where: { email } });
  }

  markLoggedIn(id: string) {
    return this.prisma.adminUser.update({ where: { id }, data: { lastLoginAt: new Date() }, select: profileSelect });
  }

  async updateProfile(id: string, dto: UpdateProfileDto): Promise<AdminProfile> {
    try {
      return await this.prisma.adminUser.update({
        where: { id },
        data: { name: dto.name, email: dto.email },
        select: profileSelect,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('That email address is already in use.');
      }
      throw error;
    }
  }

  async changePassword(id: string, dto: ChangePasswordDto): Promise<void> {
    const user = await this.prisma.adminUser.findUnique({ where: { id } });
    if (!user || !(await argon2.verify(user.passwordHash, dto.currentPassword))) {
      throw new UnauthorizedException('Current password is incorrect.');
    }
    if (dto.currentPassword === dto.newPassword) {
      throw new UnprocessableEntityException('New password must be different from the current one.');
    }
    await this.prisma.adminUser.update({
      where: { id },
      data: { passwordHash: await argon2.hash(dto.newPassword) },
    });
  }
}
