import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrganizationRolePermission } from '../entities/organization-role-permission.entity';

@Injectable()
export class OrganizationPermissionService {
  private readonly logger = new Logger(OrganizationPermissionService.name);

  constructor(
    @InjectRepository(OrganizationRolePermission)
    private permissionRepository: Repository<OrganizationRolePermission>,
  ) {}

  /**
   * Update organization role permission
   */
  async updatePermission(
    organizationId: string,
    role: string,
    feature: string,
    hasAccess: boolean,
  ): Promise<OrganizationRolePermission> {
    let permission = await this.permissionRepository.findOne({
      where: {
        organization_id: organizationId,
        role,
        feature,
      },
    });

    if (permission) {
      permission.has_access = hasAccess;
    } else {
      permission = this.permissionRepository.create({
        organization_id: organizationId,
        role,
        feature,
        has_access: hasAccess,
      });
    }

    return this.permissionRepository.save(permission);
  }

  /**
   * Get all permissions for an organization
   */
  async getOrganizationPermissions(organizationId: string): Promise<OrganizationRolePermission[]> {
    return this.permissionRepository.find({
      where: { organization_id: organizationId },
      order: { role: 'ASC', feature: 'ASC' },
    });
  }

  /**
   * Get permissions for a specific role in an organization
   */
  async getRolePermissions(
    organizationId: string,
    role: string,
  ): Promise<OrganizationRolePermission[]> {
    return this.permissionRepository.find({
      where: {
        organization_id: organizationId,
        role,
      },
    });
  }
}
