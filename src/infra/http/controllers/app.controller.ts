import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common'
import { FastifyReply } from 'fastify'
import { z } from 'zod'

import { JwtRefreshAuthGuard } from '@/infra/auth/guards/jwt-refresh-guard'
import { Public } from '@/infra/auth/public'
import { AuthService } from '@/infra/auth/services/auth-service'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email().min(1),
})

type CreateBodySchema = z.infer<typeof schema>

@Controller()
export class AppController {
  constructor(private readonly auth: AuthService) {}

  @Post()
  @Public()
  async hello(
    @Res({ passthrough: true }) res: FastifyReply,
    @Body(new ZodValidationPipe(schema)) body: CreateBodySchema,
  ) {
    const { token, refreshToken } = await this.auth.generateTokens({
      sub: body.email,
    })

    res.setCookie('psify@access_token', token, {
      path: '/',
      maxAge: 60 * 60 * 24,
      httpOnly: true,
    })

    res.setCookie('psify@refresh_token', refreshToken, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: true,
    })

    return res.send({
      token,
      refreshToken,
    })
  }

  @Get()
  test() {
    return {
      ok: true,
    }
  }

  @Public()
  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  async refresh(@Res({ passthrough: true }) res: FastifyReply) {
    const { token, refreshToken } = await this.auth.refreshToken({
      sub: 'uuid',
    })

    res.setCookie('psify@access_token', token, {
      path: '/',
      maxAge: 60 * 60 * 24,
      httpOnly: true,
    })

    res.setCookie('psify@refresh_token', refreshToken, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: true,
    })
  }
}
