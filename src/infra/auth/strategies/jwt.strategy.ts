import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { FastifyRequest } from 'fastify'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { z } from 'zod'

import { EnvService } from '../../env/env.service'

const payloadTokenSchema = z.object({
  sub: z.string().uuid(),
})

type PayloadToken = z.infer<typeof payloadTokenSchema>

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(envService: EnvService) {
    const publicKey = envService.get('JTW_PUBLIC_KEY')
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWTFromCookie,
      ]),
      secretOrKey: Buffer.from(publicKey, 'base64'),
      algorithms: ['RS256'],
    })
  }

  async validate(payload: PayloadToken) {
    return payloadTokenSchema.parse(payload)
  }

  private static extractJWTFromCookie(req: FastifyRequest) {
    if (!req.cookies) return null
    return req.cookies['psify@access_token'] ?? null
  }
}
