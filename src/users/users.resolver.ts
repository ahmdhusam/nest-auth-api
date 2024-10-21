import { Query, Resolver } from '@nestjs/graphql';
import { UserModel } from './models/user.model';
import { User } from './schemas/user.schema';
import { CurrentUser } from './decorators/current-user.decorator';
import { UseSerialize } from 'src/core/serialize/serialize.decorator';
import { UserSerialize } from './dtos/user.serialize';

@UseSerialize(UserSerialize)
@Resolver(() => UserModel)
export class UsersResolver {
  @Query(() => UserModel)
  me(@CurrentUser() user: User) {
    return user;
  }
}
