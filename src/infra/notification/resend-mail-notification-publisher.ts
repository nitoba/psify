import { Injectable } from '@nestjs/common'

import { MailNotificationPublisher } from '@/domain/notification/application/notification-publisher/mail'
import { Notification } from '@/domain/notification/enterprise/entities/notification'

@Injectable()
export class ResendMailNotificationPublisher
  implements MailNotificationPublisher
{
  async send(notification: Notification): Promise<void> {
    console.log('ResendMailNotification.send', notification)
  }
}
