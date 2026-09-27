import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from '@auto-tags/shared-types';
import type { Request, Response } from 'express';
import { AppLogger } from '../logging/app-logger.service';
import { RequestContextService } from '../logging/request-context.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly logger: AppLogger,
    private readonly requestContext: RequestContextService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const request = context.getRequest<Request>();
    const response = context.getResponse<Response>();
    const resolved = this.resolve(exception);

    if (resolved.statusCode >= 500) {
      this.logger.error('Unhandled HTTP exception', {
        module: AllExceptionsFilter.name,
        method: request.method,
        path: request.url,
        exception,
      });
    }

    response.status(resolved.statusCode).json({
      ...resolved.body,
      timestamp: new Date().toISOString(),
      path: request.url,
      requestId: this.requestContext.get()?.requestId,
    });
  }

  private resolve(exception: unknown) {
    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const body = exception.getResponse();
      if (typeof body === 'object' && body !== null) {
        return {
          statusCode,
          body: {
            success: false,
            errorCode: this.codeForStatus(statusCode),
            statusCode,
            ...body,
          },
        };
      }
      return {
        statusCode,
        body: {
          success: false,
          errorCode: this.codeForStatus(statusCode),
          message: String(body),
          statusCode,
        },
      };
    }

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      body: {
        success: false,
        errorCode: ErrorCode.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      },
    };
  }

  private codeForStatus(status: number) {
    if (status === 400) return ErrorCode.VALIDATION_ERROR;
    if (status === 401) return ErrorCode.UNAUTHORIZED;
    if (status === 403) return ErrorCode.FORBIDDEN;
    if (status === 404) return ErrorCode.NOT_FOUND;
    if (status === 429) return ErrorCode.TOO_MANY_REQUESTS;
    return ErrorCode.BAD_REQUEST;
  }
}
