import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from './entities/address.entity';
import { AddressSerializer } from './serializers/address.serializer';

@Injectable()
export class AddressesService {
  private addressSerializer = new AddressSerializer();

  constructor(
    @InjectRepository(Address)
    private addressesRepository: Repository<Address>,
  ) {}

  async findAll(): Promise<any[]> {
    const addresses = await this.addressesRepository.find();
    return this.addressSerializer.serializeMany(addresses);
  }

  async create(createAddressDto: any): Promise<any> {
    const address = this.addressesRepository.create(createAddressDto);
    const saved = await this.addressesRepository.save(address);
    // save() can return an array if multiple entities are saved, but we're saving one
    const savedAddress = Array.isArray(saved) ? saved[0] : saved;
    return this.addressSerializer.serialize(savedAddress);
  }
}
