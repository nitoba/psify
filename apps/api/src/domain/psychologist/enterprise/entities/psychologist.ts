import { Either, left, right } from '@/core/either'
import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { InvalidResource } from '@/domain/core/enterprise/errors/invalid-resource'
import { Email } from '@/domain/core/enterprise/value-objects/email'
import { Name } from '@/domain/core/enterprise/value-objects/name'
import { Phone } from '@/domain/core/enterprise/value-objects/phone'
import { CRP } from '@/domain/psychologist/enterprise/value-objects/crp'
import { Appointment } from '@/domain/schedules/enterprise/entities/appointment'

import { AvailableTime } from './available-time'
import { AvailableTimesList } from './available-times-list'
import { SpecialtyList } from './specialty-list'

export type PsychologistProps = {
  name: Name
  email: Email
  phone: Phone
  crp: CRP
  bio?: string | null,
  avatarUrl?: string | null,
  specialties: SpecialtyList
  consultationPriceInCents: number
  availableTimes: AvailableTimesList
  scheduledAppointments: Appointment[]
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

  get specialties(): SpecialtyList {
    return this.props.specialties
  }

  get bio() {
    return this.props.bio
  }

  get avatarUrl() {
    return this.props.avatarUrl
  }

  get availableTimes(): AvailableTimesList {
    return this.props.availableTimes
  }

  get scheduledAppointments() {
    return this.props.scheduledAppointments
  }

  get consultationPriceInCents(): number {
    return this.props.consultationPriceInCents
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  set scheduledAppointments(appointments: Appointment[]) {
    this.props.scheduledAppointments = appointments
  }

  updateAvailableTimes(availableTimes: AvailableTime[]): void {
    this.props.availableTimes.update(availableTimes)
  }

  updateConsultationPrice(price: number): Either<InvalidResource, void> {
    if (price <= 0) {
      return left(
        new InvalidResource('consultation price must be positive number'),
      )
    }

    this.props.consultationPriceInCents = price

    return right(undefined)
  }

  addAvailableTime(availableTime: AvailableTime): void {
    this.props.availableTimes.add(availableTime)
  }

  removeAvailableTime(availableTime: AvailableTime): void {
    this.props.availableTimes.remove(availableTime)
  }

  getAvailableTimes() {
    return this.props.availableTimes.getItems()
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
