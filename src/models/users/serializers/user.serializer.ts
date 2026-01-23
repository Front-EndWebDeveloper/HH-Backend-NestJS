import { ModelSerializer } from '../../../common/serializers/model.serializer';
import { User } from '../entities/user.entity';

export class UserSerializer extends ModelSerializer {
  serialize(user: User): any {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      type: user.type,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

