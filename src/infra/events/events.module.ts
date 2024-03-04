import { Module } from '@nestjs/common'

import { OnAppointmentCreatedHandler } from '@/domain/payment/application/subscribers/on-appointment-requested'
import { CreateIntentOrderUseCase } from '@/domain/payment/application/use-cases/create-intent-order'

import { DatabaseModule } from '../database/database.module'

@Module({
  imports: [DatabaseModule],
  providers: [OnAppointmentCreatedHandler, CreateIntentOrderUseCase],
})
export class EventsModule {}
