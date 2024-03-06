import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { InvalidCredentials } from '@/core/errors/use-cases/invalid-credentials'

import { Encrypter } from '../cryptography/encrypter'
import { HashComparer } from '../cryptography/hash-comparer'
import { AuthPsychologistRepository } from '../repositories/auth-psychologist-repository'

type AuthenticatePsychologistUseCaseRequest = {
  email: string
  password: string
}

type AuthenticatePsychologistUseCaseResponse = Either<
  InvalidCredentials,
  {
    accessToken: string
  }
>

@Injectable()
export class AuthenticatePsychologistUseCase {
  constructor(
    private readonly authPsychologistRepository: AuthPsychologistRepository,
    private readonly hasher: HashComparer,
    private readonly encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticatePsychologistUseCaseRequest): Promise<AuthenticatePsychologistUseCaseResponse> {
    const psychologist =
      await this.authPsychologistRepository.findByEmail(email)

    if (!psychologist) {
      return left(new InvalidCredentials())
    }

    const isValidPassword = await this.hasher.compare(
      password,
      psychologist.password,
    )

    if (!isValidPassword) {
      return left(new InvalidCredentials())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: psychologist.id.toString(),
      email: psychologist.email,
      role: 'psychologist',
    })

    return right({ accessToken })
  }
}
