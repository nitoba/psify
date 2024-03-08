import {
  BadRequestException,
  Controller,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common'
import { FastifyReply } from 'fastify'

import { InvalidCredentials } from '@/core/errors/use-cases/invalid-credentials'
import { AuthenticatePatientUseCase } from '@/domain/auth/application/use-cases/authenticate-patient'
import { Public } from '@/infra/auth/decorators/public'
import { appRouter } from '@psyfi/api-contract'
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest'

@Controller('/auth/patients/authenticate')
export class AuthenticatePatientController {
  constructor(
    private readonly authenticatePatientUseCase: AuthenticatePatientUseCase,
  ) {}

  @Public()
  @Post()
  @TsRestHandler(appRouter.auth.authenticatePatient)
  async handle(@Res({ passthrough: true }) res: FastifyReply) {
    return tsRestHandler(
      appRouter.auth.authenticatePatient,
      async ({ body: { email, password } }) => {
        const result = await this.authenticatePatientUseCase.execute({
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

          return {
            status: 200,
            body: {
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
