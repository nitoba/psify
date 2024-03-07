import { Injectable } from '@nestjs/common'

import { left, right } from '@/core/either'
import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'
import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { AuthPatientRepository } from '@/domain/auth/application/repositories/auth-patient-repository'
import { AppointmentsRepository } from '@/domain/schedules/application/repositories/appointments-repository'

import { SendNotificationUseCase } from '../use-cases/send-mail-notification'
import { AppointmentApproved } from '@/domain/schedules/enterprise/events/appointment-approved'

@Injectable()
export class OnAppointmentApprovedHandler implements EventHandler {
  constructor(
    private readonly appointmentRepository: AppointmentsRepository,
    private readonly patientRepository: AuthPatientRepository,
    private readonly sendNotificationUseCase: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.notifyAboutAppointmentApproved.bind(this),
      AppointmentApproved.name,
    )
  }

  private async notifyAboutAppointmentApproved({
    appointment,
  }: AppointmentApproved) {
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
      return left(new ResourceNotFound('patient not found'))
    }

    await this.sendNotificationUseCase.execute({
      subject: 'Appointment Approved',
      subjectType: 'appointment_approved',
      content:
        'You appointment was approved, now you able to proceed to payment. Go to the platform to make it',
      to: patient.email,
    })

    return right(undefined)
  }
}
