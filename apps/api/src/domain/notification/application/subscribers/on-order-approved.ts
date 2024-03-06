import { Injectable } from '@nestjs/common'

import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { AuthPatientRepository } from '@/domain/auth/application/repositories/auth-patient-repository'
import { OrderApproved } from '@/domain/payment/enterprise/events/order-approved'
import { MarkAppointmentAsScheduledUseCase } from '@/domain/schedules/application/use-cases/mark-appointment-as-scheduled'

import { SendNotificationUseCase } from '../use-cases/send-mail-notification'

@Injectable()
export class OnOrderApproved implements EventHandler {
  constructor(
    private readonly sendNotificationUseCase: SendNotificationUseCase,
    private readonly patientRepository: AuthPatientRepository,
    private readonly markAsScheduledUseCase: MarkAppointmentAsScheduledUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendMailNotificationToPatient.bind(this),
      OrderApproved.name,
    )
  }

  private async sendMailNotificationToPatient({ order }: OrderApproved) {
    const patient = await this.patientRepository.findById(
      order.costumerId.toString(),
    )

    if (!patient) return
    const result = await this.markAsScheduledUseCase.execute({
      scheduleAppointmentId: order.orderItems[0].itemId.toString(),
    })

    if (result.isLeft()) {
      console.log('Error to mark appointment as scheduled:', result.value)
    }

    await this.sendNotificationUseCase.execute({
      to: patient.email,
      subject: 'Order approved',
      content: `The order with id ${order.id.toString()} was approved. Your appointment was scheduled with successfully!`,
    })
  }
}
