import { Module } from '@nestjs/common'

import { PaymentGateway } from '@/domain/payment/application/gateway/payment-gateway'

import { StripePaymentGateway } from './stripe-paytment-gateway'

@Module({
  providers: [
    {
      provide: PaymentGateway,
      useClass: StripePaymentGateway,
    },
  ],
  exports: [PaymentGateway],
})
export class PaymentModule {}
