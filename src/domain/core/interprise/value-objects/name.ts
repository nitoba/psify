import { Either, left, right } from '@/core/either'
import { ValueObject } from '@/core/entities/value-objects'

import { InvalidResource } from '../errors/invalid-resource'

type NameProps = {
  value: string
}

export class Name extends ValueObject<NameProps> {
  static create(name: string): Either<InvalidResource, Name> {
    if (!this.validate(name)) {
      return left(new InvalidResource('Invalid name'))
    }
    return right(new Name({ value: name }))
  }

  private static validate(name: string): boolean {
    return name.length >= 3 && name.length <= 255
  }
}
