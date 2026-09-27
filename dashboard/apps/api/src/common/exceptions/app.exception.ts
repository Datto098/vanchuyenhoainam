import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode, type ErrorCode as ErrorCodeType } from '@auto-tags/shared-types';

const defaultMessages: Record<ErrorCodeType, string> = {
  [ErrorCode.INTERNAL_SERVER_ERROR]: 'Internal server error',
  [ErrorCode.VALIDATION_ERROR]: 'Validation failed',
  [ErrorCode.NOT_FOUND]: 'Resource not found',
  [ErrorCode.UNAUTHORIZED]: 'Authentication required',
  [ErrorCode.FORBIDDEN]: 'Access denied',
  [ErrorCode.BAD_REQUEST]: 'Bad request',
  [ErrorCode.TOO_MANY_REQUESTS]: 'Too many requests',
  [ErrorCode.AUTH_INVALID_CREDENTIALS]: 'Invalid email or password',
  [ErrorCode.AUTH_INVALID_REFRESH_TOKEN]: 'Invalid or expired refresh token',
  [ErrorCode.AUTH_ACCOUNT_DISABLED]: 'Account is disabled',
  [ErrorCode.USER_NOT_FOUND]: 'User not found',
  [ErrorCode.USER_EMAIL_EXISTS]: 'Email is already in use',
};

export class AppException extends HttpException {
  constructor(
    public readonly errorCode: ErrorCodeType,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
    message = defaultMessages[errorCode],
    details?: Record<string, unknown>,
  ) {
    super({ success: false, errorCode, message, statusCode, details }, statusCode);
  }
}
