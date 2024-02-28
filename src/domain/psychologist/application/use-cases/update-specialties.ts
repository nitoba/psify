import { Either, left, right } from '@/core/either'
import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'
import { Specialty } from '@/domain/psychologist/enterprise/value-objects/specialty'

import { PsychologistRepository } from '../repositories/psychology-repository'

type UpdateSpecialtyUseCaseRequest = {
  psychologistId: string
  specialties: string[]
}

type UpdateSpecialtyUseCaseResponse = Either<Error, void>

export class UpdateSpecialtyUseCase {
  constructor(private readonly repository: PsychologistRepository) {}

  async execute({
    psychologistId,
    specialties,
  }: UpdateSpecialtyUseCaseRequest): Promise<UpdateSpecialtyUseCaseResponse> {
    const psychologist = await this.repository.findById(psychologistId)
    if (!psychologist) {
      return left(new ResourceNotFound('Psychologist not found'))
    }

    const specialtiesVo: Specialty[] = []

    for (const specialty of specialties) {
      const specialtyVo = Specialty.create(specialty)
      if (specialtyVo.isLeft()) return left(specialtyVo.value)

      specialtiesVo.push(specialtyVo.value)
    }

    psychologist.updateSpecialties(specialtiesVo)

    await this.repository.updateSpecialties(
      psychologist.specialties,
      psychologistId,
    )

    return right(undefined)
  }
}
