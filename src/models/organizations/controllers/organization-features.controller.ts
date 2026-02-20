import { Controller, Get, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { SuccessHelper } from '../../../common/helpers/responses/success.helper';
import { OrganizationRoleService } from '../services/organization-role.service';

@Controller('v1/api/organization/features')
@UseGuards(JwtAuthGuard)
export class OrganizationFeaturesController {
  constructor(private readonly organizationRoleService: OrganizationRoleService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    const result = await this.organizationRoleService.getOrganizationFeatures();
    return SuccessHelper.createSuccessResponse(result);
  }
}
