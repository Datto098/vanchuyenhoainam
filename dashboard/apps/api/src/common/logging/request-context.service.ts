import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'node:async_hooks';
import { randomUUID } from 'node:crypto';

export interface RequestContext {
  requestId: string;
  shopId?: string;
  orderId?: string;
  jobId?: string;
}

@Injectable()
export class RequestContextService {
  private readonly storage = new AsyncLocalStorage<RequestContext>();

  run<T>(context: RequestContext, callback: () => T): T {
    return this.storage.run(context, callback);
  }

  runJob<T>(
    context: Omit<RequestContext, 'requestId'> & { requestId?: string },
    callback: () => T,
  ): T {
    return this.run({ requestId: context.requestId ?? randomUUID(), ...context }, callback);
  }

  get(): RequestContext | undefined {
    return this.storage.getStore();
  }

  assign(context: Partial<Omit<RequestContext, 'requestId'>>): void {
    const current = this.storage.getStore();
    if (current) Object.assign(current, context);
  }
}
