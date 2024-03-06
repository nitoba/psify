import { Module } from '@nestjs/common'

import { EnvModule } from '../env/env.module'
import { EnvService } from '../env/env.service'
import { StripeModule } from './stripe/stripe.module'

@Module({
  imports: [
    StripeModule.forRootAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: (env: EnvService) => ({
        apiKey: env.get('STRIPE_SECRET_KEY'),
        options: {
          apiVersion: '2023-10-16',
        },
      }),
    }),
  ],
  exports: [StripeModule],
})
export class PaymentModule {}
