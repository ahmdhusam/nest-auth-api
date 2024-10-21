import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { CommonModule } from '../common/common.module';
import { TokenService } from './providers/token.service';
import { JwtRefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { AppConfigService } from 'src/common/services/configuration.service';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [AppConfigService],
      useFactory: (configService: AppConfigService) => ({
        secret: configService.jwtAccessSecret(),
        signOptions: { expiresIn: configService.jwtAccessExpiresIn() },
      }),
    }),
    CommonModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtRefreshTokenStrategy, LocalStrategy, TokenService],
})
export class AuthModule {}
