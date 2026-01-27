import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { PermissionService } from './permission.service';
import { AuthenticationModule } from '../../../authentication/auth.module';

@Module({
  imports: [AuthenticationModule],
  providers: [RoleService, PermissionService],
  exports: [RoleService, PermissionService],
})
export class RbacModule {}
