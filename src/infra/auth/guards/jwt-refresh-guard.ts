import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { FastifyRequest } from 'fastify'
import { Observable } from 'rxjs'

@Injectable()
export class JwtRefreshAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest<FastifyRequest>()

    const refreshToken = req.cookies['psify@refresh_token']

    if (!refreshToken) {
      return false
    }

    const result = this.jwtService.verifyAsync(refreshToken)

    if (!result) {
      return false
    }

    return true
  }
}
