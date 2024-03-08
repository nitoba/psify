import {
  BadRequestException,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common'

import { InvalidCredentials } from '@/core/errors/use-cases/invalid-credentials'
import { ChangePasswordFromPatientUseCase } from '@/domain/auth/application/use-cases/change-patient-password'
import { ChangePasswordFromPsychologistUseCase } from '@/domain/auth/application/use-cases/change-psychologist-password'
import { CurrentUser } from '@/infra/auth/decorators/current-user-decorator'
import { Role } from '@/infra/auth/roles'
import { PayloadUser } from '@/infra/auth/strategies/jwt.strategy'

import { TsRestHandler, tsRestHandler } from '@ts-rest/nest'
import { appRouter } from '@psyfi/api-contract'

@Controller('/auth/change-password')
export class ChangePasswordController {
  constructor(
    private readonly changePasswordFromPsychologistUseCase: ChangePasswordFromPsychologistUseCase,
    private readonly changePasswordFromPatientUseCase: ChangePasswordFromPatientUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @TsRestHandler(appRouter.auth.changePassword)
  async handle(@CurrentUser() { sub: userId, role }: PayloadUser) {
    return tsRestHandler(
      appRouter.auth.changePassword,
      async ({ body: { newPassword, oldPassword } }) => {
        if (role === Role.Patient) {
          const result = await this.changePasswordFromPatientUseCase.execute({
            patientId: userId,
            newPassword,
            oldPassword,
          })

          if (result.isLeft() && result.value instanceof InvalidCredentials) {
            console.log(result.value)
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
        }
        if (role === Role.Psychologist) {
          const result =
            await this.changePasswordFromPsychologistUseCase.execute({
              psychologistId: userId,
              newPassword,
              oldPassword,
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
        }

        return {
          status: 200,
          body: {
            message: 'Password changed successfully',
          },
        }
      },
    )
  }
}
