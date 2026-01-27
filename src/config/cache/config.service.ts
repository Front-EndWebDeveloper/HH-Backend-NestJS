import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CacheConfigService {
  constructor(private configService: ConfigService) {}

  get host(): string {
    return this.configService.get<string>('cache.host', 'localhost');
  }

  get port(): number {
    return this.configService.get<number>('cache.port', 6379);
  }

  get password(): string {
    return this.configService.get<string>('cache.password', '');
  }

  get ttl(): number {
    return this.configService.get<number>('cache.ttl', 3600);
  }
}
