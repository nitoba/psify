import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'
import { InvalidResource } from '@/domain/core/enterprise/errors/invalid-resource'
import { Specialty } from '@/domain/psychologist/enterprise/value-objects/specialty'

import { PsychologistRepository } from '../repositories/psychology-repository'

type UpdateSpecialtyUseCaseRequest = {
  psychologistId: string
  adds?: string[]
  removes?: string[]
}

type UpdateSpecialtyUseCaseResponse = Either<InvalidResource, void>

@Injectable()
export class UpdateSpecialtyUseCase {
  constructor(private readonly repository: PsychologistRepository) {}

  async execute({
    psychologistId,
    adds = [],
    removes = [],
  }: UpdateSpecialtyUseCaseRequest): Promise<UpdateSpecialtyUseCaseResponse> {
    const psychologist = await this.repository.findById(psychologistId)
    if (!psychologist) {
      return left(new ResourceNotFound('Psychologist not found'))
    }

    if (!adds || !removes) {
      return right(undefined)
    }

    for (const specialty of adds) {
      const specialtyVo = Specialty.create(specialty)
      if (specialtyVo.isLeft()) return left(specialtyVo.value)
      if (psychologist.specialties.exists(specialtyVo.value)) continue
      psychologist.specialties.add(specialtyVo.value)
    }

    for (const specialty of removes) {
      const specialtyVo = Specialty.create(specialty)
      if (specialtyVo.isLeft()) return left(specialtyVo.value)
      if (!psychologist.specialties.exists(specialtyVo.value)) continue
      psychologist.specialties.remove(specialtyVo.value)
    }

    await this.repository.updateSpecialties(
      psychologist.specialties,
      psychologistId,
    )

    return right(undefined)
  }
}
