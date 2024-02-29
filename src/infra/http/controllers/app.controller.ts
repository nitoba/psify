import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common'
import { FastifyReply } from 'fastify'
import { z } from 'zod'

import { Encrypter } from '@/domain/auth/application/cryptography/encrypter'
import { JwtAuthGuard } from '@/infra/auth/guards/jwt-auth-guard'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email().min(1),
})

type CreateBodySchema = z.infer<typeof schema>

@Controller()
export class AppController {
  constructor(private readonly jwt: Encrypter) {}

  @Post()
  async hello(
    @Res({ passthrough: true }) res: FastifyReply,
    @Body(new ZodValidationPipe(schema)) body: CreateBodySchema,
  ) {
    const token = await this.jwt.encrypt(
      {
        sub: body.email,
      },
      {
        expiresIn: '1d',
      },
    )

    const refreshToken = await this.jwt.encrypt(
      { token },
      {
        expiresIn: '7d',
      },
    )

    res.setCookie('jwt', token, {
      path: '/',
      maxAge: 60 * 60 * 24,
      httpOnly: true,
    })

    return res.send({
      token,
      refreshToken,
    })
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  test() {
    return {
      ok: true,
    }
  }
}
