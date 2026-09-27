import { HealthController } from './health.controller';

describe('HealthController', () => {
  it('reports the service as healthy', () => {
    const result = new HealthController().check();

    expect(result.service).toBe('auto-tags-api');
    expect(result.status).toBe('ok');
    expect(result.timestamp).toBeTruthy();
  });
});
