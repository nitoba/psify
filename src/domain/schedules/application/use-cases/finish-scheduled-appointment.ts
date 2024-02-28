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
    const scheduledAppointment = await this.appointmentsRepository.findById({
      appointmentId: new UniqueEntityID(scheduleAppointmentId),
    })

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
