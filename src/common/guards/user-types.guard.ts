import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { USER_TYPES_KEY } from '../decorators/metadata/user-types.decorator';

@Injectable()
export class UserTypesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredTypes = this.reflector.getAllAndOverride<string[]>(USER_TYPES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredTypes) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return false;
    }

    return requiredTypes.some((type) => user.type === type);
  }
}
