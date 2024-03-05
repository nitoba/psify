import { Injectable } from '@nestjs/common'

import { left, right } from '@/core/either'
import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'
import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { AuthPatientRepository } from '@/domain/auth/application/repositories/auth-patient-repository'
import { AppointmentsRepository } from '@/domain/schedules/application/repositories/appointments-repository'
import { AppointmentRequested } from '@/domain/schedules/enterprise/events/appointment-requested'

import { SendNotificationUseCase } from '../use-cases/send-mail-notification'

@Injectable()
export class OnAppointmentRejectedHandler implements EventHandler {
  constructor(
    private readonly appointmentRepository: AppointmentsRepository,
    private readonly patientRepository: AuthPatientRepository,
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

    const patient = await this.patientRepository.findById(
      appointmentExists.patientId.toString(),
    )

    if (!patient) {
      return left(new ResourceNotFound('Patient not found'))
    }

    await this.sendNotificationUseCase.execute({
      subject: 'Rejected Appointment',
      content:
        'Unfortunately your appointment requested was rejected, you can try again!',
      to: patient.email,
    })

    return right(undefined)
  }
}
