import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'
import { Time } from '@/domain/core/enterprise/value-objects/time'
import { makePsychologist } from '@/test/factories/psychologist/make-psychologist'
import { InMemoryPsychologistRepository } from '@/test/repositories/psychologist/in-memory-psychologist-repository'

import { AvailableTime } from '../../enterprise/entities/available-time'
import { AvailableTimesList } from '../../enterprise/entities/available-times-list'
import { RemoveAvailableTimeUseCase } from './remove-available-time'

describe('RemoveAvailableTimeUseCase', () => {
  let useCase: RemoveAvailableTimeUseCase
  let repository: InMemoryPsychologistRepository

  beforeEach(() => {
    repository = new InMemoryPsychologistRepository()
    useCase = new RemoveAvailableTimeUseCase(repository)
  })

  it('should remove available time from psychologist', async () => {
    const psychologistId = new UniqueEntityID()
    const psychologist = makePsychologist(
      {
        availableTimes: new AvailableTimesList([
          AvailableTime.create({
            weekday: 1,
            time: Time.create('09:00').value as Time,
            psychologistId,
          }),
        ]),
      },
      psychologistId,
    )

    repository.create(psychologist)

    const result = await useCase.execute({
      psychologistId: psychologist.id.toString(),
      availableTimeId: psychologist.availableTimes.getItems()[0].id.toString(),
    })

    expect(result.isRight()).toBeTruthy()
    expect(repository.psychologists[0].availableTimes.getItems()).toHaveLength(
      0,
    )
  })

  it('should return left if psychologist not found', async () => {
    const result = await useCase.execute({
      psychologistId: '123',
      availableTimeId: '456',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceNotFound)
  })

  it('should return left if available time not found', async () => {
    const psychologist = makePsychologist()

    repository.create(psychologist)

    const result = await useCase.execute({
      psychologistId: psychologist.id.toString(),
      availableTimeId: '456',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceNotFound)
  })
})
