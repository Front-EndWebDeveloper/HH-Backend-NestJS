import { ModelSerializer } from '../../../common/serializers/model.serializer';
import { Address } from '../entities';

export class AddressSerializer extends ModelSerializer {
  serialize(address: Address): any {
    return {
      id: address.id,
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      userId: address.userId,
      createdAt: address.createdAt,
      updatedAt: address.updatedAt,
    };
  }
}
