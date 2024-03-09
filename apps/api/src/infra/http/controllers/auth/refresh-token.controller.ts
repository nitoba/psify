/* eslint-disable camelcase */
import { InvalidCredentials } from '@/core/errors/use-cases/invalid-credentials'
import { ReauthenticateUseCase } from '@/domain/auth/application/use-cases/reauthenticate'
import { Public } from '@/infra/auth/decorators/public'
import {
  BadRequestException,
  Controller,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Res,
} from '@nestjs/common'
import { appRouter } from '@psyfi/api-contract'
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest'
import { FastifyReply } from 'fastify'

@Controller('/auth/refresh-token')
export class RefreshTokenController {
  constructor(private readonly reauthenticateUseCase: ReauthenticateUseCase) {}

  @Public()
  @Post()
  @TsRestHandler(appRouter.auth.refreshToken)
  async handle(@Res({ passthrough: true }) res: FastifyReply) {
    return tsRestHandler(
      appRouter.auth.refreshToken,
      async ({ body: { refresh_token } }) => {
        console.log(refresh_token)

        const result = await this.reauthenticateUseCase.execute({
          refreshToken: refresh_token,
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
          const { accessToken, refreshToken: newRefreshToken } = result.value

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
              access_token: accessToken,
              refresh_token: newRefreshToken,
            },
          }
        }

        throw new InternalServerErrorException()
      },
    )
  }
}
