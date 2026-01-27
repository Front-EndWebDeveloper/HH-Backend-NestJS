import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { CacheConfigService } from './config.service';
import configuration from './configuration';

@Module({
  imports: [NestConfigModule.forFeature(configuration)],
  providers: [CacheConfigService],
  exports: [CacheConfigService],
})
export class CacheConfigModule {}
