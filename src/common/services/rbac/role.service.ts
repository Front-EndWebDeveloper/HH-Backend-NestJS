import { Injectable, Logger } from '@nestjs/common';
import { RoleRepository } from '../../../authentication/repositories/role.repository';
import { Role } from '../../../authentication/entities/role.entity';

@Injectable()
export class RoleService {
  private readonly logger = new Logger(RoleService.name);

  constructor(private roleRepository: RoleRepository) {}

  /**
   * Get all roles
   */
  async findAll(): Promise<Role[]> {
    return this.roleRepository.findAllRoles();
  }

  /**
   * Find role by name
   */
  async findByName(name: string): Promise<Role | null> {
    return this.roleRepository.findByName(name);
  }

  /**
   * Check if user has role
   */
  async userHasRole(userRoles: string[], roleName: string): Promise<boolean> {
    return userRoles.includes(roleName);
  }

  /**
   * Check if user has any of the specified roles
   */
  async userHasAnyRole(
    userRoles: string[],
    roleNames: string[],
  ): Promise<boolean> {
    return roleNames.some((roleName) => userRoles.includes(roleName));
  }

  /**
   * Check if user has all of the specified roles
   */
  async userHasAllRoles(
    userRoles: string[],
    roleNames: string[],
  ): Promise<boolean> {
    return roleNames.every((roleName) => userRoles.includes(roleName));
  }
}

