import { Injectable } from '@nestjs/common'
import { InjectConnection } from '@nestjs/mongoose'
import { Connection } from 'mongoose'

import { NotificationRepository } from '@/domain/notification/application/repositories/notification-repository'
import { Notification } from '@/domain/notification/enterprise/entities/notification'
import { EnvService } from '@/infra/env/env.service'

import {
  Notification as NotificationModel,
  NotificationSchema,
} from '../schemas/notification'

@Injectable()
export class MongoNotificationRepository implements NotificationRepository {
  constructor(
    @InjectConnection() private connection: Connection,
    private envService: EnvService,
  ) {}

  async create(notification: Notification): Promise<void> {
    const notificationCreated = await this.connection
      .model(
        NotificationModel.name,
        NotificationSchema,
        this.envService.get('MONGODB_NOTIFICATIONS_COLLECTION'),
      )
      .create({
        id: notification.id.toString(),
        subject: notification.subject,
        content: notification.content,
        to: notification.to,
      })

    console.log('Notification Created', notificationCreated)
  }
}
