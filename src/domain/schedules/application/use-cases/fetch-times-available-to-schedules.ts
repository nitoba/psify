import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'

import { PsychologistRepository } from '../../../psychologist/application/repositories/psychology-repository'
import { AvailableTime } from '../../../psychologist/enterprise/entities/available-time'

type FetchTimesAvailableToSchedulesUseCaseRequest = {
  psychologistId: string
}

type FetchTimesAvailableToSchedulesUseCaseResponse = Either<
  ResourceNotFound,
  {
    availableTimes: AvailableTime[]
  }
>

@Injectable()
export class FetchTimesAvailableToSchedulesUseCase {
  constructor(
    private readonly psychologistRepository: PsychologistRepository,
  ) {}

  async execute({
    psychologistId,
  }: FetchTimesAvailableToSchedulesUseCaseRequest): Promise<FetchTimesAvailableToSchedulesUseCaseResponse> {
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
