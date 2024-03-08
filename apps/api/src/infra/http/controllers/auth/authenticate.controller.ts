import { InvalidCredentials } from '@/core/errors/use-cases/invalid-credentials'
import { AuthenticateUseCase } from '@/domain/auth/application/use-cases/authenticate'
import { Public } from '@/infra/auth/decorators/public'
import {
  BadRequestException,
  Controller,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common'
import { appRouter } from '@psyfi/api-contract'
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest'
import { FastifyReply } from 'fastify'

@Controller('/auth/authenticate')
export class AuthenticateController {
  constructor(private useCase: AuthenticateUseCase) {}

  @Public()
  @Post()
  @TsRestHandler(appRouter.auth.authenticate)
  async handle(@Res({ passthrough: true }) res: FastifyReply) {
    return tsRestHandler(
      appRouter.auth.authenticate,
      async ({ body: { email, password } }) => {
        const result = await this.useCase.execute({
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
            sameSite: 'lax',
            httpOnly: true,
          })

          res.setCookie('psify@refresh_token', result.value.refreshToken, {
            path: '/',
            sameSite: 'lax',
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
