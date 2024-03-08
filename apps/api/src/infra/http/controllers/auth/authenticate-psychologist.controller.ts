import {
  BadRequestException,
  Controller,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common'
import { FastifyReply } from 'fastify'

import { InvalidCredentials } from '@/core/errors/use-cases/invalid-credentials'
import { AuthenticatePsychologistUseCase } from '@/domain/auth/application/use-cases/authenticate-psychologist'
import { Public } from '@/infra/auth/decorators/public'
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest'
import { appRouter } from '@psyfi/api-contract'

@Controller('/auth/psychologists/authenticate')
export class AuthenticatePsychologistController {
  constructor(
    private readonly authenticatePsychologistUseCase: AuthenticatePsychologistUseCase,
  ) {}

  @Public()
  @Post()
  @TsRestHandler(appRouter.auth.authenticatePsychologist)
  async handle(@Res({ passthrough: true }) res: FastifyReply) {
    return tsRestHandler(
      appRouter.auth.authenticatePsychologist,
      async ({ body: { email, password } }) => {
        const result = await this.authenticatePsychologistUseCase.execute({
          email,
          password,
        })

        if (result.isLeft() && result.value instanceof InvalidCredentials) {
          const error = new BadRequestException(result.value)

          return {
            status: HttpStatus.BAD_REQUEST,
            body: {
              statusCode: error.getStatus(),
              error: error.name,
              message: error.message,
            },
          }
        }

        if (result.isRight()) {
          res.setCookie('psify@access_token', result.value.accessToken, {
            path: '/',
            httpOnly: true,
          })

          res.setCookie('psify@refresh_token', result.value.refreshToken, {
            path: '/',
            httpOnly: true,
          })

          return {
            status: HttpStatus.OK,
            body: {
              refresh_token: result.value.refreshToken,
              access_token: result.value.accessToken,
            },
          }
        }

        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          body: {
            message: 'Internal server error',
          },
        }
      },
    )
  }
}
