import { Controller, Get } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';

@Public()
@Controller('health')
export class HealthController {
  @Get()
  check() {
    return {
      service: 'auto-tags-api',
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
