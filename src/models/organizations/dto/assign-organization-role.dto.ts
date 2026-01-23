import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class AssignOrganizationRoleDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsString()
  role: string; // ADMIN | PROVIDER | STAFF | HR | etc.
}

