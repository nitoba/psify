import { DomainError } from '@/core/errors/domain-error'

export class InvalidEmailError extends Error implements DomainError {
  constructor() {
    super('Invalid email')
    this.name = 'InvalidEmailError'
  }
}
