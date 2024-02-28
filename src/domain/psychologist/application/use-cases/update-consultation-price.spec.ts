import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'
import { InvalidResource } from '@/domain/core/enterprise/errors/invalid-resource'
import { makePsychologist } from '@/test/factories/psychologist/make-psychologist'
import { InMemoryPsychologistRepository } from '@/test/repositories/psychologist/in-memory-psychologist-repository'

import { UpdateConsultationPriceUseCase } from './update-consultation-price'

describe('UpdateConsultationPriceUseCase', () => {
  let useCase: UpdateConsultationPriceUseCase
  let repository: InMemoryPsychologistRepository

  beforeEach(() => {
    repository = new InMemoryPsychologistRepository()
    useCase = new UpdateConsultationPriceUseCase(repository)
  })

  it('should update consultation price for existing psychologist', async () => {
    // arrange
    const psychologist = makePsychologist()
    repository.create(psychologist)

    // act
    const result = await useCase.execute({
      psychologistId: psychologist.id.toString(),
      consultationPriceInCents: 5000,
    })

    // assert
    expect(result.isRight()).toBeTruthy()
    expect(repository.psychologists[0].consultationPriceInCents).toBe(5000)
  })

  it('should return ResourceNotFound error if psychologist not found', async () => {
    // arrange
    const psychologistId = new UniqueEntityID().toString()

    // act
    const result = await useCase.execute({
      psychologistId,
      consultationPriceInCents: 5000,
    })

    // assert
    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceNotFound)
  })

  it('should return InvalidResource error if invalid price', async () => {
    // arrange
    const psychologist = makePsychologist()
    repository.create(psychologist)
    const consultationPriceInCents = -100
    // act
    const result = await useCase.execute({
      psychologistId: psychologist.id.toString(),
      consultationPriceInCents,
    })

    // assert
    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(InvalidResource)
  })
})
