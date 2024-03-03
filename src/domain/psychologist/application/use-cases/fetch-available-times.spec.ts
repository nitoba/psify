import { makeAvailableTime } from 'test/factories/psychologist/make-available-times'
import { makePsychologist } from 'test/factories/psychologist/make-psychologist'
import { InMemoryPsychologistRepository } from 'test/repositories/psychologist/in-memory-psychologist-repository'

import { left, right } from '@/core/either'
import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'

import { AvailableTimesList } from '../../enterprise/entities/available-times-list'
import { FetchAvailableTimesUseCase } from './fetch-available-times'

describe('FetchAvailableTimesUseCase', () => {
  let fetchAvailableTimesUseCase: FetchAvailableTimesUseCase
  let psychologistRepository: InMemoryPsychologistRepository

  beforeEach(() => {
    psychologistRepository = new InMemoryPsychologistRepository()
    fetchAvailableTimesUseCase = new FetchAvailableTimesUseCase(
      psychologistRepository,
    )
  })

  it('should return available times if psychologist is found', async () => {
    const psychologist = makePsychologist({
      availableTimes: new AvailableTimesList([
        makeAvailableTime(),
        makeAvailableTime(),
        makeAvailableTime(),
      ]),
    })
    psychologistRepository.create(psychologist)

    const result = await fetchAvailableTimesUseCase.execute({
      psychologistId: psychologist.id.toString(),
    })

    expect(result).toEqual(
      right({
        availableTimes: psychologist.availableTimes.getItems(),
      }),
    )
  })

  it('should return ResourceNotFound error if psychologist not found', async () => {
    const result = await fetchAvailableTimesUseCase.execute({
      psychologistId: 'invalid-id',
    })

    expect(result).toEqual(left(new ResourceNotFound('Psychologist not found')))
  })
})
