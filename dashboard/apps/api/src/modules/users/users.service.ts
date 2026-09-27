import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ErrorCode, UserRole, type AuthUser } from '@auto-tags/shared-types';
import argon2 from 'argon2';
import { Model } from 'mongoose';
import { AppException } from '../../common/exceptions/app.exception';
import { User, type UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly users: Model<UserDocument>) {}

  findByEmailWithSecrets(email: string) {
    return this.users
      .findOne({ email: email.toLowerCase() })
      .select('+passwordHash +refreshTokenHash')
      .exec();
  }

  findByIdWithSecrets(id: string) {
    return this.users.findById(id).select('+passwordHash +refreshTokenHash').exec();
  }

  async getById(id: string): Promise<UserDocument> {
    const user = await this.users.findById(id).exec();
    if (!user) throw new AppException(ErrorCode.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    return user;
  }

  async create(input: { email: string; password: string; fullName: string; role?: UserRole }) {
    const existing = await this.users.exists({ email: input.email.toLowerCase() });
    if (existing) throw new AppException(ErrorCode.USER_EMAIL_EXISTS, HttpStatus.CONFLICT);
    return this.users.create({
      email: input.email.toLowerCase(),
      passwordHash: await argon2.hash(input.password),
      fullName: input.fullName,
      role: input.role ?? UserRole.OPERATOR,
    });
  }

  setRefreshTokenHash(id: string, hash: string | null) {
    return this.users.updateOne({ _id: id }, { $set: { refreshTokenHash: hash } }).exec();
  }

  startSession(id: string, refreshTokenHash: string) {
    return this.users
      .updateOne(
        { _id: id, status: 'active' },
        { $set: { refreshTokenHash, lastLoginAt: new Date() } },
      )
      .exec();
  }

  async rotateRefreshToken(id: string, expectedHash: string, nextHash: string): Promise<boolean> {
    const result = await this.users
      .updateOne(
        { _id: id, status: 'active', refreshTokenHash: expectedHash },
        { $set: { refreshTokenHash: nextHash } },
      )
      .exec();
    return result.modifiedCount === 1;
  }

  async changePassword(id: string, passwordHash: string): Promise<void> {
    const result = await this.users
      .updateOne({ _id: id, status: 'active' }, { $set: { passwordHash, refreshTokenHash: null } })
      .exec();
    if (!result.matchedCount)
      throw new AppException(ErrorCode.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
  }

  toAuthUser(user: UserDocument): AuthUser {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role as UserRole,
    };
  }
}
