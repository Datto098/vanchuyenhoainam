import { UserRole } from '@auto-tags/shared-types';
import argon2 from 'argon2';
import type { Model } from 'mongoose';
import type { UserDocument } from '../../src/modules/users/schemas/user.schema';

let userCounter = 0;

export interface CreateUserInput {
  email?: string;
  password?: string;
  fullName?: string;
  role?: UserRole;
  status?: string;
  refreshTokenHash?: string | null;
}

export async function buildUserAttributes(input: CreateUserInput = {}): Promise<{
  email: string;
  passwordHash: string;
  fullName: string;
  role: string;
  status: string;
  refreshTokenHash: string | null;
}> {
  userCounter += 1;
  const password = input.password ?? 'Password123!';
  const passwordHash = await argon2.hash(password);

  return {
    email: input.email ?? `testuser${userCounter}@example.com`,
    passwordHash,
    fullName: input.fullName ?? `Test User ${userCounter}`,
    role: input.role ?? UserRole.OPERATOR,
    status: input.status ?? 'active',
    refreshTokenHash: input.refreshTokenHash ?? null,
  };
}

export async function createUser(
  userModel: Model<UserDocument>,
  input: CreateUserInput = {},
): Promise<UserDocument> {
  const attributes = await buildUserAttributes(input);
  return userModel.create(attributes);
}
