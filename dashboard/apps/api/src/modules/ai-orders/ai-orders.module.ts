import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SecurityModule } from '../../common/security/security.module';
import { AiOrdersController, ExtensionAiOrdersController } from './ai-orders.controller';
import { AiOrdersService } from './ai-orders.service';
import { AiOrderSettings, AiOrderSettingsSchema } from './schemas/ai-order-settings.schema';
import { AiOrderTask, AiOrderTaskSchema } from './schemas/ai-order-task.schema';
import { AiOrderUsage, AiOrderUsageSchema } from './schemas/ai-order-usage.schema';
import { ExchangeRateService } from './exchange-rate.service';
import { AiOrderRateLimit, AiOrderRateLimitSchema } from './schemas/ai-order-rate-limit.schema';

@Module({
  imports: [
    SecurityModule,
    MongooseModule.forFeature([
      { name: AiOrderTask.name, schema: AiOrderTaskSchema },
      { name: AiOrderUsage.name, schema: AiOrderUsageSchema },
      { name: AiOrderSettings.name, schema: AiOrderSettingsSchema },
      { name: AiOrderRateLimit.name, schema: AiOrderRateLimitSchema },
    ]),
  ],
  controllers: [ExtensionAiOrdersController, AiOrdersController],
  providers: [AiOrdersService, ExchangeRateService],
})
export class AiOrdersModule {}
