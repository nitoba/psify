import { makePsychologist } from 'test/factories/psychologist/make-psychologist'
import { InMemoryPsychologistRepository } from 'test/repositories/psychologist/in-memory-psychologist-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'
import { InvalidResource } from '@/domain/core/enterprise/errors/invalid-resource'
import { Time } from '@/domain/psychologist/enterprise/value-objects/time'

import { AvailableTime } from '../../enterprise/entities/available-time'
import { AvailableTimesList } from '../../enterprise/entities/available-times-list'
import { AddAvailableTimeUseCase } from './add-available-time'

describe('AddAvailableTimeUseCase', () => {
  let useCase: AddAvailableTimeUseCase
  let repository: InMemoryPsychologistRepository

  beforeEach(() => {
    repository = new InMemoryPsychologistRepository()
    useCase = new AddAvailableTimeUseCase(repository)
  })

  it('should add available time for existing psychologist', async () => {
    const psychologist = makePsychologist()

    repository.create(psychologist)

    const result = await useCase.execute({
      psychologistId: psychologist.id.toString(),
      availableTimes: [{ weekday: 1, time: '09:00' }],
    })

    expect(result.isRight()).toBeTruthy()
    expect(repository.psychologists).toHaveLength(1)
    expect(repository.psychologists[0].availableTimes.getItems()).toHaveLength(
      1,
    )
    expect(
      repository.psychologists[0].availableTimes.getItems()[0].time.value,
    ).toBe('09:00')
    expect(
      repository.psychologists[0].availableTimes.getItems()[0].weekday,
    ).toBe(1)
  })

  it('should not be able add available time for existing psychologist if exists one', async () => {
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
      availableTimes: [{ weekday: 1, time: '09:00' }],
    })

    expect(result.isLeft()).toBeTruthy()
    expect(repository.psychologists[0].availableTimes.getItems()).toHaveLength(
      1,
    )
    expect(
      repository.psychologists[0].availableTimes.getItems()[0].time.value,
    ).toBe('09:00')
    expect(
      repository.psychologists[0].availableTimes.getItems()[0].weekday,
    ).toBe(1)
  })

  it('should return left if psychologist not found', async () => {
    const result = await useCase.execute({
      psychologistId: '123',
      availableTimes: [{ weekday: 1, time: '09:00' }],
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceNotFound)
  })

  it('should return left if invalid weekday', async () => {
    const psychologist = makePsychologist()

    repository.create(psychologist)

    const result = await useCase.execute({
      psychologistId: psychologist.id.toString(),
      availableTimes: [{ weekday: 8, time: '09:00' }],
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceNotFound)
  })

  it('should return left if invalid time', async () => {
    const psychologist = makePsychologist()

    repository.create(psychologist)

    const result = await useCase.execute({
      psychologistId: psychologist.id.toString(),
      availableTimes: [{ weekday: 1, time: 'invalid' }],
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(InvalidResource)
  })

  it('should not be able to add time without a 30 minutes of the diff to the same day', async () => {
    const id = new UniqueEntityID()
    const psychologist = makePsychologist(
      {
        availableTimes: new AvailableTimesList([
          AvailableTime.create({
            time: Time.create('09:00').value as Time,
            weekday: 1,
            psychologistId: id,
          }),
        ]),
      },
      id,
    )

    repository.create(psychologist)

    const result = await useCase.execute({
      psychologistId: psychologist.id.toString(),
      availableTimes: [{ weekday: 1, time: '09:00' }],
    })

    expect(result.isLeft()).toBeTruthy()
  })

  it('should be able to add time with a 30 minutes of the diff to the same day', async () => {
    const id = new UniqueEntityID()
    const psychologist = makePsychologist(
      {
        availableTimes: new AvailableTimesList([
          AvailableTime.create({
            time: Time.create('09:00').value as Time,
            weekday: 1,
            psychologistId: id,
          }),
        ]),
      },
      id,
    )

    repository.create(psychologist)

    const result = await useCase.execute({
      psychologistId: psychologist.id.toString(),
      availableTimes: [{ weekday: 1, time: '09:30' }],
    })

    expect(result.isRight()).toBeTruthy()
  })
})
