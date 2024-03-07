import { Module } from '@nestjs/common'

import { OnAppointmentRejectedHandler } from '@/domain/notification/application/subscribers/on-appointment-rejected'
import { OnAppointmentRequestedHandler } from '@/domain/notification/application/subscribers/on-appointment-requested'
import { OnAppointmentApprovedHandler as OnAppointmentApprovedNotification } from '@/domain/notification/application/subscribers/on-appointment-approved'
import { OnOrderApproved } from '@/domain/notification/application/subscribers/on-order-approved'
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-mail-notification'
import { OnAppointmentApprovedHandler } from '@/domain/payment/application/subscribers/on-appointment-approved'
import { ApproveOrderUseCase } from '@/domain/payment/application/use-cases/approve-order'
import { CreateIntentOrderUseCase } from '@/domain/payment/application/use-cases/create-intent-order'
import { MarkAppointmentAsScheduledUseCase } from '@/domain/schedules/application/use-cases/mark-appointment-as-scheduled'

import { DatabaseModule } from '../database/database.module'
import { NotificationModule } from '../notification/notification.module'

@Module({
  imports: [DatabaseModule, NotificationModule],
  providers: [
    // Subscribers Handlers
    OnAppointmentRequestedHandler,
    OnAppointmentApprovedHandler,
    OnAppointmentRejectedHandler,
    OnAppointmentApprovedNotification,
    OnOrderApproved,
    // UseCases executed by handlers
    CreateIntentOrderUseCase,
    ApproveOrderUseCase,
    SendNotificationUseCase,
    MarkAppointmentAsScheduledUseCase,
  ],
})
export class EventsModule {}
