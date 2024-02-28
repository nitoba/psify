import { Either, left, right } from '@/core/either'
import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { InvalidResource } from '@/domain/core/enterprise/errors/invalid-resource'

import { AppointmentRequested } from '../events/appointment-requested'

export type AppointmentStatuses =
  | 'pending'
  | 'scheduled'
  | 'canceled'
  | 'finished'
  | 'inactive'

export type AppointmentProps = {
  psychologistId: UniqueEntityID
  patientId: UniqueEntityID
  costInCents: number
  scheduledTo: Date
  status: AppointmentStatuses
  createdAt: Date
}

export class Appointment extends AggregateRoot<AppointmentProps> {
  get psychologistId() {
    return this.props.psychologistId
  }

  get patientId() {
    return this.props.patientId
  }

  get scheduledTo(): Date {
    return this.props.scheduledTo
  }

  get costInCents(): number {
    return this.props.costInCents
  }

  get status(): AppointmentStatuses {
    return this.props.status
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  updateStatus(status: AppointmentStatuses): void {
    this.props.status = status
  }

  cancel(): Either<InvalidResource, void> {
    if (['canceled', 'finished'].includes(this.status)) {
      return left(
        new InvalidResource('This scheduled appointment could not be canceled'),
      )
    }

    this.props.status = 'canceled'

    return right(undefined)
  }

  schedule(): Either<InvalidResource, void> {
    if (this.status !== 'pending') {
      return left(
        new InvalidResource(
          'This scheduled appointment could not be scheduled',
        ),
      )
    }

    this.props.status = 'scheduled'

    // TODO: add domain event that this appointment was scheduled

    return right(undefined)
  }

  inactivate(): Either<InvalidResource, void> {
    if (this.status === 'inactive') {
      return left(
        new InvalidResource(
          'This scheduled appointment could not be inactivated',
        ),
      )
    }

    this.props.status = 'inactive'

    return right(undefined)
  }

  finish(): Either<InvalidResource, void> {
    const isInvalidStatus = ['finished', 'canceled'].includes(this.status)

    if (isInvalidStatus) {
      return left(
        new InvalidResource('This scheduled appointment could not be finished'),
      )
    }
    this.props.status = 'finished'

    // TODO: add domain event that this appointment was finished

    return right(undefined)
  }

  static create(
    {
      status,
      createdAt,
      ...props
    }: Optional<AppointmentProps, 'createdAt' | 'status'>,
    id?: UniqueEntityID,
  ): Appointment {
    const appointment = new Appointment(
      {
        ...props,
        status: status ?? 'pending',
        createdAt: createdAt ?? new Date(),
      },
      id,
    )

    const isNewAppointment = !id

    if (isNewAppointment) {
      appointment.addDomainEvent(new AppointmentRequested(appointment))
    }

    return appointment
  }
}
