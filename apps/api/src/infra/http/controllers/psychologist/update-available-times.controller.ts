import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common'
import { z } from 'zod'

import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'
import { InvalidResource } from '@/domain/core/enterprise/errors/invalid-resource'
import { UpdateAvailableTimesUseCase } from '@/domain/psychologist/application/use-cases/update-available-times'
import { CurrentUser } from '@/infra/auth/decorators/current-user-decorator'
import { PayloadUser } from '@/infra/auth/strategies/jwt.strategy'

import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { Roles } from '@/infra/auth/decorators/roles-decorator'
import { RolesGuard } from '@/infra/auth/guards/roles-guard'
import { Role } from '@/infra/auth/roles'

const updateAvailableTimesParamsSchema = z.string().uuid()
const updateAvailableTimesBodySchema = z.object({
  time: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Time must be in format "HH:MM"',
  }),
  weekday: z.number().min(0).max(6),
})

const zodValidationPipe = new ZodValidationPipe(
  updateAvailableTimesParamsSchema,
)

const zodValidationPipeBody = new ZodValidationPipe(
  updateAvailableTimesBodySchema,
)

type UpdateAvailableTimesBody = z.infer<typeof updateAvailableTimesBodySchema>

@Controller('/psychologists/available-times')
export class UpdateAvailableTimesController {
  constructor(private readonly useCase: UpdateAvailableTimesUseCase) {}

  @Put(':availableTimeId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.Psychologist)
  @UseGuards(RolesGuard)
  async handle(
    @CurrentUser() user: PayloadUser,
    @Param('availableTimeId', zodValidationPipe)
    availableTimeId: string,
    @Body(zodValidationPipeBody) { time, weekday }: UpdateAvailableTimesBody,
  ) {
    const result = await this.useCase.execute({
      availableTimeId,
      time,
      weekday,
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
