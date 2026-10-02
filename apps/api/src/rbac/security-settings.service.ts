import { Injectable } from '@nestjs/common';
import { SecuritySettings } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SecuritySettingsService {
  private cache: { value: SecuritySettings; expires: number } | null = null;

  constructor(private readonly prisma: PrismaService) {}

  async get(): Promise<SecuritySettings> {
    if (this.cache && this.cache.expires > Date.now()) return this.cache.value;
    const value = await this.prisma.securitySettings.upsert({ where: { id: 'security' }, update: {}, create: { id: 'security' } });
    this.cache = { value, expires: Date.now() + 30_000 };
    return value;
  }

  invalidate(): void {
    this.cache = null;
  }
}
