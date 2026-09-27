import { ValidationPipe, type INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getConnectionToken } from '@nestjs/mongoose';
import { Test, type TestingModule } from '@nestjs/testing';
import type { AuthResponse, UserRole } from '@auto-tags/shared-types';
import cookieParser from 'cookie-parser';
import type { Connection, Types } from 'mongoose';
import type { Server } from 'node:http';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import type { JwtPayload } from '../../src/common/types/authenticated-request';
import { startMongoMemoryServer } from './mongo-memory';

export interface TestAppContext {
  app: INestApplication;
  module: TestingModule;
  connection: Connection;
}

export async function createIntegrationTestApp(customMongoUri?: string): Promise<TestAppContext> {
  const mongoUri = customMongoUri ?? (await startMongoMemoryServer());

  process.env.NODE_ENV = 'test';
  process.env.MONGODB_URI = mongoUri;
  process.env.JWT_ACCESS_SECRET =
    process.env.JWT_ACCESS_SECRET || 'test-jwt-access-secret-minimum-32-chars-long!';
  process.env.JWT_REFRESH_SECRET =
    process.env.JWT_REFRESH_SECRET || 'test-jwt-refresh-secret-minimum-32-chars-long!';
  process.env.TOKEN_ENCRYPTION_KEY =
    process.env.TOKEN_ENCRYPTION_KEY || Buffer.alloc(32).toString('base64');
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  })
    .compile();

  const app = moduleFixture.createNestApplication({ rawBody: true });
  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.init();

  const connection = moduleFixture.get<Connection>(getConnectionToken());

  return {
    app,
    module: moduleFixture,
    connection,
  };
}

export async function generateTestAccessToken(
  jwtService: JwtService,
  user: { id: string | Types.ObjectId; email: string; role: UserRole },
  secret = process.env.JWT_ACCESS_SECRET || 'test-jwt-access-secret-minimum-32-chars-long!',
): Promise<string> {
  const payload: JwtPayload = {
    sub: user.id.toString(),
    email: user.email,
    role: user.role,
  };
  return jwtService.signAsync(payload, {
    secret,
    expiresIn: 900,
  });
}

export async function loginViaApi(
  app: INestApplication,
  email: string,
  password = 'Password123!',
): Promise<{
  accessToken: string;
  refreshTokenCookie: string;
  authResponse: AuthResponse;
  rawCookies: string[];
}> {
  const server = app.getHttpServer() as Server;
  const res = await request(server).post('/api/auth/login').send({ email, password }).expect(200);

  const rawCookies = (res.headers['set-cookie'] as string[] | undefined) ?? [];
  const refreshCookieHeader =
    rawCookies.find((c: string) => c.startsWith('auto_tags_refresh_token=')) ?? '';

  const authResponse = res.body as AuthResponse;

  return {
    accessToken: authResponse.accessToken,
    refreshTokenCookie: refreshCookieHeader,
    authResponse,
    rawCookies,
  };
}

export function authenticatedRequest(app: INestApplication, token: string) {
  const server = app.getHttpServer() as Server;
  return {
    get: (url: string) => request(server).get(url).set('Authorization', `Bearer ${token}`),
    post: (url: string) => request(server).post(url).set('Authorization', `Bearer ${token}`),
    put: (url: string) => request(server).put(url).set('Authorization', `Bearer ${token}`),
    patch: (url: string) => request(server).patch(url).set('Authorization', `Bearer ${token}`),
    delete: (url: string) => request(server).delete(url).set('Authorization', `Bearer ${token}`),
  };
}
