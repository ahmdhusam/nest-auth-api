import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User } from '../schemas/user.schema';
import { getRequestFromContext } from 'src/utils/execution-context.util';

export const CurrentUser = createParamDecorator((_: never, context: ExecutionContext): User => {
  const req = getRequestFromContext(context);
  return req.user;
});
