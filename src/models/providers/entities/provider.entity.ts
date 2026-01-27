import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { User } from '../../../authentication/entities/user.entity';
import { ProviderTypeAssignment } from './provider-type-assignment.entity';
import { ProviderProfile } from './provider-profile.entity';

@Entity('providers')
@Index(['user_id'], { unique: true })
export class Provider {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  user_id: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  // Relations
  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => ProviderTypeAssignment, (assignment) => assignment.provider)
  typeAssignments: ProviderTypeAssignment[];

  @OneToOne(() => ProviderProfile, (profile) => profile.provider)
  profile: ProviderProfile;
}
