import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { FastifyReply } from 'fastify';

interface ErrorBody {
  statusCode: number;
  message: string;
  errors?: string[];
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const reply = host.switchToHttp().getResponse<FastifyReply>();
    const body = this.toBody(exception);
    if (body.statusCode >= 500) {
      this.logger.error(exception instanceof Error ? (exception.stack ?? exception.message) : String(exception));
    }
    void reply.status(body.statusCode).send(body);
  }

  private toBody(exception: unknown): ErrorBody {
    if (!(exception instanceof HttpException)) {
      return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Something went wrong. Please try again.' };
    }
    const statusCode = exception.getStatus();
    const response = exception.getResponse();
    if (typeof response === 'string') return { statusCode, message: response };
    const { message, errors } = response as { message?: string | string[]; errors?: string[] };
    if (Array.isArray(message)) return { statusCode, message: 'Validation failed', errors: message };
    if (Array.isArray(errors)) return { statusCode, message: message ?? exception.message, errors };
    return { statusCode, message: message ?? exception.message };
  }
}
