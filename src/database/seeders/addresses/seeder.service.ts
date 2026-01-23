import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from '../../../models/addresses/entities/address.entity';
import { AddressFactory } from '../../factories/addresses/factory';

@Injectable()
export class AddressSeederService {
  constructor(
    @InjectRepository(Address)
    private addressesRepository: Repository<Address>,
  ) {}

  async seed(userId: string): Promise<void> {
    const addressData = AddressFactory.create({ userId });
    await this.addressesRepository.save(addressData);
    console.log('Addresses seeded successfully');
  }
}

