import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { Email } from '@/domain/core/enterprise/value-objects/email'
import { Name } from '@/domain/core/enterprise/value-objects/name'
import { Phone } from '@/domain/core/enterprise/value-objects/phone'
import { CRP } from '@/domain/psychologist/enterprise/value-objects/crp'
import { Specialty } from '@/domain/psychologist/enterprise/value-objects/specialty'
import { Appointment } from '@/domain/schedules/enterprise/entities/appointment'

import { AvailableTime } from './available-time'
import { AvailableTimesList } from './available-times-list'
import { SpecialtyList } from './specialty-list'

export type PsychologistProps = {
  name: Name
  email: Email
  phone: Phone
  crp: CRP
  specialties: SpecialtyList
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

  get availableTimes(): AvailableTimesList {
    return this.props.availableTimes
  }

  get scheduleAppointments() {
    return this.props.scheduledAppointments
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  updateSpecialties(specialties: Specialty[]): void {
    this.props.specialties.update(specialties)
  }

  updateAvailableTimes(availableTimes: AvailableTime[]): void {
    this.props.availableTimes.update(availableTimes)
  }

  addAvailableTime(availableTime: AvailableTime): void {
    this.props.availableTimes.add(availableTime)
  }

  removeAvailableTime(availableTime: AvailableTime): void {
    this.props.availableTimes.remove(availableTime)
  }

  getAvailableTimesToSchedules(): AvailableTime[] {
    const currentAvailableTimes = this.availableTimes.getItems()
    const scheduleAppointments = this.scheduleAppointments

    // filter availableTimes to response only times more than current date now
    const availableTimes = currentAvailableTimes.filter((at) => {
      const [hourFromTime, minutesFromTime] = at.time.getHoursAndMinutes()

      const dateToCompare = new Date()
      dateToCompare.setHours(hourFromTime, minutesFromTime)

      const isTimeNotScheduled = scheduleAppointments.every((sp) => {
        return sp.scheduledTo.getTime() !== dateToCompare.getTime()
      })

      return Date.now() <= dateToCompare.getTime() && isTimeNotScheduled
    })

    return availableTimes
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
