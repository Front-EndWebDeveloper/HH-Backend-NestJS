import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../models/users/entities/user.entity';
import { UserFactory } from '../../factories/users/factory';

@Injectable()
export class UserSeederService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async seed(): Promise<void> {
    const count = await this.usersRepository.count();
    if (count > 0) {
      console.log('Users already seeded');
      return;
    }

    const userData = await UserFactory.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      type: 'admin',
    });

    await this.usersRepository.save(userData);
    console.log('Users seeded successfully');
  }
}
