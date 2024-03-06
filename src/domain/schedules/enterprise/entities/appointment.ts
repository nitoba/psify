import { Either, left, right } from '@/core/either'
import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { InvalidResource } from '@/domain/core/enterprise/errors/invalid-resource'

import { AppointmentApproved } from '../events/appointment-approved'
import { AppointmentCancelled } from '../events/appointment-cancelled'
import { AppointmentRejected } from '../events/appointment-rejected'
import { AppointmentRequested } from '../events/appointment-requested'
import { AppointmentScheduled } from '../events/appointment-scheduled'

export type AppointmentStatuses =
  | 'pending' // pending to approbation
  | 'approved' // when appointment was accepted by psychologist
  | 'scheduled' // when approved and order approved
  | 'finished' // when consultation was made
  | 'canceled' // when was approved but not paid yet
  | 'rejected' // when not approved
  | 'inactive' // when order was rejected or canceled by some motive

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

  approve(): Either<InvalidResource, void> {
    if (this.status !== 'pending') {
      return left(
        new InvalidResource('This scheduled appointment could not be approved'),
      )
    }

    this.props.status = 'approved'
    this.addDomainEvent(new AppointmentApproved(this))

    return right(undefined)
  }

  reject(): Either<InvalidResource, void> {
    if (this.status !== 'pending') {
      return left(
        new InvalidResource('This scheduled appointment could not be rejected'),
      )
    }

    this.props.status = 'rejected'
    this.addDomainEvent(new AppointmentRejected(this))

    return right(undefined)
  }

  cancel(): Either<InvalidResource, void> {
    if (
      ['canceled', 'finished', 'rejected', 'inactive'].includes(this.status)
    ) {
      return left(
        new InvalidResource('This scheduled appointment could not be canceled'),
      )
    }

    this.props.status = 'canceled'
    this.addDomainEvent(new AppointmentCancelled(this))

    return right(undefined)
  }

  schedule(): Either<InvalidResource, void> {
    if (this.status !== 'approved') {
      return left(
        new InvalidResource(
          'This scheduled appointment could not be scheduled',
        ),
      )
    }

    this.props.status = 'scheduled'

    this.addDomainEvent(new AppointmentScheduled(this))
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
