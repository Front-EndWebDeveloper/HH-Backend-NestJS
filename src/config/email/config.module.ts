import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { EmailConfigService } from './config.service';
import configuration from './configuration';

@Module({
  imports: [NestConfigModule.forFeature(configuration)],
  providers: [EmailConfigService],
  exports: [EmailConfigService],
})
export class EmailConfigModule {}
