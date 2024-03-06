import { Injectable } from '@nestjs/common'

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

@Injectable()
export class FetchPsychologistsUseCase {
  constructor(private readonly repository: PsychologistRepository) {}

  async execute({
    name,
    specialties,
    page,
  }: FetchPsychologistsUseCaseRequest): Promise<FetchPsychologistsUseCaseResponse> {
    const psychologists = await this.repository.findMany(
      {
        name,
        specialties,
      },
      { page },
    )

    return right({ psychologists })
  }
}
