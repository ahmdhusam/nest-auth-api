import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { getRequestFromContext } from 'src/utils/execution-context.util';

@Injectable()
export class GlobalThrottlerGuard extends ThrottlerGuard {
  getRequestResponse(context: ExecutionContext) {
    const req = getRequestFromContext(context);
    return { req, res: req.res };
  }
}
