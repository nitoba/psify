import { Module } from '@nestjs/common'

import { PaymentGateway } from '@/domain/payment/application/gateway/payment-gateway'
import { DatabaseModule } from '@/infra/database/database.module'

import { ConfigurableModuleClass } from './stripe.module-definitions'
import { StripePaymentGateway } from './stripe-payment-gateway'

@Module({
  imports: [DatabaseModule],
  providers: [
    {
      provide: PaymentGateway,
      useClass: StripePaymentGateway,
    },
  ],
  exports: [PaymentGateway],
})
export class StripeModule extends ConfigurableModuleClass {}
