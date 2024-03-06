import { UseCaseError } from '../use-case-error'

export class ResourceNotFound implements UseCaseError {
  message: string
  constructor(message: string) {
    this.message = message
  }
}
