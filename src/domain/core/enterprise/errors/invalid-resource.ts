import { DomainError } from '@/core/errors/domain-error'

export class InvalidResource implements DomainError {
  message: string
  constructor(message: string) {
    this.message = message
  }
}
