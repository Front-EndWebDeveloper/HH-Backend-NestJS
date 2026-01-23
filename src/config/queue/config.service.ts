import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class QueueConfigService {
  constructor(private configService: ConfigService) {}

  get host(): string {
    return this.configService.get<string>('queue.host', 'localhost');
  }

  get port(): number {
    return this.configService.get<number>('queue.port', 6379);
  }

  get password(): string {
    return this.configService.get<string>('queue.password', '');
  }
}

