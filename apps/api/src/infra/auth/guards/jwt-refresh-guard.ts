import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { FastifyRequest } from 'fastify'
import { Observable } from 'rxjs'

import { Encrypter } from '@/domain/auth/application/cryptography/encrypter'

@Injectable()
export class JwtRefreshAuthGuard implements CanActivate {
  constructor(private jwtEncrypter: Encrypter) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest<FastifyRequest>()

    const refreshToken = req.cookies['psify@refresh_token']

    if (!refreshToken) {
      return false
    }

    const result = this.jwtEncrypter.verify(refreshToken)

    if (!result) {
      return false
    }

    return true
  }
}
