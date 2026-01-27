import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SessionConfigService {
  constructor(private configService: ConfigService) {}

  get secret(): string {
    return this.configService.get<string>('session.secret', 'your-session-secret');
  }

  get maxAge(): number {
    return this.configService.get<number>('session.maxAge', 86400000);
  }
}
