import { Controller, Post, Body, Patch, HttpCode, HttpStatus, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto, SignInDto } from './dto';
import { UseRefreshTokenGuard } from './guards/refresh-token.guard';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UseLocalGaurd } from './guards/local.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/schemas/user.schema';
import { IsPublic } from './guards/is-public.guard';
import { Throttle } from '@nestjs/throttler';

@ApiTags('Auth')
@Throttle({ default: { limit: 10, ttl: 60000 } })
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @IsPublic()
  @ApiOperation({ summary: 'Sign up a new user' })
  @ApiBody({ type: SignUpDto })
  @ApiCreatedResponse({ description: 'User successfully created' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @ApiOperation({ summary: 'Sign in a user' })
  @ApiBody({ type: SignInDto })
  @ApiOkResponse({ description: 'User successfully signed in' })
  @ApiBadRequestResponse({ description: 'Invalid credentials' })
  @IsPublic()
  @UseLocalGaurd()
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signIn(@CurrentUser() user: User) {
    return this.authService.generateAndSaveTokens(user);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiOkResponse({ description: 'New access token generated successfully' })
  @ApiBadRequestResponse({ description: 'Invalid refresh token' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @IsPublic()
  @UseRefreshTokenGuard()
  @Patch('refresh-token')
  refreshTokens(@CurrentUser() user: User, @Headers('authorization') refreshToken: string) {
    return this.authService.refreshTokens(user, refreshToken.split(' ')[1]);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout a user' })
  @ApiNoContentResponse({ description: 'User successfully logged out' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout')
  logout(@CurrentUser() user: User) {
    return this.authService.logout(user.id);
  }
}
