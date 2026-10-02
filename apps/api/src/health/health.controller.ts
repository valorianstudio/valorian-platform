import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async check(): Promise<{ status: 'ok' | 'degraded'; database: boolean; uptime: number }> {
    const database = await this.prisma.$queryRaw`SELECT 1`.then(
      () => true,
      () => false,
    );
    return { status: database ? 'ok' : 'degraded', database, uptime: Math.round(process.uptime()) };
  }
}
