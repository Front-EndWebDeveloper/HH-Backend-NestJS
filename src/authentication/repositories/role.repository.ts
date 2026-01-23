import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Role } from '../entities/role.entity';

@Injectable()
export class RoleRepository extends Repository<Role> {
  constructor(private dataSource: DataSource) {
    super(Role, dataSource.createEntityManager());
  }

  async findByName(name: string): Promise<Role | null> {
    return this.findOne({ where: { name } }) as Promise<Role | null>;
  }

  async findAllRoles(): Promise<Role[]> {
    return this.find({ order: { id: 'ASC' } });
  }
}

