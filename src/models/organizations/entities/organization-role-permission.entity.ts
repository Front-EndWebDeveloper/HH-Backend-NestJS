import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  Unique,
} from 'typeorm';
import { Organization } from './organization.entity';

@Entity('organization_role_permissions')
@Unique(['organization_id', 'role', 'feature'])
@Index(['organization_id'])
@Index(['role'])
@Index(['feature'])
export class OrganizationRolePermission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  organization_id: string;

  @Column({ type: 'varchar', length: 50 })
  role: string; // HR | ASSISTANT_HR

  @Column({ type: 'varchar', length: 100 })
  feature: string;

  @Column({ type: 'boolean', default: false })
  has_access: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  // Relations
  @ManyToOne(() => Organization, (org) => org.rolePermissions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;
}
