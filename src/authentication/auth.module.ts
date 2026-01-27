import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthenticationController } from './authentication.controller';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './jwt.strategy';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { UserRole } from './entities/user-role.entity';
import { UserRepository } from './repositories/user.repository';
import { RoleRepository } from './repositories/role.repository';
import { TwoFactorService } from './services/two-factor.service';
import { TwoFactorModule } from './services/two-factor.module';
import { EmailModule } from '../common/services/email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, UserRole]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'your-secret-key',
      }),
      inject: [ConfigService],
    }),
    TwoFactorModule,
    EmailModule,
  ],
  controllers: [AuthenticationController],
  providers: [AuthService, JwtStrategy, UserRepository, RoleRepository],
  exports: [
    AuthService,
    JwtStrategy,
    PassportModule,
    UserRepository,
    RoleRepository,
    TypeOrmModule,
  ],
})
export class AuthenticationModule {}
export { AuthenticationModule as AuthModule };
