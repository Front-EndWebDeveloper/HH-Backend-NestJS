import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { QueueConfigService } from './config.service';
import configuration from './configuration';

@Module({
  imports: [NestConfigModule.forFeature(configuration)],
  providers: [QueueConfigService],
  exports: [QueueConfigService],
})
export class QueueConfigModule {}
