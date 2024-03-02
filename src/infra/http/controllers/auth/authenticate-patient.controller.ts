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
import { AuthenticatePatientUseCase } from '@/domain/auth/application/use-cases/authenticate-patient'
import { Public } from '@/infra/auth/public'

import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const authenticatePatientBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

type AuthenticatePatientBody = z.infer<typeof authenticatePatientBodySchema>

const zodValidationPipe = new ZodValidationPipe(authenticatePatientBodySchema)

@Controller('/auth/patients/authenticate')
export class AuthenticatePatientController {
  constructor(
    private readonly authenticatePatientUseCase: AuthenticatePatientUseCase,
  ) {}

  @Public()
  @Post()
  async handle(
    @Res({ passthrough: true }) res: FastifyReply,
    @Body(zodValidationPipe)
    { email, password }: AuthenticatePatientBody,
  ) {
    const result = await this.authenticatePatientUseCase.execute({
      email,
      password,
    })

    if (result.isLeft() && result.value instanceof InvalidCredentials) {
      const error = new BadRequestException(result.value)
      return res.status(HttpStatus.BAD_REQUEST).send({
        statusCode: error.getStatus(),
        error: error.name,
        message: error.message,
      })
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
