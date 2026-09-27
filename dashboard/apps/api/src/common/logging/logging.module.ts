import { Global, MiddlewareConsumer, Module, type NestModule } from '@nestjs/common';
import { AppLogger } from './app-logger.service';
import { RequestContextMiddleware } from './request-context.middleware';
import { RequestContextService } from './request-context.service';

@Global()
@Module({
  providers: [RequestContextService, AppLogger, RequestContextMiddleware],
  exports: [RequestContextService, AppLogger],
})
export class LoggingModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestContextMiddleware).forRoutes('{*path}');
  }
}
