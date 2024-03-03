import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'

import { PsychologistRepository } from '../../../psychologist/application/repositories/psychology-repository'
import { AvailableTimeToSchedule } from '../../enterprise/entities/available-time-to-schedules'

type FetchTimesAvailableToSchedulesUseCaseRequest = {
  psychologistId: string
}

type FetchTimesAvailableToSchedulesUseCaseResponse = Either<
  ResourceNotFound,
  {
    availableTimesToSchedules: AvailableTimeToSchedule[]
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

    const availableTimesToSchedules =
      psychologist.getAvailableTimesToSchedules()

    return right({
      availableTimesToSchedules,
    })
  }
}
