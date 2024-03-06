import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { InvalidCredentials } from '@/core/errors/use-cases/invalid-credentials'

import { HashComparer } from '../cryptography/hash-comparer'
import { HashGenerator } from '../cryptography/hash-generator'
import { AuthPsychologistRepository } from '../repositories/auth-psychologist-repository'

type ChangePasswordFromPsychologistUseCaseRequest = {
  psychologistId: string
  oldPassword: string
  newPassword: string
}

type ChangePasswordFromPsychologistUseCaseResponse = Either<
  InvalidCredentials,
  void
>
@Injectable()
export class ChangePasswordFromPsychologistUseCase {
  constructor(
    private readonly authPsychologistRepository: AuthPsychologistRepository,
    private readonly hasherComparer: HashComparer,
    private readonly hasherGenerator: HashGenerator,
  ) {}

  async execute({
    psychologistId,
    oldPassword,
    newPassword,
  }: ChangePasswordFromPsychologistUseCaseRequest): Promise<ChangePasswordFromPsychologistUseCaseResponse> {
    const patient =
      await this.authPsychologistRepository.findById(psychologistId)

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

    await this.authPsychologistRepository.save(patient)

    return right(undefined)
  }
}
