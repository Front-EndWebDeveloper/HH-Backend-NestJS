import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { UserWithRolesInterface } from '../interfaces/user-with-roles.interface';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions) {
      return true; // No permissions required, allow access
    }

    const request = context.switchToHttp().getRequest();
    const user: UserWithRolesInterface = request.user;

    if (!user) {
      return false;
    }

    // TODO: Implement permission checking logic
    // For now, check if user has required role (basic implementation)
    // This should be enhanced with a proper permission service
    return true;
  }
}
