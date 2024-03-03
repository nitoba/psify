import { Either, left, right } from '@/core/either'
import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'

import { Patient } from '../../enterprise/entities/patient'
import { PatientRepository } from '../repositories/patient-repository'

type FetchProfileUseCaseRequest = {
  patientId: string
}
type FetchProfileUseCaseResponse = Either<
  ResourceNotFound,
  { profile: Patient }
>

export class FetchProfileUseCase {
  constructor(private readonly patientRepository: PatientRepository) {}

  async execute({
    patientId,
  }: FetchProfileUseCaseRequest): Promise<FetchProfileUseCaseResponse> {
    const patient = await this.patientRepository.findById(patientId)
    if (!patient) {
      return left(new ResourceNotFound('Patient not found'))
    }

    return right({ profile: patient })
  }
}
