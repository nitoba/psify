import { Either, left, right } from '@/core/either'
import { ValueObject } from '@/core/entities/value-objects'

import { InvalidResource } from '../errors/invalid-resource'

type Props = {
  value: string
}

export class Email extends ValueObject<Props> {
  static create(value: string): Either<InvalidResource, Email> {
    if (!this.validate(value)) {
      return left(new InvalidResource('Invalid email'))
    }
    return right(new Email({ value }))
  }

  private static validate(value: string): boolean {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
  }
}
