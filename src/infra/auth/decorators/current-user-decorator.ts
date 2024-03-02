import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import { PayloadUser } from '../strategies/jwt.strategy'

export const CurrentUser = createParamDecorator(
  (_: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest()

    return request.user as PayloadUser
  },
)
