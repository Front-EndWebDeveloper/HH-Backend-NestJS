import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserWithRolesInterface } from '../interfaces/user-with-roles.interface';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
  ): UserWithRolesInterface {
    // Transform user object to include roles
    if (user) {
      return {
        userId: user.userId,
        email: user.email,
        roles: user.roles || [],
      };
    }
    return super.handleRequest(err, user, info, context);
  }
}

