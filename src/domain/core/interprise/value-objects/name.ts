import { Either, left, right } from '@/core/either'
import { ValueObject } from '@/core/entities/value-objects'

type NameProps = {
  value: string
}

export class Name extends ValueObject<NameProps> {
  static create(name: string): Either<Error, Name> {
    if (!this.validate(name)) {
      return left(new Error('Invalid name'))
    }
    return right(new Name({ value: name }))
  }

  private static validate(name: string): boolean {
    return name.length >= 3 && name.length <= 255
  }
}
