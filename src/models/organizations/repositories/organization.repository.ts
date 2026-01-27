import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Organization } from '../entities/organization.entity';

@Injectable()
export class OrganizationRepository extends Repository<Organization> {
  constructor(private dataSource: DataSource) {
    super(Organization, dataSource.createEntityManager());
  }

  async findByUserId(userId: string): Promise<Organization | null> {
    return this.findOne({
      where: { user_id: userId },
      relations: ['profile', 'typeAssignments', 'typeAssignments.organizationType'],
    });
  }

  async findByIdWithRelations(id: string): Promise<Organization | null> {
    return this.findOne({
      where: { id },
      relations: [
        'user',
        'profile',
        'typeAssignments',
        'typeAssignments.organizationType',
        'rolePermissions',
      ],
    });
  }
}
