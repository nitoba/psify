import { Module } from '@nestjs/common'

import { PaymentGateway } from '@/domain/payment/application/gateway/payment-gateway'
import { DatabaseModule } from '@/infra/database/database.module'

import { StripeWebhookGuard } from '../guards/stripe-webhook-guard'
import { ConfigurableModuleClass } from './stripe.module-definitions'
import { StripePaymentGateway } from './stripe-payment-gateway'

@Module({
  imports: [DatabaseModule],
  providers: [
    {
      provide: PaymentGateway,
      useClass: StripePaymentGateway,
    },
    StripeWebhookGuard,
  ],
  exports: [PaymentGateway],
})
export class StripeModule extends ConfigurableModuleClass {}
