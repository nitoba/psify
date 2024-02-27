import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'
import { InvalidResource } from '@/domain/core/enterprise/errors/invalid-resource'
import { AppointmentsRepository } from '@/domain/schedules/application/repositories/appointments-repository'

type CancelScheduledAppointmentUsecaseRequest = {
  scheduleAppointmentId: string
  psychologistId: string
}

type CancelScheduledAppointmentUsecaseResponse = Either<
  ResourceNotFound | InvalidResource,
  void
>

export class CancelScheduledAppointmentUsecase {
  constructor(
    private readonly appointmentsRepository: AppointmentsRepository,
  ) {}

  async execute({
    psychologistId,
    scheduleAppointmentId,
  }: CancelScheduledAppointmentUsecaseRequest): Promise<CancelScheduledAppointmentUsecaseResponse> {
    const scheduleAppointment =
      await this.appointmentsRepository.findByAppointmentIdAndPsychologyId({
        appointmentId: new UniqueEntityID(scheduleAppointmentId),
        psychologyId: new UniqueEntityID(psychologistId),
      })

    if (!scheduleAppointment) {
      return left(new ResourceNotFound('Scheduled Appointment not found'))
    }

    if (scheduleAppointment.status !== 'confirmed') {
      return left(
        new InvalidResource('This scheduled appointment could not be canceled'),
      )
    }

    scheduleAppointment.cancel()

    this.appointmentsRepository.update(scheduleAppointment)

    return right(undefined)
  }
}
