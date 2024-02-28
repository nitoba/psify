import { Either, left, right } from '@/core/either'
import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'
import { Time } from '@/domain/psychologist/enterprise/value-objects/time'

import { AvailableTime } from '../../enterprise/entities/available-time'
import { PsychologistRepository } from '../repositories/psychology-repository'

type UpdateAvailableTimesUseCaseRequest = {
  psychologistId: string
  availableTimeId: string
  weekday: number
  time: string
}

export type UpdateAvailableTimesUseCaseResponse = Either<ResourceNotFound, void>

export class UpdateAvailableTimesUseCase {
  constructor(private repository: PsychologistRepository) {}

  async execute({
    psychologistId,
    availableTimeId,
    time,
    weekday,
  }: UpdateAvailableTimesUseCaseRequest): Promise<UpdateAvailableTimesUseCaseResponse> {
    const psychologist = await this.repository.findById(psychologistId)

    if (!psychologist) {
      return left(new ResourceNotFound('Psychologist not found'))
    }

    const timeVo = Time.create(time)

    if (timeVo.isLeft()) {
      return left(timeVo.value)
    }

    if (weekday < 0 || weekday > 6) {
      return left(new ResourceNotFound('Weekday not found'))
    }

    const availableTime = psychologist.availableTimes
      .getItems()
      .find((availableTime) => availableTime.id.toString() === availableTimeId)

    if (!availableTime) {
      return left(new ResourceNotFound('Available time not found'))
    }

    const updatedAvailableTime = AvailableTime.create(
      {
        psychologistId: psychologist.id,
        time: timeVo.value,
        weekday,
      },
      availableTime.id,
    )
    psychologist.updateAvailableTimes([updatedAvailableTime])

    await this.repository.updateAvailableTimes(
      psychologist.availableTimes,
      psychologistId,
    )

    return right(undefined)
  }
}
