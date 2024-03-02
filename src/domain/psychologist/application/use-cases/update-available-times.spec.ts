import { makePsychologist } from 'test/factories/psychologist/make-psychologist'
import { InMemoryPsychologistRepository } from 'test/repositories/psychologist/in-memory-psychologist-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'
import { InvalidResource } from '@/domain/core/enterprise/errors/invalid-resource'
import { Time } from '@/domain/psychologist/enterprise/value-objects/time'

import { AvailableTime } from '../../enterprise/entities/available-time'
import { AvailableTimesList } from '../../enterprise/entities/available-times-list'
import { UpdateAvailableTimesUseCase } from './update-available-times'

describe('UpdateAvailableTimesUseCase', () => {
  let useCase: UpdateAvailableTimesUseCase
  let repository: InMemoryPsychologistRepository

  beforeEach(() => {
    repository = new InMemoryPsychologistRepository()
    useCase = new UpdateAvailableTimesUseCase(repository)
  })

  it('should update available time for a psychologist', async () => {
    const psychologistId = new UniqueEntityID()
    const psychologist = makePsychologist(
      {
        availableTimes: new AvailableTimesList([
          AvailableTime.create({
            psychologistId,
            time: Time.create('08:00').value as Time,
            weekday: 1,
          }),
        ]),
      },
      psychologistId,
    )
    repository.create(psychologist)

    const availableTime = psychologist.availableTimes.getItems()[0]

    const result = await useCase.execute({
      psychologistId: psychologistId.toString(),
      availableTimeId: availableTime.id.toString(),
      weekday: 1,
      time: '09:00',
    })

    expect(result.isRight()).toBeTruthy()

    expect(repository.psychologists[0].availableTimes.getItems()[0].id).toBe(
      availableTime.id,
    )
    expect(
      repository.psychologists[0].availableTimes.getItems()[0].weekday,
    ).toBe(1)
    expect(
      repository.psychologists[0].availableTimes.getItems()[0].time.value,
    ).toBe('09:00')
  })

  it('should return left if psychologist not found', async () => {
    const result = await useCase.execute({
      psychologistId: '123',
      availableTimeId: '456',
      weekday: 1,
      time: '09:00',
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
      weekday: 1,
      time: '09:00',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceNotFound)
  })

  it('should return left if invalid weekday', async () => {
    const psychologist = makePsychologist()
    repository.create(psychologist)

    const result = await useCase.execute({
      psychologistId: psychologist.id.toString(),
      availableTimeId: '456',
      weekday: 7,
      time: '09:00',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceNotFound)
  })

  it('should return left if invalid time', async () => {
    const psychologist = makePsychologist()
    repository.create(psychologist)

    const result = await useCase.execute({
      psychologistId: psychologist.id.toString(),
      availableTimeId: '456',
      weekday: 1,
      time: 'invalid',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(InvalidResource)
  })
})
