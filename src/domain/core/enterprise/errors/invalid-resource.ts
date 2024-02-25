import { DomainError } from '@/core/errors/domain-error'

export class InvalidResource extends Error implements DomainError {
  constructor(message: string) {
    super(message)
    this.name = 'InvalidResource'
  }
}
