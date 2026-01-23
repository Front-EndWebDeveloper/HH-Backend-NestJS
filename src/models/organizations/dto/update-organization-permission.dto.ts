import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';

export class UpdateOrganizationPermissionDto {
  @IsNotEmpty()
  @IsString()
  role: string;

  @IsNotEmpty()
  @IsString()
  feature: string;

  @IsNotEmpty()
  @IsBoolean()
  hasAccess: boolean;
}

