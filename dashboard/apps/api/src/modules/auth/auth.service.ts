import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ErrorCode, type AuthResponse, type UserRole } from '@auto-tags/shared-types';
import argon2 from 'argon2';
import { createHash, randomUUID, timingSafeEqual } from 'node:crypto';
import { AppException } from '../../common/exceptions/app.exception';
import type { JwtPayload } from '../../common/types/authenticated-request';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.users.findByEmailWithSecrets(email);
    if (!user || !(await argon2.verify(user.passwordHash, password))) {
      throw new AppException(ErrorCode.AUTH_INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);
    }
    if (user.status !== 'active') {
      throw new AppException(ErrorCode.AUTH_ACCOUNT_DISABLED, HttpStatus.FORBIDDEN);
    }
    const session = await this.createSession(user.id, user.email, user.role as UserRole);
    await this.users.startSession(user.id, this.hash(session.refreshToken));
    return session;
  }

  async refresh(token: string) {
    let payload: JwtPayload;
    try {
      payload = await this.jwt.verifyAsync<JwtPayload>(token, {
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new AppException(ErrorCode.AUTH_INVALID_REFRESH_TOKEN, HttpStatus.UNAUTHORIZED);
    }

    const user = await this.users.findByIdWithSecrets(payload.sub);
    if (
      !user?.refreshTokenHash ||
      user.status !== 'active' ||
      !this.matchesHash(token, user.refreshTokenHash)
    ) {
      throw new AppException(ErrorCode.AUTH_INVALID_REFRESH_TOKEN, HttpStatus.UNAUTHORIZED);
    }
    const session = await this.createSession(user.id, user.email, user.role as UserRole);
    const rotated = await this.users.rotateRefreshToken(
      user.id,
      user.refreshTokenHash,
      this.hash(session.refreshToken),
    );
    if (!rotated) {
      throw new AppException(ErrorCode.AUTH_INVALID_REFRESH_TOKEN, HttpStatus.UNAUTHORIZED);
    }
    return session;
  }

  async logout(userId: string) {
    await this.users.setRefreshTokenHash(userId, null);
  }

  async me(userId: string) {
    return this.users.toAuthUser(await this.users.getById(userId));
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.users.findByIdWithSecrets(userId);
    if (!user || !(await argon2.verify(user.passwordHash, currentPassword))) {
      throw new AppException(ErrorCode.AUTH_INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);
    }
    if (await argon2.verify(user.passwordHash, newPassword)) {
      throw new AppException(
        ErrorCode.VALIDATION_ERROR,
        HttpStatus.BAD_REQUEST,
        'New password must be different from current password',
      );
    }
    await this.users.changePassword(userId, await argon2.hash(newPassword));
  }

  private async createSession(
    userId: string,
    email: string,
    role: UserRole,
  ): Promise<{ response: AuthResponse; refreshToken: string }> {
    const payload: JwtPayload = { sub: userId, email, role };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(
        { ...payload, jti: randomUUID() },
        {
          secret: this.config.getOrThrow<string>('JWT_ACCESS_SECRET'),
          expiresIn: this.config.get<number>('JWT_ACCESS_TTL_SECONDS', 900),
        },
      ),
      this.jwt.signAsync(
        { ...payload, jti: randomUUID() },
        {
          secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.config.get<number>('JWT_REFRESH_TTL_SECONDS', 604800),
        },
      ),
    ]);
    return { response: { accessToken, user: await this.me(userId) }, refreshToken };
  }

  private hash(value: string) {
    return createHash('sha256').update(value).digest('hex');
  }
  private matchesHash(value: string, expected: string) {
    const actualBuffer = Buffer.from(this.hash(value));
    const expectedBuffer = Buffer.from(expected);
    return (
      actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer)
    );
  }
}
