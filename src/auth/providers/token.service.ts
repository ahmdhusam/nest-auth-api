import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/schemas/user.schema';
import { HashService } from 'src/common/services/hash.service';
import { isDefined } from 'class-validator';
import { AppConfigService } from 'src/common/services/configuration.service';

@Injectable()
export class TokenService {
  private readonly JWT_REFRESH_SECRET: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly hashService: HashService,
    private readonly configService: AppConfigService,
  ) {
    this.JWT_REFRESH_SECRET = configService.jwtRefreshSecret();
  }

  async generateTokens(userId: string, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      // Access token uses default values from JwtModule configuration
      this.jwtService.signAsync({ sub: userId, email }),
      // Refresh token overwrites default values with custom configuration
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          expiresIn: this.configService.jwtRefreshExpiresIn(),
          secret: this.JWT_REFRESH_SECRET,
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async validateToken(token: string, isRefreshToken = false) {
    const signOptions = isRefreshToken ? { secret: this.JWT_REFRESH_SECRET } : {};

    try {
      const payload = await this.jwtService.verifyAsync(token, signOptions);
      return payload;
    } catch (error) {
      return null;
    }
  }

  async isRefreshTokenValid(user: User, refreshToken: string) {
    return isDefined(user.refreshToken) && (await this.hashService.compare(refreshToken, user.refreshToken));
  }
}
