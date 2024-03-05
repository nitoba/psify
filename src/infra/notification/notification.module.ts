import { Module } from '@nestjs/common'

import { MailNotificationPublisher } from '@/domain/notification/application/notification-publisher/mail'

import { DatabaseModule } from '../database/database.module'
import { ResendMailNotificationPublisher } from './resend-mail-notification-publisher'

@Module({
  imports: [DatabaseModule],
  providers: [
    {
      provide: MailNotificationPublisher,
      useClass: ResendMailNotificationPublisher,
    },
  ],
  exports: [MailNotificationPublisher],
})
export class NotificationModule {}
