import { Either, left, right } from '@/core/either'
import { ValueObject } from '@/core/entities/value-objects'

import { InvalidResource } from '../errors/invalid-resource'

type TimeProps = {
  value: string
}

export class Time extends ValueObject<TimeProps> {
  get value(): string {
    return this.props.value
  }

  static create(time: string): Either<InvalidResource, Time> {
    if (!this.validate(time)) {
      return left(new InvalidResource('Invalid time'))
    }
    return right(new Time({ value: time }))
  }

  private static validate(time: string): boolean {
    return /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(time)
  }
}
