import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'

import { AppointmentsRepository } from '../repositories/appointments-repository'

type MarkAppointmentAsScheduledUseCaseRequest = {
  scheduleAppointmentId: string
}

type MarkAppointmentAsScheduledUseCaseResponse = Either<ResourceNotFound, void>

export class MarkAppointmentAsScheduledUseCase {
  constructor(
    private readonly appointmentsRepository: AppointmentsRepository,
  ) {}

  async execute({
    scheduleAppointmentId,
  }: MarkAppointmentAsScheduledUseCaseRequest): Promise<MarkAppointmentAsScheduledUseCaseResponse> {
    const scheduledAppointment = await this.appointmentsRepository.findById({
      appointmentId: new UniqueEntityID(scheduleAppointmentId),
    })

    if (!scheduledAppointment) {
      return left(new ResourceNotFound('Scheduled Appointment not found'))
    }

    const result = scheduledAppointment.schedule()

    if (result.isLeft()) {
      return left(result.value)
    }

    return right(undefined)
  }
}
