import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common'
import { FastifyReply } from 'fastify'
import { z } from 'zod'

import { InvalidCredentials } from '@/core/errors/use-cases/invalid-credentials'
import { AuthenticatePsychologistUseCase } from '@/domain/auth/application/use-cases/authenticate-psychologist'
import { Public } from '@/infra/auth/public'

import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const authenticatePsychologistBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

type AuthenticatePsychologistBody = z.infer<
  typeof authenticatePsychologistBodySchema
>

const zodValidationPipe = new ZodValidationPipe(
  authenticatePsychologistBodySchema,
)

@Controller('/auth/psychologists/authenticate')
export class AuthenticatePsychologistController {
  constructor(
    private readonly authenticatePsychologistUseCase: AuthenticatePsychologistUseCase,
  ) {}

  @Public()
  @Post()
  async handle(
    @Res({ passthrough: true }) res: FastifyReply,
    @Body(zodValidationPipe)
    { email, password }: AuthenticatePsychologistBody,
  ) {
    const result = await this.authenticatePsychologistUseCase.execute({
      email,
      password,
    })

    if (result.isLeft() && result.value instanceof InvalidCredentials) {
      console.log('ERROR:', result.value)
      throw new BadRequestException(result.value)
    }

    if (result.isRight()) {
      res.setCookie('psify@access_token', result.value.accessToken, {
        path: '/',
        httpOnly: true,
      })

      return res
        .status(HttpStatus.OK)
        .send({ access_token: result.value.accessToken })
    }
  }
}
