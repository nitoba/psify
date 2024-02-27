import { Either, left, right } from '@/core/either'
import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'
import { InvalidResource } from '@/domain/core/enterprise/errors/invalid-resource'

import { PsychologistRepository } from '../repositories/psychology-repository'

type RemoveAvailableTimeUseCaseRequest = {
  psychologistId: string
  availableTimeId: string
}

type RemoveAvailableTimeUseCaseResponse = Either<
  ResourceNotFound | InvalidResource,
  void
>

export class RemoveAvailableTimeUseCase {
  constructor(private readonly repository: PsychologistRepository) {}

  async execute({
    availableTimeId,
    psychologistId,
  }: RemoveAvailableTimeUseCaseRequest): Promise<RemoveAvailableTimeUseCaseResponse> {
    const psychologist = await this.repository.findById(psychologistId)

    if (!psychologist) {
      return left(new ResourceNotFound('Psychologist not found'))
    }

    const availableTimeExists = psychologist.availableTimes
      .getItems()
      .find((availableTime) => availableTime.id.toString() === availableTimeId)

    if (!availableTimeExists) {
      return left(new ResourceNotFound('Available time not found'))
    }

    psychologist.removeAvailableTime(availableTimeExists)

    await this.repository.updateAvailableTimes(
      psychologist.availableTimes,
      psychologistId,
    )

    return right(undefined)
  }
}
