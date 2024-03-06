import { Injectable } from '@nestjs/common'

import { Email } from '@/domain/core/enterprise/value-objects/email'

import { Notification } from '../../enterprise/entities/notification'
import { MailNotificationPublisher } from '../notification-publisher/mail'
import { NotificationRepository } from '../repositories/notification-repository'

type SendNotificationUseCaseRequest = {
  subject: string
  content: string
  to: string
}

@Injectable()
export class SendNotificationUseCase {
  constructor(
    private readonly notificationPublisher: MailNotificationPublisher,
    private readonly notificationRepository: NotificationRepository,
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

    await this.notificationRepository.create(notification)
    await this.notificationPublisher.send(notification)
  }
}
