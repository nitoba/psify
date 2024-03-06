import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'
import { InvalidResource } from '@/domain/core/enterprise/errors/invalid-resource'
import { AppointmentsRepository } from '@/domain/schedules/application/repositories/appointments-repository'

type CancelScheduledAppointmentUseCaseRequest = {
  scheduledAppointmentId: string
}

type CancelScheduledAppointmentUseCaseResponse = Either<
  ResourceNotFound | InvalidResource,
  void
>
@Injectable()
export class CancelScheduledAppointmentUseCase {
  constructor(
    private readonly appointmentsRepository: AppointmentsRepository,
  ) {}

  async execute({
    scheduledAppointmentId,
  }: CancelScheduledAppointmentUseCaseRequest): Promise<CancelScheduledAppointmentUseCaseResponse> {
    const scheduleAppointment = await this.appointmentsRepository.findById(
      scheduledAppointmentId,
    )

    if (!scheduleAppointment) {
      return left(new ResourceNotFound('Scheduled Appointment not found'))
    }

    const result = scheduleAppointment.cancel()

    if (result.isLeft()) {
      return left(result.value)
    }

    this.appointmentsRepository.save(scheduleAppointment)

    return right(undefined)
  }
}
