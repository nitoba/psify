import { Injectable } from '@nestjs/common'

import { left, right } from '@/core/either'
import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'
import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { AuthPsychologistRepository } from '@/domain/auth/application/repositories/auth-psychologist-repository'
import { AppointmentsRepository } from '@/domain/schedules/application/repositories/appointments-repository'
import { AppointmentRequested } from '@/domain/schedules/enterprise/events/appointment-requested'

import { SendNotificationUseCase } from '../use-cases/send-mail-notification'

@Injectable()
export class OnAppointmentRequestedHandler implements EventHandler {
  constructor(
    private readonly appointmentRepository: AppointmentsRepository,
    private readonly psychologistRepository: AuthPsychologistRepository,
    private readonly sendNotificationUseCase: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.notifyAboutAppointmentRequested.bind(this),
      AppointmentRequested.name,
    )
  }

  private async notifyAboutAppointmentRequested({
    appointment,
  }: AppointmentRequested) {
    const appointmentExists = await this.appointmentRepository.findById(
      appointment.id.toString(),
    )

    if (!appointmentExists) {
      return left(new ResourceNotFound('Appointment not found'))
    }

    const psychologist = await this.psychologistRepository.findById(
      appointmentExists.psychologistId.toString(),
    )

    if (!psychologist) {
      return left(new ResourceNotFound('Psychologist not found'))
    }

    await this.sendNotificationUseCase.execute({
      subject: 'New Appointment Requested',
      content:
        'You received a new appointment requested, go to the platform to approve or cancel',
      to: psychologist.email,
    })

    return right(undefined)
  }
}
