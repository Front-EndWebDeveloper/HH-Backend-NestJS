import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressSeederService } from './seeder.service';
import { Address } from '../../../models/addresses/entities/address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Address])],
  providers: [AddressSeederService],
  exports: [AddressSeederService],
})
export class AddressSeederModule {}

