import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common'
import { z } from 'zod'

import { InvalidCredentials } from '@/core/errors/use-cases/invalid-credentials'
import { ChangePasswordFromPatientUseCase } from '@/domain/auth/application/use-cases/change-patient-password'
import { ChangePasswordFromPsychologistUseCase } from '@/domain/auth/application/use-cases/change-psychologist-password'
import { CurrentUser } from '@/infra/auth/decorators/current-user-decorator'
import { Role } from '@/infra/auth/roles'
import { PayloadUser } from '@/infra/auth/strategies/jwt.strategy'

import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const changePasswordBodySchema = z.object({
  oldPassword: z.string().min(6),
  newPassword: z.string().min(6),
})

const zodValidationPipe = new ZodValidationPipe(changePasswordBodySchema)

type ChangePasswordBody = z.infer<typeof changePasswordBodySchema>

@Controller('/auth/change-password')
export class ChangePasswordController {
  constructor(
    private readonly changePasswordFromPsychologistUseCase: ChangePasswordFromPsychologistUseCase,
    private readonly changePasswordFromPatientUseCase: ChangePasswordFromPatientUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async handle(
    @CurrentUser() { sub: userId, role }: PayloadUser,
    @Body(zodValidationPipe) { newPassword, oldPassword }: ChangePasswordBody,
  ) {
    if (role === Role.Patient) {
      const result = await this.changePasswordFromPatientUseCase.execute({
        patientId: userId,
        newPassword,
        oldPassword,
      })

      if (result.isLeft() && result.value instanceof InvalidCredentials) {
        console.log(result.value)
        throw new BadRequestException(result.value)
      }
    }
    if (role === Role.Psychologist) {
      const result = await this.changePasswordFromPsychologistUseCase.execute({
        psychologistId: userId,
        newPassword,
        oldPassword,
      })

      if (result.isLeft() && result.value instanceof InvalidCredentials) {
        console.log(result.value)

        throw new BadRequestException(result.value)
      }
    }

    return {
      message: 'Password changed successfully',
    }
  }
}
