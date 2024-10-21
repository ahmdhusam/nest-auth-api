import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { User } from 'src/users/schemas/user.schema';
import { isEmail } from 'class-validator';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<User> {
    if (!isEmail(email)) {
      throw new BadRequestException('Invalid credentials');
    }

    return this.authService.validateUserCredentials(email.toLowerCase(), password);
  }
}
