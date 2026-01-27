import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class UserEntityPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // Implement user entity transformation/validation
    if (!value) {
      throw new BadRequestException('User entity is required');
    }
    return value;
  }
}
