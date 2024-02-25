import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { User, type UserProps } from '@/domain/core/enterprise/entities/user'

type PatientProps = UserProps & {
  createdAt: Date
}

export class Patient extends User<PatientProps> {
  get createdAt(): Date {
    return this.props.createdAt
  }

  get name(): string {
    return this.props.name.getValue
  }

  get email(): string {
    return this.props.email.getValue
  }

  get phone(): string {
    return this.props.phone.getValue
  }

  get password(): string {
    return this.props.password
  }

  static create(
    {
      name,
      email,
      phone,
      password,
      createdAt,
    }: Optional<PatientProps, 'createdAt'>,
    id?: UniqueEntityID,
  ): Patient {
    const patient = new Patient(
      {
        name,
        email,
        phone,
        password,
        createdAt: createdAt ?? new Date(),
      },
      id,
    )

    return patient
  }
}
