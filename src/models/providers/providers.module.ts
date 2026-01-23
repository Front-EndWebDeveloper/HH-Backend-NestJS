import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Provider } from './entities/provider.entity';
import { ProviderType } from './entities/provider-type.entity';
import { ProviderTypeAssignment } from './entities/provider-type-assignment.entity';
import { ProviderProfile } from './entities/provider-profile.entity';
import { AuthenticationModule } from '../../authentication/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Provider,
      ProviderType,
      ProviderTypeAssignment,
      ProviderProfile,
    ]),
    AuthenticationModule,
  ],
  exports: [TypeOrmModule],
})
export class ProvidersModule {}

