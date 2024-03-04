import { Either, left, right } from '@/core/either'
import { InvalidCredentials } from '@/core/errors/use-cases/invalid-credentials'

import { HashComparer } from '../cryptography/hash-comparer'
import { HashGenerator } from '../cryptography/hash-generator'
import { AuthPatientRepository } from '../repositories/auth-patient-repository'

type ChangePasswordFromPatientUseCaseRequest = {
  patientId: string
  oldPassword: string
  newPassword: string
}

type ChangePasswordFromPatientUseCaseResponse = Either<InvalidCredentials, void>

export class ChangePasswordFromPatientUseCase {
  constructor(
    private readonly authPatientRepository: AuthPatientRepository,
    private readonly hasherComparer: HashComparer,
    private readonly hasherGenerator: HashGenerator,
  ) {}

  async execute({
    patientId,
    oldPassword,
    newPassword,
  }: ChangePasswordFromPatientUseCaseRequest): Promise<ChangePasswordFromPatientUseCaseResponse> {
    const patient = await this.authPatientRepository.findById(patientId)

    if (!patient) {
      return left(new InvalidCredentials())
    }

    const passwordsMatch = await this.hasherComparer.compare(
      oldPassword,
      patient.password,
    )

    if (!passwordsMatch) {
      return left(new InvalidCredentials())
    }

    const newHashedPassword = await this.hasherGenerator.hash(newPassword)

    patient.changePassword(newHashedPassword)

    await this.authPatientRepository.save(patient)

    return right(undefined)
  }
}
