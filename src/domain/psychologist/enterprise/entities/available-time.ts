import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Time } from '@/domain/psychologist/enterprise/value-objects/time'

export type AvailableTimeProps = {
  weekday: number
  time: Time
  psychologistId: UniqueEntityID
}

export class AvailableTime extends Entity<AvailableTimeProps> {
  get weekday(): number {
    return this.props.weekday
  }

  get time(): Time {
    return this.props.time
  }

  changeWeekday(weekday: number) {
    this.props.weekday = weekday
  }

  changeTime(time: Time) {
    this.props.time = time
  }

  static create(props: AvailableTimeProps, id?: UniqueEntityID): AvailableTime {
    return new AvailableTime(props, id)
  }
}
