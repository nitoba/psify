import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { FastifyRequest } from 'fastify'
import { Observable } from 'rxjs'

import { IS_PUBLIC_KEY } from '../../auth/decorators/public'

@Injectable()
export class StripeWebhookGuard implements CanActivate {
  constructor(protected reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<FastifyRequest>()

    const hasStripeSig = request.headers['stripe-signature']

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic && hasStripeSig) {
      return true
    }

    return false
  }
}
