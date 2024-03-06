import { makePsychologist } from 'test/factories/psychologist/make-psychologist'
import { InMemoryPsychologistRepository } from 'test/repositories/psychologist/in-memory-psychologist-repository'

import { left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'

import { FetchProfileUseCase } from './fetch-profile'

describe('FetchProfileUseCase', () => {
  let fetchProfileUseCase: FetchProfileUseCase
  let psychologistRepository: InMemoryPsychologistRepository

  beforeEach(() => {
    psychologistRepository = new InMemoryPsychologistRepository()
    fetchProfileUseCase = new FetchProfileUseCase(psychologistRepository)
  })

  it('should return psychologist profile if psychologist is found', async () => {
    const psychologist = makePsychologist()

    psychologistRepository.psychologists.push(psychologist)

    const result = await fetchProfileUseCase.execute({
      psychologistId: psychologist.id.toString(),
    })

    expect(result).toEqual(right({ profile: psychologist }))
  })

  it('should return ResourceNotFound error if psychologist not found', async () => {
    const result = await fetchProfileUseCase.execute({
      psychologistId: new UniqueEntityID().toString(),
    })

    expect(result).toEqual(left(new ResourceNotFound('Psychologist not found')))
  })
})
