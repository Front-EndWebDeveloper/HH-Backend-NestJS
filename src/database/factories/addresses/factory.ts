import { Address } from '../../../models/addresses/entities/address.entity';

export class AddressFactory {
  static create(overrides: Partial<Address> = {}): Partial<Address> {
    return {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
      ...overrides,
    };
  }
}
