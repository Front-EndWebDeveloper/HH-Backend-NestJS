import { Injectable, Logger } from '@nestjs/common';
import { RoleService } from './role.service';

@Injectable()
export class PermissionService {
  private readonly logger = new Logger(PermissionService.name);

  constructor(private roleService: RoleService) {}

  /**
   * Check if user has permission
   * This is a basic implementation - can be enhanced with a permissions table
   */
  async hasPermission(userRoles: string[], permission: string): Promise<boolean> {
    // Map permissions to roles (basic implementation)
    const permissionRoleMap: Record<string, string[]> = {
      'users.create': ['ADMIN'],
      'users.read': ['ADMIN', 'EMPLOYEE'],
      'users.update': ['ADMIN'],
      'users.delete': ['ADMIN'],
      'organizations.create': ['ADMIN'],
      'organizations.read': ['ADMIN', 'EMPLOYEE', 'ORGANIZATION'],
      'organizations.update': ['ADMIN', 'ORGANIZATION'],
      'organizations.delete': ['ADMIN'],
      'patients.create': ['ADMIN', 'EMPLOYEE'],
      'patients.read': ['ADMIN', 'EMPLOYEE', 'PROVIDER'],
      'patients.update': ['ADMIN', 'EMPLOYEE', 'PROVIDER'],
      'patients.delete': ['ADMIN'],
    };

    const allowedRoles = permissionRoleMap[permission] || [];

    if (allowedRoles.length === 0) {
      this.logger.warn(`Unknown permission: ${permission}`);
      return false;
    }

    return this.roleService.userHasAnyRole(userRoles, allowedRoles);
  }

  /**
   * Check if user has any of the specified permissions
   */
  async hasAnyPermission(userRoles: string[], permissions: string[]): Promise<boolean> {
    const checks = await Promise.all(
      permissions.map((permission) => this.hasPermission(userRoles, permission)),
    );
    return checks.some((result) => result === true);
  }

  /**
   * Check if user has all of the specified permissions
   */
  async hasAllPermissions(userRoles: string[], permissions: string[]): Promise<boolean> {
    const checks = await Promise.all(
      permissions.map((permission) => this.hasPermission(userRoles, permission)),
    );
    return checks.every((result) => result === true);
  }
}
