import { Controller, Get, Res } from '@nestjs/common';
import type { FastifyReply } from 'fastify';
import { env } from '../config/env';
import { PrismaService } from '../prisma/prisma.service';

interface HealthBody {
  status: 'ok' | 'degraded';
  database: boolean;
  environment: string;
  version: string;
  uptime: number;
}

/** Safe for uptime monitors and load balancers: no configuration, hostnames or error details. */
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async check(@Res({ passthrough: true }) reply: FastifyReply): Promise<HealthBody> {
    const database = await Promise.race([this.prisma.$queryRaw`SELECT 1`.then(() => true), new Promise<boolean>((resolve) => setTimeout(() => resolve(false), 3000))]).catch(() => false);
    if (!database) void reply.status(503);
    void reply.header('Cache-Control', 'no-store');
    return { status: database ? 'ok' : 'degraded', database, environment: env.NODE_ENV, version: env.APP_VERSION, uptime: Math.round(process.uptime()) };
  }
}
