import { Injectable } from '@nestjs/common'

import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { AuthPatientRepository } from '@/domain/auth/application/repositories/auth-patient-repository'
import { OrderApproved } from '@/domain/payment/enterprise/events/order-approved'

import { SendNotificationUseCase } from '../use-cases/send-mail-notification'

@Injectable()
export class OnOrderApproved implements EventHandler {
  constructor(
    private readonly sendNotificationUseCase: SendNotificationUseCase,
    private readonly patientRepository: AuthPatientRepository,
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

    await this.sendNotificationUseCase.execute({
      to: patient.email,
      subject: 'Order approved',
      content: `The order with id ${order.id.toString()} was approved. Your appointment was scheduled with successfully!`,
    })
  }
}
