import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { EmployeeProfile } from './entities/employee-profile.entity';
import { AuthenticationModule } from '../../authentication/auth.module';
import { OrganizationsModule } from '../organizations/organizations.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee, EmployeeProfile]),
    AuthenticationModule,
    OrganizationsModule,
  ],
  exports: [TypeOrmModule],
})
export class EmployeesModule {}

