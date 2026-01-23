import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StorageConfigService {
  constructor(private configService: ConfigService) {}

  get type(): string {
    return this.configService.get<string>('storage.type', 'local');
  }

  get path(): string {
    return this.configService.get<string>('storage.path', './storage');
  }

  get s3Region(): string {
    return this.configService.get<string>('storage.s3.region', 'us-east-1');
  }

  get s3Bucket(): string {
    return this.configService.get<string>('storage.s3.bucket', '');
  }

  get s3AccessKeyId(): string {
    return this.configService.get<string>('storage.s3.accessKeyId', '');
  }

  get s3SecretAccessKey(): string {
    return this.configService.get<string>('storage.s3.secretAccessKey', '');
  }

  get isS3(): boolean {
    return this.type === 's3';
  }
}

