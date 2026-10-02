import 'reflect-metadata';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import fastifyCookie from '@fastify/cookie';
import fastifyHelmet from '@fastify/helmet';
import fastifyRateLimit from '@fastify/rate-limit';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/all-exceptions.filter';
import { env, isProduction } from './config/env';
import { MAX_UPLOAD_BYTES } from './storage/storage.service';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ trustProxy: true, bodyLimit: 256 * 1024 }),
  );

  app.setGlobalPrefix('api');
  app.enableShutdownHooks();
  app.enableCors({ origin: env.WEB_ORIGIN, credentials: true, methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] });
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true, stopAtFirstError: false }),
  );

  const fastify = app.getHttpAdapter().getInstance();
  await fastify.register(fastifyHelmet, { contentSecurityPolicy: false, hsts: isProduction });
  fastify.addContentTypeParser(/^image\/(png|jpeg|webp|gif)$/, { parseAs: 'buffer', bodyLimit: MAX_UPLOAD_BYTES }, (_request, body, done) => done(null, body));
  await fastify.register(fastifyCookie);
  await fastify.register(fastifyRateLimit, { global: false });

  const loginLimit = fastify.rateLimit({ max: 10, timeWindow: '15 minutes' });
  const estimateLimit = fastify.rateLimit({ max: 30, timeWindow: '1 minute' });
  const generalLimit = fastify.rateLimit({ max: 300, timeWindow: '1 minute' });
  fastify.addHook('onRequest', async (request, reply) => {
    const limiter = request.url.startsWith('/api/auth/login') ? loginLimit : request.url.startsWith('/api/estimator/calculate') ? estimateLimit : generalLimit;
    await limiter.call(fastify, request, reply);
  });

  await app.listen(env.PORT, '0.0.0.0');
  new Logger('Bootstrap').log(`API listening on port ${env.PORT}`);
}

void bootstrap();
