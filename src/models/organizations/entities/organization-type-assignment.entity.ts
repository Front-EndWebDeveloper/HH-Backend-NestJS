import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
  Unique,
} from 'typeorm';
import { Organization } from './organization.entity';
import { OrganizationType } from './organization-type.entity';

@Entity('organization_type_assignments')
@Unique(['organization_id', 'organization_type_id'])
@Index(['organization_id'])
@Index(['organization_type_id'])
export class OrganizationTypeAssignment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  organization_id: string;

  @Column({ type: 'smallint' })
  organization_type_id: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  // Relations
  @ManyToOne(() => Organization, (org) => org.typeAssignments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ManyToOne(() => OrganizationType, (type) => type.assignments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'organization_type_id' })
  organizationType: OrganizationType;
}
