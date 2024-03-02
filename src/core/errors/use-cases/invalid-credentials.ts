import { UseCaseError } from '../use-case-error'

export class InvalidCredentials implements UseCaseError {
  message: string
  constructor() {
    this.message = 'Invalid credentials'
  }
}
