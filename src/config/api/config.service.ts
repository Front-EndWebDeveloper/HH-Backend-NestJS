import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiConfigService {
  constructor(private configService: ConfigService) {}

  get version(): string {
    return this.configService.get<string>('api.version', 'v1');
  }

  get prefix(): string {
    return this.configService.get<string>('api.prefix', 'v1/api');
  }
}

