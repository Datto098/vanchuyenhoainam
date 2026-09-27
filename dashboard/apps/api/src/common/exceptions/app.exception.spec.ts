import { HttpStatus } from '@nestjs/common';
import { ErrorCode } from '@auto-tags/shared-types';
import { AppException } from './app.exception';

describe('AppException', () => {
  it('instantiates with default status BAD_REQUEST and default message for all error codes', () => {
    const errorCodes = Object.values(ErrorCode);

    expect(errorCodes.length).toBeGreaterThan(0);

    for (const code of errorCodes) {
      const exception = new AppException(code);
      expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);
      expect(exception.errorCode).toBe(code);

      const response = exception.getResponse() as Record<string, unknown>;
      expect(response.success).toBe(false);
      expect(response.errorCode).toBe(code);
      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(typeof response.message).toBe('string');
      expect((response.message as string).length).toBeGreaterThan(0);
    }
  });

  it('allows overriding status code, message, and details', () => {
    const customMessage = 'Custom not found error';
    const details = { resourceId: '12345' };

    const exception = new AppException(
      ErrorCode.NOT_FOUND,
      HttpStatus.NOT_FOUND,
      customMessage,
      details,
    );

    expect(exception.getStatus()).toBe(HttpStatus.NOT_FOUND);
    expect(exception.errorCode).toBe(ErrorCode.NOT_FOUND);

    const response = exception.getResponse() as Record<string, unknown>;
    expect(response.success).toBe(false);
    expect(response.errorCode).toBe(ErrorCode.NOT_FOUND);
    expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
    expect(response.message).toBe(customMessage);
    expect(response.details).toEqual(details);
  });
});
