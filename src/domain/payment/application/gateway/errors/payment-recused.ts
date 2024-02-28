import { DomainError } from '@/core/errors/domain-error'

export class PaymentRecused extends Error implements DomainError {
  constructor(message?: string) {
    super(message ?? 'Payment recused')
    this.name = 'PaymentRecused'
  }
}
