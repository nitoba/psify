import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { InvalidCredentials } from '@/core/errors/use-cases/invalid-credentials'

import { Encrypter } from '../cryptography/encrypter'
import { HashComparer } from '../cryptography/hash-comparer'
import { AuthUserRepository } from '../repositories/auth-user-repository'
import { Patient } from '../../enterprise/entities/patient'

type AuthenticateUseCaseRequest = {
  email: string
  password: string
}

type AuthenticateUseCaseResponse = Either<
  InvalidCredentials,
  {
    accessToken: string
    refreshToken: string
  }
>

@Injectable()
export class AuthenticateUseCase {
  constructor(
    private readonly authUserRepository: AuthUserRepository,
    private readonly hasher: HashComparer,
    private readonly encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const psychologistOrPatient =
      await this.authUserRepository.findByEmail(email)

    if (!psychologistOrPatient) {
      return left(new InvalidCredentials())
    }

    const isValidPassword = await this.hasher.compare(
      password,
      psychologistOrPatient.password,
    )

    if (!isValidPassword) {
      return left(new InvalidCredentials())
    }

    const role =
      psychologistOrPatient instanceof Patient ? 'patient' : 'psychologist'

    const accessToken = await this.encrypter.encrypt(
      {
        sub: psychologistOrPatient.id.toString(),
        email: psychologistOrPatient.email,
        role,
      },
      {
        expiresIn: '1h',
      },
    )

    const refreshToken = await this.encrypter.encrypt(
      {
        sub: psychologistOrPatient.id.toString(),
        email: psychologistOrPatient.email,
        role,
      },
      {
        expiresIn: '7d',
      },
    )

    return right({ accessToken, refreshToken })
  }
}
