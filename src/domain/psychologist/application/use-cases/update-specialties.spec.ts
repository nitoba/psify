import { makePsychologist } from 'test/factories/psychologist/make-psychologist'
import { InMemoryPsychologistRepository } from 'test/repositories/psychologist/in-memory-psychologist-repository'

import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'

import { SpecialtyList } from '../../enterprise/entities/specialty-list'
import { Specialty } from '../../enterprise/value-objects/specialty'
import { UpdateSpecialtyUseCase } from './update-specialties'

describe('UpdateSpecialtyUseCase', () => {
  let useCase: UpdateSpecialtyUseCase
  let repository: InMemoryPsychologistRepository

  beforeEach(() => {
    repository = new InMemoryPsychologistRepository()
    useCase = new UpdateSpecialtyUseCase(repository)
  })

  it('should add new specialties to a psychologist', async () => {
    const specialtiesToAdd = ['specialty1', 'specialty2']

    const psychologist = makePsychologist()

    repository.create(psychologist)

    const result = await useCase.execute({
      psychologistId: psychologist.id.toString(),
      adds: specialtiesToAdd,
    })
    expect(result.isRight()).toBeTruthy()
    expect(repository.psychologists[0].specialties.getItems()).toHaveLength(2)
    expect(repository.psychologists[0].specialties.getItems()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          value: specialtiesToAdd[0],
        }),
        expect.objectContaining({
          value: specialtiesToAdd[1],
        }),
      ]),
    )
  })

  it('should remove specialties to a psychologist', async () => {
    const psychologist = makePsychologist({
      specialties: new SpecialtyList(
        ['specialty1', 'specialty2', 'specialty3'].map(
          (item) => Specialty.create(item).value as Specialty,
        ),
      ),
    })

    repository.create(psychologist)

    const result = await useCase.execute({
      psychologistId: psychologist.id.toString(),
      removes: ['specialty1', 'specialty3'],
    })
    expect(result.isRight()).toBeTruthy()
    expect(repository.psychologists[0].specialties.getItems()).toHaveLength(1)
    expect(repository.psychologists[0].specialties.getItems()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          value: 'specialty2',
        }),
      ]),
    )
  })

  it('should return right if nothing to update', async () => {
    const psychologist = makePsychologist({
      specialties: new SpecialtyList(
        ['specialty1', 'specialty2', 'specialty3'].map(
          (item) => Specialty.create(item).value as Specialty,
        ),
      ),
    })

    repository.create(psychologist)

    const result = await useCase.execute({
      psychologistId: psychologist.id.toString(),
    })
    expect(result.isRight()).toBeTruthy()
    expect(repository.psychologists[0].specialties.getItems()).toHaveLength(3)
  })

  it('should return left if psychologist not found', async () => {
    const psychologistId = '123'

    const result = await useCase.execute({
      psychologistId,
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceNotFound)
  })
})
