import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { FastifyRequest } from 'fastify'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { z } from 'zod'

import { EnvService } from '../../env/env.service'

const payloadUserSchema = z.object({
  sub: z.string().uuid(),
  role: z.enum(['patient', 'psychologist']),
})

export type PayloadUser = z.infer<typeof payloadUserSchema>

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(envService: EnvService) {
    const publicKey = envService.get('JTW_PUBLIC_KEY')
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWTFromCookie,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: Buffer.from(publicKey, 'base64'),
      algorithms: ['RS256'],
    })
  }

  async validate(payload: PayloadUser) {
    return payloadUserSchema.parse(payload)
  }

  private static extractJWTFromCookie(req: FastifyRequest) {
    if (!req.cookies) return null
    return req.cookies['psify@access_token'] ?? null
  }
}
