import { Entity, PrimaryColumn, Column, CreateDateColumn, Index, OneToMany } from 'typeorm';
import { UserRole } from './user-role.entity';

@Entity('roles')
@Index(['name'], { unique: true })
export class Role {
  @PrimaryColumn({ type: 'smallint' })
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  name: string; // ADMIN | EMPLOYEE | PATIENT | ORGANIZATION | BLOGGER

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  // Relations
  @OneToMany(() => UserRole, (userRole) => userRole.role)
  userRoles: UserRole[];
}
