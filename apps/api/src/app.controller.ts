import { Controller, Get } from '@nestjs/common';
import { env } from './config/env';

@Controller()
export class AppController {
  @Get()
  root() {
    return {
      status: 'ok',
      service: 'Valorian Studio API',
      version: env.APP_VERSION,
      health: '/api/health',
    };
  }
}
