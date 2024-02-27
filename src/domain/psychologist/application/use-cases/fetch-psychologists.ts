import { Either, right } from '@/core/either'
import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'

import { Psychologist } from '../../enterprise/entities/psychologist'
import { PsychologistRepository } from '../repositories/psychology-repository'

type FetchPsychologistsUseCaseRequest = {
  name?: string
  specialties?: string[]
  page: number
}

type FetchPsychologistsUseCaseResponse = Either<
  ResourceNotFound,
  {
    psychologists: Psychologist[]
  }
>

export class FetchPsychologistsUseCase {
  constructor(private readonly repository: PsychologistRepository) {}

  async execute({
    name,
    specialties,
    page,
  }: FetchPsychologistsUseCaseRequest): Promise<FetchPsychologistsUseCaseResponse> {
    const filter = {
      name,
      specialties,
    }

    const psychologists = await this.repository.findMany(filter, { page })

    return right({ psychologists })
  }
}
