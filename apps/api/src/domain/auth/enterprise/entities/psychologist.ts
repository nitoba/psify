import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { User, type UserProps } from '@/domain/core/enterprise/entities/user'
import { CRP } from '@/domain/psychologist/enterprise/value-objects/crp'

export type PsychologistProps = UserProps & {
  crp: CRP
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

  get password(): string {
    return this.props.password
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  changePassword(newPassword: string): void {
    this.props.password = newPassword
  }

  static create(
    {
      name,
      email,
      phone,
      crp,
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
        password,
        createdAt: createdAt ?? new Date(),
      },
      id,
    )

    return psychologist
  }
}
