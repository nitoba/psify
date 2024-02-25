import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { User, type UserProps } from '@/domain/core/enterprise/entities/user'
import { CRP } from '@/domain/core/enterprise/value-objects/crp'
import { Specialty } from '@/domain/core/enterprise/value-objects/specialty'

export type PsychologistProps = UserProps & {
  crp: CRP
  specialty: Specialty
  createdAt: Date
}

export class Psychologist extends User<PsychologistProps> {
  get name(): string {
    return this.props.name.getValue
  }

  get email(): string {
    return this.props.email.getValue
  }

  get phone(): string {
    return this.props.phone.getValue
  }

  get crp(): CRP {
    return this.props.crp
  }

  get specialty(): string {
    return this.props.specialty.value
  }

  get password(): string {
    return this.props.password
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  static create(
    {
      name,
      email,
      phone,
      crp,
      specialty,
      password,
      createdAt,
    }: Optional<PsychologistProps, 'createdAt'>,
    id?: UniqueEntityID,
  ): Psychologist {
    const psychologist = new Psychologist(
      {
        name,
        email,
        phone,
        crp,
        specialty,
        password,
        createdAt: createdAt ?? new Date(),
      },
      id,
    )

    return psychologist
  }
}
