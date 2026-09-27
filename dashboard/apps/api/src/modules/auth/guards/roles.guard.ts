import { CanActivate, ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ErrorCode, type UserRole } from '@auto-tags/shared-types';
import { ROLES_KEY } from '../../../common/decorators/roles.decorator';
import { AppException } from '../../../common/exceptions/app.exception';
import type { AuthenticatedRequest } from '../../../common/types/authenticated-request';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext) {
    const required = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required?.length) return true;
    const role = context.switchToHttp().getRequest<AuthenticatedRequest>().user.role;
    if (!required.includes(role)) throw new AppException(ErrorCode.FORBIDDEN, HttpStatus.FORBIDDEN);
    return true;
  }
}
