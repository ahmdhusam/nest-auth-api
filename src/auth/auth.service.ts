import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserSignUpData, UsersService } from '../users/users.service';
import { HashService } from '../common/services/hash.service';
import { User } from 'src/users/schemas/user.schema';
import { TokenService } from './providers/token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly hashService: HashService,
    private readonly tokenService: TokenService,
  ) {}

  async signUp(userData: UserSignUpData) {
    await this.usersService.create(userData);

    return { message: 'User successfully created' };
  }

  async validateUserCredentials(email: string, password: string): Promise<User> {
    const user = await this.usersService.findOneBy({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.hashService.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async generateAndSaveTokens(user: User) {
    const tokens = await this.tokenService.generateTokens(user.id, user.email);
    const hashedRefreshToken = await this.hashService.hash(tokens.refreshToken);

    await this.usersService.updateRefreshToken(user.id, hashedRefreshToken);

    return tokens;
  }

  async refreshTokens(user: User, refreshToken: string) {
    const isMatch = await this.tokenService.isRefreshTokenValid(user, refreshToken);
    if (!isMatch) {
      throw new ForbiddenException('Access Denied');
    }

    return this.generateAndSaveTokens(user);
  }

  async logout(userId: string) {
    await this.usersService.updateRefreshToken(userId, null);
  }
}
