import { Email } from '@/domain/core/enterprise/value-objects/email'

import { Notification } from '../../enterprise/entities/notification'
import { MailNotificationPublisher } from '../notification-publisher/mail'

type SendNotificationUseCaseRequest = {
  subject: string
  content: string
  to: string
}

export class SendNotificationUseCase {
  constructor(
    private readonly notificationPublisher: MailNotificationPublisher,
  ) {}

  async execute({
    subject,
    content,
    to,
  }: SendNotificationUseCaseRequest): Promise<void> {
    const notification = Notification.create({
      subject,
      content,
      to: Email.create(to).value as Email,
    })

    await this.notificationPublisher.send(notification)
  }
}
