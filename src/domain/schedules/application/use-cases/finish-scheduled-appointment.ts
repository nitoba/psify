import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'
import { InvalidResource } from '@/domain/core/enterprise/errors/invalid-resource'
import { AppointmentsRepository } from '@/domain/schedules/application/repositories/appointments-repository'

type FinishScheduledAppointmentUseCaseRequest = {
  scheduleAppointmentId: string
}

type FinishScheduledAppointmentUseCaseResponse = Either<
  ResourceNotFound | InvalidResource,
  void
>

export class FinishScheduledAppointmentUseCase {
  constructor(
    private readonly appointmentsRepository: AppointmentsRepository,
  ) {}

  async execute({
    scheduleAppointmentId,
  }: FinishScheduledAppointmentUseCaseRequest): Promise<FinishScheduledAppointmentUseCaseResponse> {
    const scheduleAppointment = await this.appointmentsRepository.findById({
      appointmentId: new UniqueEntityID(scheduleAppointmentId),
    })

    if (!scheduleAppointment) {
      return left(new ResourceNotFound('Scheduled Appointment not found'))
    }

    const isInvalidStatus = ['finished', 'canceled'].includes(
      scheduleAppointment.status,
    )

    if (isInvalidStatus) {
      return left(
        new InvalidResource('This scheduled appointment could not be finished'),
      )
    }

    scheduleAppointment.finish()

    this.appointmentsRepository.update(scheduleAppointment)

    return right(undefined)
  }
}
