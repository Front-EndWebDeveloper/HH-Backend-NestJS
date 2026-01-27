import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AppConfigService } from './config/app/config.service';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  const appConfigService = app.get(AppConfigService);

  // Global prefix
  app.setGlobalPrefix(appConfigService.apiPrefix);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // HIPAA Compliance: Enable CORS with proper configuration
  // Note: Install @fastify/cors for CORS support
  // npm install @fastify/cors
  // await app.register(require('@fastify/cors'), {
  //   origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  //   credentials: true,
  // });

  await app.listen(appConfigService.port, '0.0.0.0');
  console.log(`Application is running on: http://localhost:${appConfigService.port}`);
}
bootstrap();
