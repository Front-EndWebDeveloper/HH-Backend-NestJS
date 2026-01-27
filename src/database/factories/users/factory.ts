import { User } from '../../../models/users/entities/user.entity';
import * as bcrypt from 'bcrypt';

export class UserFactory {
  static async create(overrides: Partial<User> = {}): Promise<Partial<User>> {
    const defaultPassword = await bcrypt.hash('Password123!', 10);

    return {
      firstName: 'John',
      lastName: 'Doe',
      email: `john.doe.${Date.now()}@example.com`,
      password: defaultPassword,
      type: 'user',
      isActive: true,
      ...overrides,
    };
  }
}
