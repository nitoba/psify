import { Notification } from '../../enterprise/entities/notification'

export abstract class MailNotificationPublisher {
  abstract send(notification: Notification): Promise<void>
}
