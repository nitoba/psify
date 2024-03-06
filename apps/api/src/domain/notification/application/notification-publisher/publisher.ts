import { Notification } from '../../enterprise/entities/notification'

export abstract class NotificationPublisher {
  abstract publish(notification: Notification): Promise<void>
}
