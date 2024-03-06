import {  NotificationPublisher } from '@/domain/notification/application/notification-publisher/publisher'
import { Notification } from '@/domain/notification/enterprise/entities/notification'

export class FakeMailPublisher implements NotificationPublisher  {
  notifications: Notification[] = []

  async publish(notification: Notification): Promise<void> {
    this.notifications.push(notification)
  }
}
