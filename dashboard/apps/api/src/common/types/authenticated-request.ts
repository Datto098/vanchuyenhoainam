import type { Request } from 'express';
import type { UserRole } from '@auto-tags/shared-types';

export type JwtPayload = { sub: string; email: string; role: UserRole; jti?: string };
export type AuthenticatedRequest = Request & { user: JwtPayload };
