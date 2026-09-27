import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import type { CorsOptionsDelegate } from '@nestjs/common/interfaces/external/cors-options.interface';
import type { NestExpressApplication } from '@nestjs/platform-express';
import type { Request } from 'express';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { AppLogger } from './common/logging/app-logger.service';

const commerceDomains = ['taobao.com', 'tmall.com', '1688.com'];

function isAllowedCommerceOrigin(origin: string) {
  try {
    const url = new URL(origin);
    return (
      url.protocol === 'https:' &&
      commerceDomains.some(
        (domain) => url.hostname === domain || url.hostname.endsWith(`.${domain}`),
      )
    );
  } catch {
    return false;
  }
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
    bodyParser: false,
    bufferLogs: true,
  });
  const config = app.get(ConfigService);
  const port = Number(process.env.API_PORT ?? 3001);
  const bodyLimit = config.get<string>('API_BODY_LIMIT', '2mb');

  app.set('trust proxy', config.get<number>('TRUST_PROXY_HOPS', 1));
  app.setGlobalPrefix('api');
  app.useBodyParser('json', { limit: bodyLimit });
  app.useBodyParser('urlencoded', { limit: bodyLimit, extended: true });
  app.use(cookieParser());
  app.useLogger(app.get(AppLogger));
  const corsOptions: CorsOptionsDelegate<Request> = (_request, callback) => {
    const webOrigin = config.get<string>('WEB_ORIGIN', 'http://localhost:3000');
    callback(null, {
      origin(origin, done) {
        if (
          !origin ||
          origin === webOrigin ||
          origin.startsWith('chrome-extension://') ||
          isAllowedCommerceOrigin(origin)
        ) {
          done(null, true);
          return;
        }
        done(new Error('CORS origin is not allowed'));
      },
      credentials: true,
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Extension-Token'],
    });
  };
  app.enableCors(corsOptions);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen(port);
}

void bootstrap();
