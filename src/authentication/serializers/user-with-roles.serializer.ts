import { User } from '../entities/user.entity';

export class UserWithRolesSerializer {
  static serialize(user: User & { roles?: string[] }) {
    return {
      id: user.id,
      email: user.email,
      emailVerified: user.email_verified,
      isActive: user.is_active,
      isTwoFaEnabled: user.is_two_fa_enabled,
      roles: user.roles || [],
      lastLogin: user.last_login,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
  }

  static serializeMany(users: (User & { roles?: string[] })[]) {
    return users.map((user) => this.serialize(user));
  }
}
