import { ExecutionContext, NotImplementedException } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';

export function getRequestFromContext(context: ExecutionContext): any {
  switch (context.getType<GqlContextType>()) {
    case 'http':
      return context.switchToHttp().getRequest();
    case 'graphql':
      return GqlExecutionContext.create(context).getContext().req;
    default:
      throw new NotImplementedException('Unsupported execution context type');
  }
}
