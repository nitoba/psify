import { UseCaseError } from '../use-case-error'

export class ResourceNotFound extends Error implements UseCaseError {
  constructor(message: string) {
    super(message)
    this.name = 'ResourceNotFound'
  }
}
