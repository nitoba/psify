import { Inject, Injectable } from '@nestjs/common'
import Stripe from 'stripe'

import { PaymentGateway } from '@/domain/payment/application/gateway/payment-gateway'
import { Order } from '@/domain/payment/enterprise/entities/order'

import { MODULE_OPTIONS_TOKEN } from './stripe.module-definitions'
import { StripeModuleOptions } from './stripe-options'

@Injectable()
export class StripePaymentGateway implements PaymentGateway {
  private readonly stripe: Stripe
  constructor(
    @Inject(MODULE_OPTIONS_TOKEN) private options: StripeModuleOptions,
  ) {
    this.stripe = new Stripe(this.options.apiKey, this.options.options)
  }

  async requestPayment(order: Order): Promise<string | null> {
    console.log('StripePaymentGateway.requestPayment', order)
    throw new Error('Method not implemented.')
  }

  async pay(order: Order): Promise<void> {
    console.log('StripePaymentGateway.pay', order)
    throw new Error('Method not implemented.')
  }
}
