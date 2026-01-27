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
import { Provider } from './provider.entity';
import { ProviderType } from './provider-type.entity';

@Entity('provider_type_assignments')
@Unique(['provider_id', 'provider_type_id'])
@Index(['provider_id'])
@Index(['provider_type_id'])
export class ProviderTypeAssignment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  provider_id: string;

  @Column({ type: 'smallint' })
  provider_type_id: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  // Relations
  @ManyToOne(() => Provider, (provider) => provider.typeAssignments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'provider_id' })
  provider: Provider;

  @ManyToOne(() => ProviderType, (type) => type.assignments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'provider_type_id' })
  providerType: ProviderType;
}
