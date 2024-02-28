import { Name } from '@/domain/core/enterprise/value-objects/name'
import { Specialty } from '@/domain/psychologist/enterprise/value-objects/specialty'
import { makePsychologist } from '@/test/factories/psychologist/make-psychologist'
import { InMemoryPsychologistRepository } from '@/test/repositories/psychologist/in-memory-psychologist-repository'

import { SpecialtyList } from '../../enterprise/entities/specialty-list'
import { FetchPsychologistsUseCase } from './fetch-psychologists'

describe('FetchPsychologistsUseCase', () => {
  let fetchPsychologistsUseCase: FetchPsychologistsUseCase
  let psychologistRepository: InMemoryPsychologistRepository

  beforeEach(() => {
    psychologistRepository = new InMemoryPsychologistRepository()
    fetchPsychologistsUseCase = new FetchPsychologistsUseCase(
      psychologistRepository,
    )
  })

  it('should return psychologists matching name filter', async () => {
    const psychologist1 = makePsychologist({
      name: Name.create('John Doe').value as Name,
    })
    const psychologist2 = makePsychologist({
      name: Name.create('Jane Doe').value as Name,
    })

    psychologistRepository.create(psychologist1)
    psychologistRepository.create(psychologist2)

    const result = await fetchPsychologistsUseCase.execute({
      name: 'John',
      page: 1,
    })

    expect(result.isRight()).toBeTruthy()

    if (result.isRight()) {
      expect(result.value.psychologists).toEqual([psychologist1])
    }
  })

  it('should return psychologists matching specialties filter', async () => {
    const psychologist1 = makePsychologist({
      specialties: new SpecialtyList([
        Specialty.create('Cognitive').value as Specialty,
      ]),
    })
    const psychologist2 = makePsychologist({
      specialties: new SpecialtyList([
        Specialty.create('Behavioral').value as Specialty,
      ]),
    })

    psychologistRepository.create(psychologist1)
    psychologistRepository.create(psychologist2)

    const result = await fetchPsychologistsUseCase.execute({
      specialties: ['Cognitive'],
      page: 1,
    })

    expect(result.isRight()).toBeTruthy()

    if (result.isRight()) {
      expect(result.value.psychologists).toEqual([psychologist1])
    }
  })

  it('should return psychologists matching name and specialties filters', async () => {
    const psychologist1 = makePsychologist({
      name: Name.create('John Doe').value as Name,
      specialties: new SpecialtyList([
        Specialty.create('Cognitive').value as Specialty,
      ]),
    })
    const psychologist2 = makePsychologist({
      name: Name.create('Jane Doe').value as Name,
      specialties: new SpecialtyList([
        Specialty.create('Behavioral').value as Specialty,
      ]),
    })

    psychologistRepository.create(psychologist1)
    psychologistRepository.create(psychologist2)

    const result = await fetchPsychologistsUseCase.execute({
      name: 'John',
      specialties: ['Behavioral'],
      page: 1,
    })

    expect(result.isRight()).toBeTruthy()

    if (result.isRight()) {
      expect(result.value.psychologists).toHaveLength(2)
    }
  })

  it('should return psychologists paginated', async () => {
    for (let i = 0; i < 12; i++) {
      const psychologist = makePsychologist()
      psychologistRepository.create(psychologist)
    }

    const result = await fetchPsychologistsUseCase.execute({
      page: 2,
    })

    expect(result.isRight()).toBeTruthy()

    if (result.isRight()) {
      expect(result.value.psychologists).toHaveLength(2)
    }
  })

  it('should return empty array if no psychologists match', async () => {
    const result = await fetchPsychologistsUseCase.execute({
      name: 'Non Existing',
      page: 1,
    })

    expect(result.isRight()).toBeTruthy()

    if (result.isRight()) {
      expect(result.value.psychologists).toEqual([])
    }
  })
})
