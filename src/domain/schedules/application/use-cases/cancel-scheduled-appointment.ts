import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'
import { InvalidResource } from '@/domain/core/enterprise/errors/invalid-resource'
import { AppointmentsRepository } from '@/domain/schedules/application/repositories/appointments-repository'

type CancelScheduledAppointmentUseCaseRequest = {
  scheduleAppointmentId: string
}

type CancelScheduledAppointmentUseCaseResponse = Either<
  ResourceNotFound | InvalidResource,
  void
>

export class CancelScheduledAppointmentUseCase {
  constructor(
    private readonly appointmentsRepository: AppointmentsRepository,
  ) {}

  async execute({
    scheduleAppointmentId,
  }: CancelScheduledAppointmentUseCaseRequest): Promise<CancelScheduledAppointmentUseCaseResponse> {
    const scheduleAppointment = await this.appointmentsRepository.findById({
      appointmentId: new UniqueEntityID(scheduleAppointmentId),
    })

    if (!scheduleAppointment) {
      return left(new ResourceNotFound('Scheduled Appointment not found'))
    }

    if (['canceled', 'finished'].includes(scheduleAppointment.status)) {
      return left(
        new InvalidResource('This scheduled appointment could not be canceled'),
      )
    }

    scheduleAppointment.cancel()

    this.appointmentsRepository.update(scheduleAppointment)

    return right(undefined)
  }
}
