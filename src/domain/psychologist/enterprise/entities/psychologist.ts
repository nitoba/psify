import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { CRP } from '@/domain/core/enterprise/value-objects/crp'
import { Email } from '@/domain/core/enterprise/value-objects/email'
import { Name } from '@/domain/core/enterprise/value-objects/name'
import { Phone } from '@/domain/core/enterprise/value-objects/phone'
import { Specialty } from '@/domain/core/enterprise/value-objects/specialty'
import { Time } from '@/domain/core/enterprise/value-objects/time'

type PsychologistProps = {
  name: Name
  email: Email
  phone: Phone
  crp: CRP
  specialty: Specialty[]
  availableTimes: Time[]
  createdAt: Date
}

export class Psychologist extends AggregateRoot<PsychologistProps> {
  get name(): Name {
    return this.props.name
  }

  get email(): Email {
    return this.props.email
  }

  get phone(): Phone {
    return this.props.phone
  }

  get crp(): CRP {
    return this.props.crp
  }

  get specialty(): Specialty[] {
    return this.props.specialty
  }

  get availableTimes(): Time[] {
    return this.props.availableTimes
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  static create(
    props: Optional<PsychologistProps, 'createdAt'>,
    id?: UniqueEntityID,
  ): Psychologist {
    const psychologist = new Psychologist(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return psychologist
  }
}
