import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'
import { Specialty } from '@/domain/core/enterprise/value-objects/specialty'
import { makePsychologist } from '@/test/factories/psychologist/make-psychologist'
import { InMemoryPsychologistRepository } from '@/test/repositories/psychologist/in-memory-psychologist-repository'

import { SpecialtyList } from '../../enterprise/entities/specialty-list'
import { UpdateSpecialtyUseCase } from './update-specialties'

describe('UpdateSpecialtyUseCase', () => {
  let useCase: UpdateSpecialtyUseCase
  let repository: InMemoryPsychologistRepository

  beforeEach(() => {
    repository = new InMemoryPsychologistRepository()
    useCase = new UpdateSpecialtyUseCase(repository)
  })

  it('should add new specialties to a psychologist', async () => {
    const specialties = ['specialty1', 'specialty2']

    const psychologist = makePsychologist()

    repository.create(psychologist)

    const result = await useCase.execute({
      psychologistId: psychologist.id.toString(),
      specialties,
    })
    expect(result.isRight()).toBeTruthy()
    expect(repository.psychologists[0].specialties.getItems()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          value: specialties[0],
        }),
        expect.objectContaining({
          value: specialties[1],
        }),
      ]),
    )
  })

  it.only('should update new specialties to a psychologist', async () => {
    const specialties = ['specialty1', 'specialty2']

    const psychologist = makePsychologist({
      specialties: new SpecialtyList([
        Specialty.create('specialty3').value as Specialty,
      ]),
    })

    repository.create(psychologist)

    const result = await useCase.execute({
      psychologistId: psychologist.id.toString(),
      specialties,
    })

    expect(result.isRight()).toBeTruthy()
    expect(repository.psychologists[0].specialties.getNewItems()).toHaveLength(
      2,
    )
  })

  it('should not add duplicate specialties', async () => {
    const existingSpecialty = 'specialty1'
    const newSpecialty = 'specialty2'

    const psychologist = makePsychologist({
      specialties: new SpecialtyList([
        Specialty.create(existingSpecialty).value as Specialty,
      ]),
    })

    repository.create(psychologist)

    const result = await useCase.execute({
      psychologistId: psychologist.id.toString(),
      specialties: [existingSpecialty, newSpecialty],
    })
    expect(result.isRight()).toBeTruthy()
    expect(repository.psychologists[0].specialties.getItems()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          value: existingSpecialty,
        }),
        expect.objectContaining({
          value: newSpecialty,
        }),
      ]),
    )
  })

  it('should return left if psychologist not found', async () => {
    const psychologistId = '123'
    const specialties = ['specialty1']

    const result = await useCase.execute({
      psychologistId,
      specialties,
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceNotFound)
  })
})
