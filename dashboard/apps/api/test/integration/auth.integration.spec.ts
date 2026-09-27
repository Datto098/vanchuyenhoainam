import { getModelToken } from '@nestjs/mongoose';
import {
  ErrorCode,
  UserRole,
  type ApiErrorResponse,
  type AuthResponse,
  type AuthUser,
} from '@auto-tags/shared-types';
import type { Model } from 'mongoose';
import type { Server } from 'node:http';
import request from 'supertest';
import { User, type UserDocument } from '../../src/modules/users/schemas/user.schema';
import { createUser } from '../factories/user.factory';
import { clearMongoCollections, stopMongoMemoryServer } from '../utils/mongo-memory';
import {
  authenticatedRequest,
  createIntegrationTestApp,
  loginViaApi,
  type TestAppContext,
} from '../utils/test-client';

describe('Auth Integration Tests', () => {
  let context: TestAppContext;
  let userModel: Model<UserDocument>;
  let server: Server;

  beforeAll(async () => {
    context = await createIntegrationTestApp();
    userModel = context.module.get<Model<UserDocument>>(getModelToken(User.name));
    server = context.app.getHttpServer() as Server;
  }, 60000);

  afterAll(async () => {
    await context.app.close();
    await stopMongoMemoryServer();
  });

  beforeEach(async () => {
    await clearMongoCollections(context.connection);
  });

  describe('POST /api/auth/login', () => {
    it('should log in successfully with valid credentials and return access token and refresh cookie', async () => {
      const password = 'Password123!';
      const user = await createUser(userModel, {
        email: 'active-admin@test.com',
        password,
        role: UserRole.ADMIN,
      });

      const { accessToken, refreshTokenCookie, authResponse } = await loginViaApi(
        context.app,
        user.email,
        password,
      );

      expect(accessToken).toBeDefined();
      expect(typeof accessToken).toBe('string');
      expect(refreshTokenCookie).toContain('auto_tags_refresh_token=');
      expect(authResponse.user.email).toBe(user.email);
      expect(authResponse.user.role).toBe(UserRole.ADMIN);

      // Verify refresh token hash was saved to the user
      const updatedUser = await userModel.findById(user._id).select('+refreshTokenHash').exec();
      expect(updatedUser?.refreshTokenHash).toBeDefined();
      expect(updatedUser?.lastLoginAt).toBeInstanceOf(Date);
    });

    it('should reject login with wrong password', async () => {
      const user = await createUser(userModel, {
        email: 'user-wrong-pass@test.com',
        password: 'CorrectPassword123!',
      });

      const res = await request(server)
        .post('/api/auth/login')
        .send({ email: user.email, password: 'WrongPassword' })
        .expect(401);

      const body = res.body as ApiErrorResponse;
      expect(body.errorCode).toBe(ErrorCode.AUTH_INVALID_CREDENTIALS);
    });

    it('should reject login for non-existent user', async () => {
      const res = await request(server)
        .post('/api/auth/login')
        .send({ email: 'non-existent@test.com', password: 'Password123!' })
        .expect(401);

      const body = res.body as ApiErrorResponse;
      expect(body.errorCode).toBe(ErrorCode.AUTH_INVALID_CREDENTIALS);
    });

    it('should reject login for disabled user account', async () => {
      const password = 'Password123!';
      const user = await createUser(userModel, {
        email: 'disabled-user@test.com',
        password,
        status: 'disabled',
      });

      const res = await request(server)
        .post('/api/auth/login')
        .send({ email: user.email, password })
        .expect(403);

      const body = res.body as ApiErrorResponse;
      expect(body.errorCode).toBe(ErrorCode.AUTH_ACCOUNT_DISABLED);
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('should rotate refresh token and issue a new access token', async () => {
      const password = 'Password123!';
      const user = await createUser(userModel, {
        email: 'refresh-test@test.com',
        password,
      });

      const { refreshTokenCookie } = await loginViaApi(context.app, user.email, password);

      const cookieValue = refreshTokenCookie.split(';')[0] ?? '';

      const refreshRes = await request(server)
        .post('/api/auth/refresh')
        .set('Cookie', [cookieValue])
        .expect(200);

      const body = refreshRes.body as AuthResponse;
      expect(body.accessToken).toBeDefined();
      expect(body.user.email).toBe(user.email);

      const newCookies = (refreshRes.headers['set-cookie'] as string[] | undefined) ?? [];
      const newRefreshCookie = newCookies.find((c: string) =>
        c.startsWith('auto_tags_refresh_token='),
      );
      expect(newRefreshCookie).toBeDefined();

      const reused = await request(server)
        .post('/api/auth/refresh')
        .set('Cookie', [cookieValue])
        .expect(401);
      expect((reused.body as ApiErrorResponse).errorCode).toBe(
        ErrorCode.AUTH_INVALID_REFRESH_TOKEN,
      );
    });

    it('should reject refresh when no refresh cookie is provided', async () => {
      const res = await request(server).post('/api/auth/refresh').expect(401);

      const body = res.body as ApiErrorResponse;
      expect(body.errorCode).toBe(ErrorCode.AUTH_INVALID_REFRESH_TOKEN);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return profile for authenticated user', async () => {
      const password = 'Password123!';
      const user = await createUser(userModel, {
        email: 'me-test@test.com',
        password,
        role: UserRole.OPERATOR,
      });

      const { accessToken } = await loginViaApi(context.app, user.email, password);

      const res = await authenticatedRequest(context.app, accessToken)
        .get('/api/auth/me')
        .expect(200);

      const body = res.body as AuthUser;
      expect(body.email).toBe(user.email);
      expect(body.role).toBe(UserRole.OPERATOR);
    });

    it('should reject unauthenticated request with 401', async () => {
      const res = await request(server).get('/api/auth/me').expect(401);

      const body = res.body as ApiErrorResponse;
      expect(body.errorCode).toBe(ErrorCode.UNAUTHORIZED);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should clear refresh token on server and expire cookie', async () => {
      const password = 'Password123!';
      const user = await createUser(userModel, {
        email: 'logout-test@test.com',
        password,
      });

      const { accessToken } = await loginViaApi(context.app, user.email, password);

      const logoutRes = await authenticatedRequest(context.app, accessToken)
        .post('/api/auth/logout')
        .expect(204);

      const cookies = (logoutRes.headers['set-cookie'] as string[] | undefined) ?? [];
      const clearedCookie = cookies.find((c: string) => c.startsWith('auto_tags_refresh_token=;'));
      expect(clearedCookie).toBeDefined();

      const updatedUser = await userModel.findById(user._id).select('+refreshTokenHash').exec();
      expect(updatedUser?.refreshTokenHash).toBeNull();
    });
  });
});
