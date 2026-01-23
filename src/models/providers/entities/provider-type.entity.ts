import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { ProviderTypeAssignment } from './provider-type-assignment.entity';

@Entity('provider_types')
@Index(['name'], { unique: true })
export class ProviderType {
  @PrimaryColumn({ type: 'smallint' })
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  name: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  // Relations
  @OneToMany(
    () => ProviderTypeAssignment,
    (assignment) => assignment.providerType,
  )
  assignments: ProviderTypeAssignment[];
}

