import { Module } from '@nestjs/common'

import { NodeMailerModule } from './node-mailer/node-mailer.module'
import { EnvModule } from '../env/env.module'
import { EnvService } from '../env/env.service'

@Module({
  imports: [
    NodeMailerModule.forRootAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: (env: EnvService) => ({
        options: {
          host: env.get('SMTP_HOST'),
          port: env.get('SMTP_PORT'),
          auth: {
            user: env.get('SMTP_AUTH_USER'),
            pass: env.get('SMTP_AUTH_PASS'),
          },
        },
      }),
    }),
  ],
  exports: [NodeMailerModule],
})
export class NotificationModule {}
