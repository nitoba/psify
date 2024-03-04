import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'
import { InvalidResource } from '@/domain/core/enterprise/errors/invalid-resource'
import { AppointmentsRepository } from '@/domain/schedules/application/repositories/appointments-repository'

type FinishScheduledAppointmentUseCaseRequest = {
  scheduledAppointmentId: string
}

type FinishScheduledAppointmentUseCaseResponse = Either<
  ResourceNotFound | InvalidResource,
  void
>

@Injectable()
export class FinishScheduledAppointmentUseCase {
  constructor(
    private readonly appointmentsRepository: AppointmentsRepository,
  ) {}

  async execute({
    scheduledAppointmentId,
  }: FinishScheduledAppointmentUseCaseRequest): Promise<FinishScheduledAppointmentUseCaseResponse> {
    const scheduledAppointment = await this.appointmentsRepository.findById(
      scheduledAppointmentId,
    )

    if (!scheduledAppointment) {
      return left(new ResourceNotFound('Scheduled Appointment not found'))
    }

    const result = scheduledAppointment.finish()

    if (result.isLeft()) {
      return left(result.value)
    }

    this.appointmentsRepository.save(scheduledAppointment)

    return right(undefined)
  }
}
