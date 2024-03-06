import { Either, left, right } from '@/core/either'
import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'
import { InvalidResource } from '@/domain/core/enterprise/errors/invalid-resource'

import { PsychologistRepository } from '../repositories/psychology-repository'

type UpdateConsultationPriceUseCaseRequest = {
  psychologistId: string
  consultationPriceInCents: number
}

type UpdateConsultationPriceUseCaseResponse = Either<
  InvalidResource | ResourceNotFound,
  void
>

export class UpdateConsultationPriceUseCase {
  constructor(
    private readonly psychologistRepository: PsychologistRepository,
  ) {}

  async execute({
    consultationPriceInCents,
    psychologistId,
  }: UpdateConsultationPriceUseCaseRequest): Promise<UpdateConsultationPriceUseCaseResponse> {
    const psychologist =
      await this.psychologistRepository.findById(psychologistId)
    if (!psychologist) {
      return left(new ResourceNotFound('psychologist not found'))
    }

    const result = psychologist.updateConsultationPrice(
      consultationPriceInCents,
    )

    if (result.isLeft()) {
      return left(result.value)
    }

    await this.psychologistRepository.update(psychologist)

    return right(undefined)
  }
}
