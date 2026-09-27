import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface ExchangeRateResponse {
  result?: string;
  rates?: Record<string, number>;
  time_last_update_utc?: string;
}

@Injectable()
export class ExchangeRateService {
  private cache?: { date: string; rate: number; updatedAt: string; source: string };

  constructor(private readonly config: ConfigService) {}

  async getUsdToVnd() {
    const today = new Date().toISOString().slice(0, 10);
    if (this.cache?.date === today) return this.cache;
    try {
      const response = await fetch('https://open.er-api.com/v6/latest/USD', {
        signal: AbortSignal.timeout(5000),
      });
      const data = (await response.json()) as ExchangeRateResponse;
      const rate = data.rates?.VND;
      if (!response.ok || data.result !== 'success' || !rate) throw new Error('Invalid rate');
      this.cache = {
        date: today,
        rate,
        updatedAt: data.time_last_update_utc ?? new Date().toISOString(),
        source: 'ExchangeRate-API',
      };
    } catch {
      this.cache = {
        date: today,
        rate: this.config.get<number>('USD_TO_VND_RATE', 26000),
        updatedAt: new Date().toISOString(),
        source: 'fallback',
      };
    }
    return this.cache;
  }
}
