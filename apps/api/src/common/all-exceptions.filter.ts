import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { maskIp } from '../audit/audit.service';
import { isProduction } from '../config/env';
import { reportError } from './error-reporter';

interface ErrorBody {
  success: false;
  statusCode: number;
  message: string;
  errors?: string[];
  code?: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);
  private readonly security = new Logger('Security');

  catch(exception: unknown, host: ArgumentsHost): void {
    const http = host.switchToHttp();
    const reply = http.getResponse<FastifyReply>();
    const request = http.getRequest<FastifyRequest>();
    const body = this.toBody(exception);
    // Only method and path are logged: never query strings, bodies, headers or cookies.
    const path = (request.url ?? '').split('?')[0];
    if (body.statusCode >= 500) {
      const detail = exception instanceof Error ? (isProduction ? `${exception.name}: ${exception.message.slice(0, 200)}` : (exception.stack ?? exception.message)) : 'Non-error exception';
      this.logger.error(`${request.method} ${path} -> ${body.statusCode} ${detail}`);
      reportError(exception, { method: request.method, path });
    } else if (body.statusCode === 401 || body.statusCode === 403 || body.statusCode === 429) {
      this.security.warn(`${request.method} ${path} -> ${body.statusCode} ip=${maskIp(request.ip) ?? 'unknown'}`);
    }
    void reply.status(body.statusCode).send(body);
  }

  private toBody(exception: unknown): ErrorBody {
    if (!(exception instanceof HttpException)) {
      // Framework-level client errors (rate limit, malformed body) carry their own status code.
      const code = (exception as { statusCode?: unknown } | null)?.statusCode;
      if (typeof code === 'number' && code >= 400 && code < 500) {
        return { success: false, statusCode: code, message: code === 429 ? 'Too many requests. Please wait a moment and try again.' : 'The request could not be processed.' };
      }
      return { success: false, statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Something went wrong. Please try again.' };
    }
    const statusCode = exception.getStatus();
    const response = exception.getResponse();
    if (typeof response === 'string') return { success: false, statusCode, message: response };
    const { message, errors, code } = response as { message?: string | string[]; errors?: string[]; code?: string };
    if (code) return { success: false, statusCode, message: typeof message === 'string' ? message : exception.message, code };
    if (Array.isArray(message)) return { success: false, statusCode, message: 'Validation failed', errors: message };
    if (Array.isArray(errors)) return { success: false, statusCode, message: message ?? exception.message, errors };
    return { success: false, statusCode, message: message ?? exception.message };
  }
}
