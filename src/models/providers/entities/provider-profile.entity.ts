import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Provider } from './provider.entity';

@Entity('provider_profiles')
@Index(['provider_id'], { unique: true })
@Index(['role'])
@Index(['license_number'])
@Index(['specialization'])
export class ProviderProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  provider_id: string;

  // Profile fields moved from users
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  profile_image: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone_number: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  gender: string; // MALE | FEMALE | OTHER | PREFER_NOT_TO_SAY

  @Column({ type: 'integer', nullable: true })
  age: number;

  @Column({ type: 'jsonb', nullable: true })
  emergency_contact: Record<string, any>;

  // Provider specific
  @Column({ type: 'varchar', length: 20, nullable: true })
  role: string; // MD | DO | PA | DNP | NP | RN | LVN | PT | PTA | OT | OTA | ST | MSW | HHA | MED_TECH | PHLEBOTOMIST | FRONT_DESK | HR | BILLER | SCHEDULER | ASSISTANT_HR | ADMIN | ASSISTANT_ADMIN | OFFICE_STAFF

  @Column({ type: 'varchar', length: 50, nullable: true })
  license_number: string;

  @Column({ type: 'date', nullable: true })
  license_expiration: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  specialization: string;

  @Column({ type: 'integer', nullable: true })
  years_of_experience: number;

  @Column({ type: 'jsonb', nullable: true })
  board_certifications: Record<string, any>;

  @Column({ type: 'varchar', length: 100, nullable: true })
  certification: string;

  @Column({ type: 'varchar', length: 10, default: 'pending' })
  onboarding_status: string; // PENDING | COMPLETED

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  // Relations
  @OneToOne(() => Provider, (provider) => provider.profile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'provider_id' })
  provider: Provider;
}
