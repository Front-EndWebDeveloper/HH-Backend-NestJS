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
import { Patient } from './patient.entity';

@Entity('patient_profiles')
@Index(['patient_id'], { unique: true })
@Index(['first_name'])
@Index(['last_name'])
@Index(['date_of_birth'])
@Index(['social_security_number'])
export class PatientProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  patient_id: string;

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

  @Column({ type: 'varchar', length: 10, default: 'pending' })
  onboarding_status: string; // PENDING | COMPLETED

  // Patient specific - Essential Information
  @Column({ type: 'varchar', length: 100, nullable: true })
  first_name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  middle_name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  last_name: string;

  @Column({ type: 'date', nullable: true })
  date_of_birth: Date;

  @Column({ type: 'varchar', length: 11, nullable: true })
  social_security_number: string; // Format: XXX-XX-XXXX

  @Column({ type: 'varchar', length: 20, nullable: true })
  marital_status: string; // SINGLE | MARRIED | DIVORCED | WIDOWED | SEPARATED | DOMESTIC_PARTNERSHIP

  @Column({ type: 'varchar', length: 100, nullable: true })
  religion: string;

  // Contact Information
  @Column({ type: 'varchar', length: 255, nullable: true })
  patient_address_street: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  patient_address_city: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  patient_address_state: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  patient_address_zip: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  home_phone: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  work_phone: string;

  @Column({ type: 'varchar', length: 254, nullable: true })
  email_address: string;

  // Emergency Contact
  @Column({ type: 'varchar', length: 100, nullable: true })
  emergency_contact_first_name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  emergency_contact_last_name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  emergency_contact_relationship: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  emergency_contact_phone: string;

  @Column({ type: 'text', nullable: true })
  emergency_contact_address: string;

  // Next of Kin
  @Column({ type: 'varchar', length: 100, nullable: true })
  next_of_kin_first_name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  next_of_kin_last_name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  next_of_kin_relationship: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  next_of_kin_phone: string;

  @Column({ type: 'text', nullable: true })
  next_of_kin_address: string;

  // Insurance Information
  @Column({ type: 'varchar', length: 200, nullable: true })
  primary_insurance_provider: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  primary_member_id: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  primary_group_id: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  secondary_insurance_provider: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  secondary_member_id: string;

  // Financial Information
  @Column({ type: 'varchar', length: 20, nullable: true })
  income_source: string; // PRIVATE_FUNDS | PENSION | SSA | VA | SSI | OTHER

  @Column({ type: 'boolean', default: false })
  medicaid_eligibility: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  // Relations
  @OneToOne(() => Patient, (patient) => patient.profile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;
}
