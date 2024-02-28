import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export type AppointmentStatuses =
  | 'pending'
  | 'scheduled'
  | 'canceled'
  | 'finished'

export type AppointmentProps = {
  psychologistId: UniqueEntityID
  patientId: UniqueEntityID
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

  get status(): AppointmentStatuses {
    return this.props.status
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  updateStatus(status: AppointmentStatuses): void {
    this.props.status = status
  }

  cancel() {
    this.props.status = 'canceled'
  }

  finish() {
    this.props.status = 'finished'
  }

  static create(
    {
      status,
      createdAt,
      ...props
    }: Optional<AppointmentProps, 'createdAt' | 'status'>,
    id?: UniqueEntityID,
  ): Appointment {
    // TODO: Add domain event to create appointment
    return new Appointment(
      {
        ...props,
        status: status ?? 'pending',
        createdAt: createdAt ?? new Date(),
      },
      id,
    )
  }
}
