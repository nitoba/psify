import { MailNotificationPublisher } from '@/domain/notification/application/notification-publisher/mail'
import { Notification } from '@/domain/notification/enterprise/entities/notification'

export class FakeMailPublisher implements MailNotificationPublisher {
  notifications: Notification[] = []

  async send(notification: Notification): Promise<void> {
    this.notifications.push(notification)
  }
}
