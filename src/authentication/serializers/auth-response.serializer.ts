import { AuthResponseInterface } from '../interfaces/auth-response.interface';

export class AuthResponseSerializer {
  static serialize(data: AuthResponseInterface) {
    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      user: {
        id: data.user.id,
        email: data.user.email,
        emailVerified: data.user.emailVerified,
        isTwoFaEnabled: data.user.isTwoFaEnabled,
        roles: data.user.roles,
      },
      requiresTwoFactor: data.requiresTwoFactor || false,
    };
  }
}
