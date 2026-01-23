import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { AdminProfile } from './entities/admin-profile.entity';
import { AuthenticationModule } from '../../authentication/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin, AdminProfile]),
    AuthenticationModule,
  ],
  exports: [TypeOrmModule],
})
export class AdminsModule {}

