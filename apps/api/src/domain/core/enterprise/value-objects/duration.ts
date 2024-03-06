import { Either, left, right } from '@/core/either'
import { ValueObject } from '@/core/entities/value-objects'

import { InvalidResource } from '../errors/invalid-resource'

type DurationProps = {
  value: number
}

// Duration in minutes
export class Duration extends ValueObject<DurationProps> {
  get value(): number {
    return this.props.value
  }

  static create(duration: number): Either<InvalidResource, Duration> {
    if (!this.validate(duration)) {
      return left(new InvalidResource('Invalid duration'))
    }
    return right(new Duration({ value: duration }))
  }

  private static validate(duration: number): boolean {
    return Number.isInteger(duration)
  }
}
