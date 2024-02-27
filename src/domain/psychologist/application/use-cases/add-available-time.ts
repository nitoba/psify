import { Either, left, right } from '@/core/either'
import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'
import { Time } from '@/domain/core/enterprise/value-objects/time'

import { AvailableTime } from '../../enterprise/entities/available-time'
import { PsychologistRepository } from '../repositories/psychology-repository'

type AddAvailableTimeUseCaseRequest = {
  psychologistId: string
  availableTimes: {
    weekday: number
    time: string
  }[]
}

type AddAvailableTimeUseCaseResponse = Either<Error, void>

export class AddAvailableTimeUseCase {
  constructor(private readonly repository: PsychologistRepository) {}

  async execute({
    psychologistId,
    availableTimes,
  }: AddAvailableTimeUseCaseRequest): Promise<AddAvailableTimeUseCaseResponse> {
    const psychologist = await this.repository.findById(psychologistId)

    if (!psychologist) {
      return left(new ResourceNotFound('Psychologist not found'))
    }

    for (const availableTime of availableTimes) {
      const timeVo = Time.create(availableTime.time)

      if (timeVo.isLeft()) {
        return left(timeVo.value)
      }

      if (availableTime.weekday < 0 || availableTime.weekday > 6) {
        return left(new ResourceNotFound('Weekday not found'))
      }
      const availableTimeToAdd = AvailableTime.create({
        time: timeVo.value,
        weekday: availableTime.weekday,
        psychologistId: psychologist.id,
      })
      psychologist.addAvailableTime(availableTimeToAdd)
    }

    await this.repository.updateAvailableTimes(
      psychologist.availableTimes,
      psychologistId,
    )

    return right(undefined)
  }
}
