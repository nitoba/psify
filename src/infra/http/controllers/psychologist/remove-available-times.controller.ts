import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
} from '@nestjs/common'
import { z } from 'zod'

import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'
import { InvalidResource } from '@/domain/core/enterprise/errors/invalid-resource'
import { RemoveAvailableTimeUseCase } from '@/domain/psychologist/application/use-cases/remove-available-time'
import { CurrentUser } from '@/infra/auth/decorators/current-user-decorator'
import { PayloadUser } from '@/infra/auth/strategies/jwt.strategy'

import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const removeAvailableTimesParamsSchema = z.string().uuid()

const zodValidationPipe = new ZodValidationPipe(
  removeAvailableTimesParamsSchema,
)

type RemoveAvailableTimesBody = z.infer<typeof removeAvailableTimesParamsSchema>

@Controller('/psychologists/available-times')
export class RemoveAvailableTimesController {
  constructor(private readonly useCase: RemoveAvailableTimeUseCase) {}

  @Delete(':availableTimeId')
  @HttpCode(HttpStatus.OK)
  async handle(
    @CurrentUser() user: PayloadUser,
    @Param('availableTimeId', zodValidationPipe)
    availableTimeId: RemoveAvailableTimesBody,
  ) {
    const result = await this.useCase.execute({
      availableTimeId,
      psychologistId: user.sub,
    })
    if (result.isLeft() && result.value instanceof ResourceNotFound) {
      throw new NotFoundException(result.value)
    }
    if (result.isLeft() && result.value instanceof InvalidResource) {
      throw new BadRequestException(result.value)
    }
  }
}
