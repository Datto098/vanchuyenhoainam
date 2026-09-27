import { redactLogValue } from './redact';

describe('redactLogValue', () => {
  it('redacts secrets and PII recursively without changing safe metadata', () => {
    expect(
      redactLogValue({
        shopId: 'shop-1',
        authorization: 'Bearer secret',
        nested: { aiKey: 'key', email: 'customer@example.com', orderId: 'order-1' },
      }),
    ).toEqual({
      shopId: 'shop-1',
      authorization: '[REDACTED]',
      nested: { aiKey: '[REDACTED]', email: '[REDACTED]', orderId: 'order-1' },
    });
  });
});
