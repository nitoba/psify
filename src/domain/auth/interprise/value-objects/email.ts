import { Either, left, right } from '@/core/either'
import { ValueObject } from '@/core/entities/value-objects'

import { InvalidEmailError } from '../errors/invalid-email'

type Props = {
  value: string
}

export class Email extends ValueObject<Props> {
  static create(value: string): Either<Error, Email> {
    if (!this.validate(value)) {
      return left(new InvalidEmailError())
    }
    return right(new Email({ value }))
  }

  static validate(value: string): boolean {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
  }
}
