import { Either, left, right } from '@/core/either'
import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'
import { Time } from '@/domain/core/enterprise/value-objects/time'

import { AvailableTime } from '../../enterprise/entities/available-time'
import { PsychologistRepository } from '../repositories/psychology-repository'

type AddAvailableTimeUseCaseRequest = {
  psychologistId: string
  weekday: number
  time: string
}

type AddAvailableTimeUseCaseResponse = Either<Error, void>

export class AddAvailableTimeUseCase {
  constructor(private readonly repository: PsychologistRepository) {}

  async execute({
    psychologistId,
    time,
    weekday,
  }: AddAvailableTimeUseCaseRequest): Promise<AddAvailableTimeUseCaseResponse> {
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

    const availableTime = AvailableTime.create({
      time: timeVo.value,
      weekday,
      psychologistId: psychologist.id,
    })

    psychologist.addAvailableTime(availableTime)

    await this.repository.updateAvailableTimes(
      psychologist.availableTimes,
      psychologistId,
    )

    return right(undefined)
  }
}
