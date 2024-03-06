import { Injectable } from '@nestjs/common'

import { Email } from '@/domain/core/enterprise/value-objects/email'

import { Notification, SubjectType } from '../../enterprise/entities/notification'
import { NotificationPublisher } from '../notification-publisher/publisher'
import { NotificationRepository } from '../repositories/notification-repository'

type SendNotificationUseCaseRequest = {
  subjectType: SubjectType,
  subject: string
  content: string
  to: string
}

@Injectable()
export class SendNotificationUseCase {
  constructor(
    private readonly notificationPublisher: NotificationPublisher,
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute({
    subject,
    content,
    to,
    subjectType,
  }: SendNotificationUseCaseRequest): Promise<void> {
    const notification = Notification.create({
      subjectType,
      subject,
      content,
      to: Email.create(to).value as Email,
    })

    await this.notificationRepository.create(notification)
    await this.notificationPublisher.publish(notification)
  }
}
