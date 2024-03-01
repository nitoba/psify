import { Either, left, right } from '@/core/either'
import { ValueObject } from '@/core/entities/value-objects'

import { InvalidResource } from '../../../core/enterprise/errors/invalid-resource'

type CRPProps = {
  value: string
}

export class CRP extends ValueObject<CRPProps> {
  get value(): string {
    return this.props.value
  }

  static create(crp: string): Either<InvalidResource, CRP> {
    if (!this.validate(crp)) {
      return left(new InvalidResource('Invalid CRP'))
    }
    return right(new CRP({ value: crp }))
  }

  private static validate(crp: string): boolean {
    return crp.length === 7
  }
}
