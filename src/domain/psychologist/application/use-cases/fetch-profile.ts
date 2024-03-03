import { Either, left, right } from '@/core/either'
import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'

import { Psychologist } from '../../enterprise/entities/psychologist'
import { PsychologistRepository } from '../repositories/psychology-repository'

type FetchProfileUseCaseRequest = {
  psychologistId: string
}
type FetchProfileUseCaseResponse = Either<
  ResourceNotFound,
  { profile: Psychologist }
>

export class FetchProfileUseCase {
  constructor(
    private readonly psychologistRepository: PsychologistRepository,
  ) {}

  async execute({
    psychologistId,
  }: FetchProfileUseCaseRequest): Promise<FetchProfileUseCaseResponse> {
    const psychologist =
      await this.psychologistRepository.findById(psychologistId)
    if (!psychologist) {
      return left(new ResourceNotFound('Psychologist not found'))
    }

    return right({ profile: psychologist })
  }
}
