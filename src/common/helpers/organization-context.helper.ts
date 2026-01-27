import { ExecutionContext } from '@nestjs/common';

export class OrganizationContextHelper {
  /**
   * Extract organization ID from request
   */
  static getOrganizationId(context: ExecutionContext): string | null {
    const request = context.switchToHttp().getRequest();
    return (
      request.params?.organizationId ||
      request.body?.organizationId ||
      request.query?.organizationId ||
      null
    );
  }

  /**
   * Extract user ID from request
   */
  static getUserId(context: ExecutionContext): string | null {
    const request = context.switchToHttp().getRequest();
    return request.user?.userId || null;
  }
}
