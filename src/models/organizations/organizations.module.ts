import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { OrganizationType } from './entities/organization-type.entity';
import { OrganizationTypeAssignment } from './entities/organization-type-assignment.entity';
import { OrganizationProfile } from './entities/organization-profile.entity';
import { OrganizationRolePermission } from './entities/organization-role-permission.entity';
import { AuthenticationModule } from '../../authentication/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Organization,
      OrganizationType,
      OrganizationTypeAssignment,
      OrganizationProfile,
      OrganizationRolePermission,
    ]),
    AuthenticationModule,
  ],
  exports: [TypeOrmModule],
})
export class OrganizationsModule {}
