import { Either, left, right } from '@/core/either'
import { InvalidCredentials } from '@/core/errors/use-cases/invalid-credentials'
import { Encrypter } from '../cryptography/encrypter'
import { Injectable } from '@nestjs/common'

type ReauthenticateUseCaseRequest = {
  refreshToken: string
}

type ReauthenticateUseCaseResponse = Either<
  InvalidCredentials,
  {
    accessToken: string
    refreshToken: string
  }
>

type TokenPayload = {
  sub: string
  email: string
  role: string
}

@Injectable()
export class ReauthenticateUseCase {
  constructor(private readonly encrypter: Encrypter) {}

  async execute({
    refreshToken,
  }: ReauthenticateUseCaseRequest): Promise<ReauthenticateUseCaseResponse> {
    const isValidToken = await this.encrypter.verify(refreshToken)

    if (!isValidToken) {
      return left(new InvalidCredentials())
    }

    const { email, role, sub } =
      await this.encrypter.decrypt<TokenPayload>(refreshToken)

    const newAccessToken = await this.encrypter.encrypt(
      {
        sub,
        email,
        role,
      },
      {
        expiresIn: '1d',
      },
    )

    const newRefreshToken = await this.encrypter.encrypt(
      {
        sub,
        email,
        role,
      },
      {
        expiresIn: '7d',
      },
    )

    return right({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    })
  }
}
