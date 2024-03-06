import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'
import { InvalidResource } from '@/domain/core/enterprise/errors/invalid-resource'
import { Time } from '@/domain/psychologist/enterprise/value-objects/time'

import { AvailableTime } from '../../enterprise/entities/available-time'
import { PsychologistRepository } from '../repositories/psychology-repository'

type AddAvailableTimeUseCaseRequest = {
  psychologistId: string
  availableTimes: {
    weekday: number
    time: string
  }[]
}

type AddAvailableTimeUseCaseResponse = Either<
  ResourceNotFound | InvalidResource,
  void
>

@Injectable()
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

      // Verify if already exists an available time with the same time and weekday
      const availableTimeExists = psychologist.availableTimes
        .getItems()
        .find(
          (at) =>
            at.time.equals(timeVo.value) &&
            at.weekday === availableTime.weekday,
        )

      if (availableTimeExists) {
        return left(new InvalidResource('Available time already exists'))
      }

      const available = AvailableTime.hasHalfHourDifference(
        availableTimes,
        availableTime.weekday,
      )

      if (!available) {
        return left(
          new InvalidResource(
            'Available time in the same day must be have a 30 minutes of the difference',
          ),
        )
      }

      // Is Available to Add if to the same day there are difference of the 30 minutes between times
      const isAvailableToAdd =
        psychologist.availableTimes.hasHalfHourDifference(
          availableTime.weekday,
          availableTime.time,
        )

      if (!isAvailableToAdd) {
        return left(
          new InvalidResource(
            'Available time in the same day must be have a 30 minutes of the difference',
          ),
        )
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
