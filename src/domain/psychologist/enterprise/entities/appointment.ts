import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export type AppointmentStatuses = 'confirmed' | 'canceled' | 'finished'

export type AppointmentProps = {
  psychologistId: UniqueEntityID
  patientId: UniqueEntityID
  scheduledTo: Date
  status: AppointmentStatuses
  createdAt: Date
}

export class Appointment extends Entity<AppointmentProps> {
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

  static create(
    {
      status,
      createdAt,
      ...props
    }: Optional<AppointmentProps, 'createdAt' | 'status'>,
    id?: UniqueEntityID,
  ): Appointment {
    return new Appointment(
      {
        ...props,
        status: status ?? 'confirmed',
        createdAt: createdAt ?? new Date(),
      },
      id,
    )
  }
}
