import { Either, left, right } from '@/core/either'
import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'

import { AppointmentsRepository } from '../repositories/appointments-repository'

type MarkAppointmentAsInactiveUseCaseRequest = {
  scheduleAppointmentId: string
}

type MarkAppointmentAsInactiveUseCaseResponse = Either<ResourceNotFound, void>

export class MarkAppointmentAsInactiveUseCase {
  constructor(
    private readonly appointmentsRepository: AppointmentsRepository,
  ) {}

  async execute({
    scheduleAppointmentId,
  }: MarkAppointmentAsInactiveUseCaseRequest): Promise<MarkAppointmentAsInactiveUseCaseResponse> {
    const appointment = await this.appointmentsRepository.findById(
      scheduleAppointmentId,
    )

    if (!appointment) {
      return left(new ResourceNotFound('Scheduled Appointment not found'))
    }

    const result = appointment.inactivate()

    if (result.isLeft()) {
      return left(result.value)
    }

    await this.appointmentsRepository.save(appointment)

    return right(undefined)
  }
}
