import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from '@auto-tags/shared-types';
import { AppException } from '../exceptions/app.exception';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { AppLogger } from '../logging/app-logger.service';
import { RequestContextService } from '../logging/request-context.service';

describe('AllExceptionsFilter', () => {
  let filter: AllExceptionsFilter;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;
  let mockResponse: { status: jest.Mock };
  let mockRequest: { method: string; url: string };
  let mockHost: ArgumentsHost;
  let requestContext: RequestContextService;

  beforeEach(() => {
    requestContext = new RequestContextService();
    filter = new AllExceptionsFilter(new AppLogger(requestContext), requestContext);
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockResponse = { status: mockStatus };
    mockRequest = { method: 'GET', url: '/test-endpoint' };

    mockHost = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
    } as unknown as ArgumentsHost;
  });

  it('handles AppException and returns structured error with path and timestamp', () => {
    const exception = new AppException(ErrorCode.NOT_FOUND, HttpStatus.NOT_FOUND);

    filter.catch(exception, mockHost);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    const body = (mockJson.mock.calls[0] as [Record<string, unknown>])[0];
    expect(body.success).toBe(false);
    expect(body.errorCode).toBe(ErrorCode.NOT_FOUND);
    expect(body.statusCode).toBe(HttpStatus.NOT_FOUND);
    expect(body.path).toBe('/test-endpoint');
    expect(typeof body.timestamp).toBe('string');
  });

  it('handles standard HttpException', () => {
    const exception = new HttpException('Forbidden resource', HttpStatus.FORBIDDEN);

    filter.catch(exception, mockHost);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
    const body = (mockJson.mock.calls[0] as [Record<string, unknown>])[0];
    expect(body.success).toBe(false);
    expect(body.errorCode).toBe(ErrorCode.FORBIDDEN);
    expect(body.statusCode).toBe(HttpStatus.FORBIDDEN);
    expect(body.path).toBe('/test-endpoint');
    expect(typeof body.timestamp).toBe('string');
  });

  it('handles unhandled/unknown exceptions as 500 INTERNAL_SERVER_ERROR', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const exception = new Error('Unexpected crash');

    filter.catch(exception, mockHost);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    const body = (mockJson.mock.calls[0] as [Record<string, unknown>])[0];
    expect(body.success).toBe(false);
    expect(body.errorCode).toBe(ErrorCode.INTERNAL_SERVER_ERROR);
    expect(body.message).toBe('Internal server error');
    expect(body.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(body.path).toBe('/test-endpoint');
    expect(typeof body.timestamp).toBe('string');
  });

  it('includes the active request ID in the error response', () => {
    requestContext.run({ requestId: 'request-123' }, () => {
      filter.catch(new HttpException('Not found', HttpStatus.NOT_FOUND), mockHost);
    });

    const body = (mockJson.mock.calls[0] as [Record<string, unknown>])[0];
    expect(body.requestId).toBe('request-123');
  });
});
