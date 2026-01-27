import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserWithRolesInterface } from '../interfaces/user-with-roles.interface';

@Injectable()
export class OrganizationRoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // No roles required, allow access
    }

    const request = context.switchToHttp().getRequest();
    const user: UserWithRolesInterface = request.user;
    const organizationId = request.params?.organizationId || request.body?.organizationId;

    if (!user || !user.roles) {
      throw new ForbiddenException('User roles not found');
    }

    if (!organizationId) {
      throw new ForbiddenException('Organization ID is required');
    }

    // TODO: Check user's role in the specific organization
    // This requires querying the employees or organization_role_permissions table
    // For now, basic role check
    const hasRequiredRole = requiredRoles.some((role) => user.roles.includes(role));

    if (!hasRequiredRole) {
      throw new ForbiddenException('You do not have the required role for this organization');
    }

    return true;
  }
}
