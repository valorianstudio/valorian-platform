import 'reflect-metadata';
import { Logger, RequestMethod, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import fastifyCookie from '@fastify/cookie';
import fastifyHelmet from '@fastify/helmet';
import fastifyRateLimit from '@fastify/rate-limit';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/all-exceptions.filter';
import { env, isProduction } from './config/env';
import { MAX_PROJECT_FILE_BYTES } from './project-files/project-file-storage';
import { MAX_UPLOAD_BYTES } from './storage/storage.service';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ trustProxy: true, bodyLimit: 256 * 1024 }),
    { logger: isProduction ? ['log', 'warn', 'error'] : ['log', 'warn', 'error', 'debug'] },
  );

  app.setGlobalPrefix('api', {
    exclude: [{ path: '/', method: RequestMethod.GET }],
  });
  app.enableShutdownHooks();
  app.enableCors({ origin: env.WEB_ORIGIN, credentials: true, methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] });
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true, stopAtFirstError: false }),
  );

  const fastify = app.getHttpAdapter().getInstance();
  // The API only serves JSON, files and images, never documents, so the strictest policy is safe.
  await fastify.register(fastifyHelmet, {
    contentSecurityPolicy: { directives: { defaultSrc: ["'none'"], frameAncestors: ["'none'"], baseUri: ["'none'"], formAction: ["'none'"] } },
    hsts: isProduction ? { maxAge: 31_536_000, includeSubDomains: true } : false,
    referrerPolicy: { policy: 'no-referrer' },
  });
  fastify.addContentTypeParser(/^image\/(png|jpeg|webp|gif)$/, { parseAs: 'buffer', bodyLimit: MAX_UPLOAD_BYTES }, (_request, body, done) => done(null, body));
  fastify.addContentTypeParser('application/octet-stream', { parseAs: 'buffer', bodyLimit: MAX_PROJECT_FILE_BYTES }, (_request, body, done) => done(null, body));
  await fastify.register(fastifyCookie);
  await fastify.register(fastifyRateLimit, { global: false });

  const loginLimit = fastify.rateLimit({ max: 10, timeWindow: '15 minutes' });
  const estimateLimit = fastify.rateLimit({ max: 30, timeWindow: '1 minute' });
  const submitLimit = fastify.rateLimit({ max: 6, timeWindow: '10 minutes' });
  const collectLimit = fastify.rateLimit({ max: 90, timeWindow: '1 minute' });
  const sensitiveLimit = fastify.rateLimit({ max: 20, timeWindow: '15 minutes' });
  const uploadLimit = fastify.rateLimit({ max: 60, timeWindow: '10 minutes' });
  const generalLimit = fastify.rateLimit({ max: 300, timeWindow: '1 minute' });
  fastify.addHook('onRequest', async (request, reply) => {
    const isSubmission = request.method === 'POST' && /^\/api\/(leads|inquiries)(\?|$)/.test(request.url);
    const isSensitive = request.method !== 'GET' && /^\/api\/(admin\/profile\/password|client-auth\/(password|forgot-password)|auth\/2fa)/.test(request.url);
    const isUpload = request.method === 'POST' && /^\/api\/admin\/(media|projects\/[^/]+\/files)(\?|$)/.test(request.url);
    const limiter = isSensitive
      ? sensitiveLimit
      : isUpload
        ? uploadLimit
        : request.url.startsWith('/api/auth/login') || request.url.startsWith('/api/client-auth/login')
      ? loginLimit
      : isSubmission
        ? submitLimit
        : request.url.startsWith('/api/estimator/calculate')
          ? estimateLimit
          : request.url.startsWith('/api/analytics/collect')
            ? collectLimit
            : generalLimit;
    await limiter.call(fastify, request, reply);
  });

  fastify.addHook('onSend', async (request, reply) => {
    if (request.url.startsWith('/api/admin') || request.url.startsWith('/api/client')) void reply.header('Cache-Control', 'no-store');
  });

  await app.listen(env.PORT, '0.0.0.0');
  new Logger('Bootstrap').log(`API ${env.APP_VERSION} listening on port ${env.PORT} (${env.NODE_ENV})`);
}

void bootstrap();
