import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({
      where: { email },
      relations: ['userRoles', 'userRoles.role'],
    }) as Promise<User | null>;
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.createQueryBuilder('user')
      .addSelect('user.password')
      .addSelect('user.totp_secret')
      .where('user.email = :email', { email })
      .leftJoinAndSelect('user.userRoles', 'userRoles')
      .leftJoinAndSelect('userRoles.role', 'role')
      .getOne();
  }

  async findByIdWithRoles(id: string): Promise<User | null> {
    return this.findOne({
      where: { id },
      relations: ['userRoles', 'userRoles.role'],
    }) as Promise<User | null>;
  }

  async findByVerificationToken(
    token: string,
  ): Promise<User | null> {
    return this.findOne({
      where: { email_verification_token: token },
    }) as Promise<User | null>;
  }

  async findByPasswordResetToken(
    token: string,
  ): Promise<User | null> {
    return this.findOne({
      where: { password_reset_token: token },
    }) as Promise<User | null>;
  }
}

