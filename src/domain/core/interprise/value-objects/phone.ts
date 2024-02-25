import { Either, left, right } from '@/core/either'
import { ValueObject } from '@/core/entities/value-objects'

import { InvalidResource } from '../errors/invalid-resource'

type PhoneProps = {
  value: string
}

export class Phone extends ValueObject<PhoneProps> {
  get value(): string {
    return this.props.value
  }

  static create(phone: string): Either<InvalidResource, Phone> {
    if (!this.validate(phone)) {
      return left(new InvalidResource('Invalid phone'))
    }
    return right(new Phone({ value: phone }))
  }

  private static validate(phone: string): boolean {
    return /^([0-9]{10,11})$/.test(phone)
  }
}
