import {
  CanActivate,
  ExecutionContext,
  Injectable,
  RawBodyRequest,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { FastifyRequest } from 'fastify'
import Stripe from 'stripe'

import { EnvService } from '@/infra/env/env.service'

import { IS_PUBLIC_KEY } from '../../auth/decorators/public'

@Injectable()
export class StripeWebhookGuard implements CanActivate {
  constructor(
    protected reflector: Reflector,
    private env: EnvService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    const request = context
      .switchToHttp()
      .getRequest<RawBodyRequest<FastifyRequest>>()

    const endpointSecret = this.env.get('STRIPE_ENDPOINT_SECRET')
    const hasStripeSig = request.headers['stripe-signature'] as string
    const body = request.rawBody

    try {
      const event = await Stripe.webhooks.constructEventAsync(
        body!,
        hasStripeSig,
        endpointSecret,
      )
      if (isPublic && hasStripeSig) {
        return true
      }

      request.body = event

      return true
    } catch (error) {
      console.log('Error Stripe WebHook GUARD:', error)
      return false
    }
  }
}
