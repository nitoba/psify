import { Either, left, right } from '@/core/either'
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
    const appointment = await this.appointmentsRepository.findById(
      scheduleAppointmentId,
    )

    if (!appointment) {
      return left(new ResourceNotFound('Scheduled Appointment not found'))
    }

    const result = appointment.schedule()

    if (result.isLeft()) {
      return left(result.value)
    }

    await this.appointmentsRepository.save(appointment)

    return right(undefined)
  }
}
