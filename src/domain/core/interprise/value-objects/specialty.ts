import { Either, left, right } from '@/core/either'
import { ValueObject } from '@/core/entities/value-objects'

import { InvalidResource } from '../errors/invalid-resource'

type SpecialtyProps = {
  value: string
}

export class Specialty extends ValueObject<SpecialtyProps> {
  get value(): string {
    return this.props.value
  }

  static create(specialty: string): Either<InvalidResource, Specialty> {
    if (!this.validate(specialty)) {
      return left(new InvalidResource('Invalid specialty'))
    }
    return right(new Specialty({ value: specialty }))
  }

  private static validate(specialty: string): boolean {
    return specialty.length <= 255
  }
}
