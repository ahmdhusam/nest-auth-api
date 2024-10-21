import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  nodeEnv(): string {
    return this.configService.getOrThrow<string>('NODE_ENV');
  }

  port(): number {
    return this.configService.getOrThrow<number>('PORT');
  }

  mongodbUri(): string {
    return this.configService.getOrThrow<string>('MONGODB_URI');
  }

  jwtAccessSecret(): string {
    return this.configService.getOrThrow<string>('JWT_ACCESS_SECRET');
  }

  jwtAccessExpiresIn(): string {
    return this.configService.getOrThrow<string>('JWT_ACCESS_EXPIRES_IN');
  }

  jwtRefreshSecret(): string {
    return this.configService.getOrThrow<string>('JWT_REFRESH_SECRET');
  }

  jwtRefreshExpiresIn(): string {
    return this.configService.getOrThrow<string>('JWT_REFRESH_EXPIRES_IN');
  }

  isDevelopment(): boolean {
    return this.nodeEnv() === 'development';
  }

  isProduction(): boolean {
    return this.nodeEnv() === 'production';
  }
}
