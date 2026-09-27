import { Injectable, type LoggerService } from '@nestjs/common';
import { RequestContextService } from './request-context.service';
import { redactLogValue } from './redact';

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

@Injectable()
export class AppLogger implements LoggerService {
  constructor(private readonly requestContext: RequestContextService) {}

  log(message: unknown, ...optionalParams: unknown[]): void {
    this.write('info', message, optionalParams);
  }

  error(message: unknown, ...optionalParams: unknown[]): void {
    this.write('error', message, optionalParams);
  }

  warn(message: unknown, ...optionalParams: unknown[]): void {
    this.write('warn', message, optionalParams);
  }

  debug(message: unknown, ...optionalParams: unknown[]): void {
    this.write('debug', message, optionalParams);
  }

  verbose(message: unknown, ...optionalParams: unknown[]): void {
    this.write('debug', message, optionalParams);
  }

  fatal(message: unknown, ...optionalParams: unknown[]): void {
    this.write('fatal', message, optionalParams);
  }

  private write(level: LogLevel, message: unknown, optionalParams: unknown[]): void {
    if (process.env.NODE_ENV === 'production' && level === 'debug') return;

    const [metadata, ...details] = optionalParams;
    const structuredMetadata =
      metadata && typeof metadata === 'object' && !Array.isArray(metadata) ? metadata : undefined;
    const entry = redactLogValue({
      timestamp: new Date().toISOString(),
      level,
      ...this.requestContext.get(),
      message,
      ...structuredMetadata,
      ...(details.length ? { details } : {}),
      ...(!structuredMetadata && optionalParams.length ? { details: optionalParams } : {}),
    });
    const output = JSON.stringify(entry, null, process.env.LOG_PRETTY === 'true' ? 2 : undefined);

    if (level === 'error' || level === 'fatal') console.error(output);
    else if (level === 'warn') console.warn(output);
    else console.log(output);
  }
}
