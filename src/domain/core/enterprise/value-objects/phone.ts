import { Either, left, right } from '@/core/either'
import { ValueObject } from '@/core/entities/value-objects'

import { InvalidResource } from '../errors/invalid-resource'

type PhoneProps = {
  value: string
}

export class Phone extends ValueObject<PhoneProps> {
  get getValue(): string {
    return this.props.value
  }

  static create(phone: string): Either<InvalidResource, Phone> {
    if (!this.validate(phone)) {
      return left(new InvalidResource('Invalid phone'))
    }
    return right(new Phone({ value: phone }))
  }

  private static validate(phone: string): boolean {
    return /^\(\d{2}\) 9\d{8}$/.test(phone)
  }
}
