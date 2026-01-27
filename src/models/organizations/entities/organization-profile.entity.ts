import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Organization } from './organization.entity';
import { OrganizationType } from './organization-type.entity';

@Entity('organization_profiles')
@Index(['organization_id'], { unique: true })
@Index(['organization_type_id'])
@Index(['state_license'])
@Index(['npi_number'])
@Index(['ein'])
export class OrganizationProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  organization_id: string;

  @Column({ type: 'smallint' })
  organization_type_id: number;

  // Common address fields
  @Column({ type: 'varchar', length: 255, nullable: true })
  address_line_1: string;

  @Column({ type: 'varchar', length: 255, nullable: true, default: '' })
  address_line_2: string;

  @Column({ type: 'varchar', length: 4, nullable: true })
  zip_code_1: string;

  @Column({ type: 'varchar', length: 4, nullable: true })
  zip_code_2: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone_number: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  fax_number: string;

  // Home Health, Hospice, Nursing Home specific
  @Column({ type: 'varchar', length: 10, nullable: true })
  npi_number: string;

  @Column({ type: 'varchar', length: 9, nullable: true })
  ein: string;

  @Column({ type: 'varchar', length: 9, nullable: true })
  ptin: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  state_license: string;

  @Column({ type: 'date', nullable: true })
  state_license_expiration: Date;

  @Column({ type: 'text', nullable: true })
  clia_number: string;

  @Column({ type: 'date', nullable: true })
  clia_expiration: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  business_license: string;

  @Column({ type: 'date', nullable: true })
  business_license_expiration: Date;

  @Column({ type: 'varchar', length: 50, nullable: true, default: '' })
  ftb: string;

  // Personnel fields - Home Health, Hospice, Nursing Home
  @Column({ type: 'varchar', length: 255, nullable: true })
  administrator_name: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  administrator_id: string;

  @Column({ type: 'date', nullable: true })
  administrator_expiration: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  designee_administrator_name: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  designee_administrator_id: string;

  @Column({ type: 'date', nullable: true })
  designee_administrator_expiration: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  dpcs_don_name: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  dpcs_don_id: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  dpcs_don_license: string;

  @Column({ type: 'date', nullable: true })
  dpcs_don_expiration: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  designee_dpcs_don_name: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  designee_dpcs_don_id: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  designee_dpcs_don_license: string;

  @Column({ type: 'date', nullable: true })
  designee_dpcs_don_expiration: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  medical_director_name: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  medical_director_id: string;

  @Column({ type: 'date', nullable: true })
  medical_director_expiration: Date;

  // Board and Care specific
  @Column({ type: 'varchar', length: 255, nullable: true })
  admin_name: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  admin_license: string;

  @Column({ type: 'date', nullable: true })
  admin_expiration: Date;

  @Column({ type: 'varchar', length: 50, nullable: true, default: '' })
  rcfe_number: string;

  @Column({ type: 'varchar', length: 50, nullable: true, default: '' })
  rcfe_license: string;

  @Column({ type: 'date', nullable: true })
  rcfe_expiration: Date;

  // Pharmacist specific
  @Column({ type: 'varchar', length: 255, nullable: true })
  pharmacist_name: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  pharmacist_license: string;

  @Column({ type: 'date', nullable: true })
  pharmacist_license_expiration: Date;

  // Lab specific
  @Column({ type: 'varchar', length: 255, nullable: true })
  lab_owner_name: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  lab_license: string;

  @Column({ type: 'date', nullable: true })
  lab_license_expiration: Date;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  // Relations
  @OneToOne(() => Organization, (org) => org.profile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ManyToOne(() => OrganizationType, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organization_type_id' })
  organizationType: OrganizationType;
}
