import { Module } from '@nestjs/common'

import { OnOrderApproved } from '@/domain/notification/application/subscribers/on-order-approved'
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-mail-notification'
import { OnAppointmentCreatedHandler } from '@/domain/payment/application/subscribers/on-appointment-requested'
import { CreateIntentOrderUseCase } from '@/domain/payment/application/use-cases/create-intent-order'

import { DatabaseModule } from '../database/database.module'
import { NotificationModule } from '../notification/notification.module'

@Module({
  imports: [DatabaseModule, NotificationModule],
  providers: [
    OnAppointmentCreatedHandler,
    OnOrderApproved,
    CreateIntentOrderUseCase,
    SendNotificationUseCase,
  ],
})
export class EventsModule {}
