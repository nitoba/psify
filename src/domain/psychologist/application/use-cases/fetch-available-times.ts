import { Either, left, right } from '@/core/either'
import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'

import { AvailableTime } from '../../enterprise/entities/available-time'
import { PsychologistRepository } from '../repositories/psychology-repository'

type FetchAvailableTimesUseCaseRequest = {
  psychologistId: string
}

type FetchAvailableTimesUseCaseResponse = Either<
  ResourceNotFound,
  {
    availableTimes: AvailableTime[]
  }
>

export class FetchAvailableTimesUseCase {
  constructor(
    private readonly psychologistRepository: PsychologistRepository,
  ) {}

  async execute({
    psychologistId,
  }: FetchAvailableTimesUseCaseRequest): Promise<FetchAvailableTimesUseCaseResponse> {
    const psychologist =
      await this.psychologistRepository.findById(psychologistId)

    if (!psychologist) {
      return left(new ResourceNotFound('Psychologist not found'))
    }

    const availableTimes = psychologist.getAvailableTimesToSchedules()

    return right({
      availableTimes,
    })
  }
}
