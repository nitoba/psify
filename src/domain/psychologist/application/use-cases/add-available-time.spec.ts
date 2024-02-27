import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'
import { makePsychologist } from '@/test/factories/psychologist/make-psychologist'
import { InMemoryPsychologistRepository } from '@/test/repositories/psychologist/in-memory-psychologist-repository'

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
      weekday: 1,
      time: '09:00',
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

  it('should return left if psychologist not found', async () => {
    const result = await useCase.execute({
      psychologistId: '123',
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
      weekday: 1,
      time: 'invalid',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(Error)
  })
})
