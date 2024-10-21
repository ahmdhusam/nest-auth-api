import { Controller, Get } from '@nestjs/common';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './schemas/user.schema';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UseSerialize } from 'src/core/serialize/serialize.decorator';
import { UserSerialize } from './dtos/user.serialize';

@ApiBearerAuth()
@ApiTags('User')
@Controller()
export class UsersController {
  constructor() {}

  @ApiOperation({
    summary: 'Get user profile',
    description: 'Retrieves the profile of the currently authenticated user',
  })
  @ApiOkResponse({ description: 'User profile retrieved successfully', type: UserSerialize })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseSerialize(UserSerialize)
  @Get('me')
  getProfile(@CurrentUser() user: User) {
    return user;
  }
}
