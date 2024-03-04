import { Injectable } from '@nestjs/common'

import { PaymentGateway } from '@/domain/payment/application/gateway/payment-gateway'
import { Order } from '@/domain/payment/enterprise/entities/order'

@Injectable()
export class StripePaymentGateway implements PaymentGateway {
  async requestPayment(order: Order): Promise<string | null> {
    console.log('StripePaymentGateway.requestPayment', order)
    throw new Error('Method not implemented.')
  }

  async pay(order: Order): Promise<void> {
    console.log('StripePaymentGateway.pay', order)
    throw new Error('Method not implemented.')
  }
}
