import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { Encrypter } from '@/domain/auth/application/cryptography/encrypter'

@Injectable()
export class JwtEncrypter implements Encrypter {
  constructor(private readonly jwtService: JwtService) {}

  async decrypt<T>(token: string): Promise<T> {
    return this.jwtService.decode<T>(token)
  }

  async verify(token: string): Promise<boolean> {
    return !!this.jwtService.verifyAsync(token)
  }

  encrypt(
    payload: Record<string, unknown>,
    options?: Record<string, unknown>,
  ): Promise<string> {
    return this.jwtService.signAsync(payload, options)
  }
}
