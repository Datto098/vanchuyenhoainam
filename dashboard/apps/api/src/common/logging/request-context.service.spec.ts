import { RequestContextService } from './request-context.service';

describe('RequestContextService', () => {
  it('keeps and enriches context across asynchronous work', async () => {
    const service = new RequestContextService();

    await service.run({ requestId: 'request-1' }, async () => {
      await Promise.resolve();
      service.assign({ shopId: 'shop-1', orderId: 'order-1', jobId: 'job-1' });
      expect(service.get()).toEqual({
        requestId: 'request-1',
        shopId: 'shop-1',
        orderId: 'order-1',
        jobId: 'job-1',
      });
    });

    expect(service.get()).toBeUndefined();
  });

  it('creates a correlation ID for a background job', () => {
    const service = new RequestContextService();

    service.runJob({ jobId: 'job-1', shopId: 'shop-1' }, () => {
      expect(service.get()?.requestId).toEqual(expect.any(String));
      expect(service.get()?.jobId).toBe('job-1');
    });
  });
});
