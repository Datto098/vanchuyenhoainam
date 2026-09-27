import { Injectable, type NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'node:crypto';
import { RequestContextService } from './request-context.service';

export const REQUEST_ID_HEADER = 'x-request-id';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  constructor(private readonly context: RequestContextService) {}

  use(request: Request, response: Response, next: NextFunction): void {
    const incomingId = request.header(REQUEST_ID_HEADER)?.trim();
    const requestId = incomingId && incomingId.length <= 128 ? incomingId : randomUUID();

    response.setHeader(REQUEST_ID_HEADER, requestId);
    this.context.run({ requestId }, next);
  }
}
