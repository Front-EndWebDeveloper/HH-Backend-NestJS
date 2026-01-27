import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { PostgresConfigModule } from '../../../config/database/postgres/config.module';
import { PostgresConfigService } from '../../../config/database/postgres/config.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [PostgresConfigModule],
      useFactory: async (postgresConfigService: PostgresConfigService) => ({
        type: 'postgres',
        host: postgresConfigService.host,
        port: postgresConfigService.port,
        username: postgresConfigService.username,
        password: postgresConfigService.password,
        database: postgresConfigService.database,
        synchronize: postgresConfigService.synchronize,
        logging: postgresConfigService.logging,
        migrationsRun: postgresConfigService.migrationsRun,
        migrations: postgresConfigService.migrations,
        entities: [
          'dist/**/*.entity.js',
          'dist/authentication/entities/*.entity.js',
          'dist/models/**/entities/*.entity.js',
        ],
        ssl:
          process.env.NODE_ENV === 'production'
            ? {
                rejectUnauthorized: true,
                ca: process.env.DB_SSL_CA,
                cert: process.env.DB_SSL_CERT,
                key: process.env.DB_SSL_KEY,
              }
            : false,
      }),
      inject: [PostgresConfigService],
    } as TypeOrmModuleAsyncOptions),
  ],
})
export class PostgresDatabaseProviderModule {}
