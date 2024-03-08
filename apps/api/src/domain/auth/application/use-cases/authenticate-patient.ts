import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { InvalidCredentials } from '@/core/errors/use-cases/invalid-credentials'

import { Encrypter } from '../cryptography/encrypter'
import { HashComparer } from '../cryptography/hash-comparer'
import { AuthPatientRepository } from '../repositories/auth-patient-repository'

type AuthenticatePatientUseCaseRequest = {
  email: string
  password: string
}

type AuthenticatePatientUseCaseResponse = Either<
  InvalidCredentials,
  {
    accessToken: string
    refreshToken: string
  }
>

@Injectable()
export class AuthenticatePatientUseCase {
  constructor(
    private readonly authPatientRepository: AuthPatientRepository,
    private readonly hasher: HashComparer,
    private readonly encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticatePatientUseCaseRequest): Promise<AuthenticatePatientUseCaseResponse> {
    const patient = await this.authPatientRepository.findByEmail(email)

    if (!patient) {
      return left(new InvalidCredentials())
    }

    const isValidPassword = await this.hasher.compare(
      password,
      patient.password,
    )

    if (!isValidPassword) {
      return left(new InvalidCredentials())
    }

    const accessToken = await this.encrypter.encrypt(
      {
        sub: patient.id.toString(),
        email: patient.email,
        role: 'patient',
      },
      {
        expiresIn: '1m',
      },
    )

    const refreshToken = await this.encrypter.encrypt(
      {
        sub: patient.id.toString(),
        email: patient.email,
        role: 'patient',
      },
      {
        expiresIn: '7d',
      },
    )

    return right({ accessToken, refreshToken })
  }
}
