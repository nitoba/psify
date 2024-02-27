import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { Email } from '@/domain/core/enterprise/value-objects/email'
import { Name } from '@/domain/core/enterprise/value-objects/name'
import { Phone } from '@/domain/core/enterprise/value-objects/phone'
import { Appointment } from '@/domain/schedules/enterprise/entities/appointment'

export type PatientProps = {
  name: Name
  email: Email
  phone: Phone
  scheduledAppointments: Appointment[]
  createdAt: Date
}

export class Patient extends Entity<PatientProps> {
  static create(
    { createdAt, ...props }: Optional<PatientProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    return new Patient(
      {
        ...props,
        createdAt: createdAt ?? new Date(),
      },
      id,
    )
  }
}
