import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './entities/patient.entity';
import { PatientProfile } from './entities/patient-profile.entity';
import { AuthenticationModule } from '../../authentication/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Patient, PatientProfile]), AuthenticationModule],
  exports: [TypeOrmModule],
})
export class PatientsModule {}
