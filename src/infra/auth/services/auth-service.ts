import { Injectable } from '@nestjs/common'

import { Encrypter } from '@/domain/auth/application/cryptography/encrypter'

type Payload = {
  sub: string
}

@Injectable()
export class AuthService {
  constructor(private jwtEncrypter: Encrypter) {}

  async generateTokens(payload: Payload) {
    const token = await this.jwtEncrypter.encrypt(payload, {
      expiresIn: '1d',
    })
    const refreshToken = await this.jwtEncrypter.encrypt(
      { token },
      {
        expiresIn: '7d',
      },
    )

    return {
      token,
      refreshToken,
    }
  }

  async refreshToken(payload: Payload) {
    const token = await this.jwtEncrypter.encrypt(payload, {
      expiresIn: '1d',
    })
    const refreshToken = await this.jwtEncrypter.encrypt(
      { token },
      {
        expiresIn: '7d',
      },
    )

    return {
      token,
      refreshToken,
    }
  }
}
