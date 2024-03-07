import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common'
import { z } from 'zod'

import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'
import { InvalidResource } from '@/domain/core/enterprise/errors/invalid-resource'
import { AddAvailableTimeUseCase } from '@/domain/psychologist/application/use-cases/add-available-time'
import { CurrentUser } from '@/infra/auth/decorators/current-user-decorator'
import { PayloadUser } from '@/infra/auth/strategies/jwt.strategy'

import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { Roles } from '@/infra/auth/decorators/roles-decorator'
import { Role } from '@/infra/auth/roles'
import { RolesGuard } from '@/infra/auth/guards/roles-guard'

const addAvailableTimesBodySchema = z.object({
  availableTimes: z.array(
    z.object({
      time: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
        message: 'Time must be in format "HH:MM"',
      }),
      weekday: z.number().min(0).max(6),
    }),
  ),
})

const zodValidationPipe = new ZodValidationPipe(addAvailableTimesBodySchema)

type AddAvailableTimesBody = z.infer<typeof addAvailableTimesBodySchema>

@Controller('/psychologists/available-times')
export class AddAvailableTimesController {
  constructor(private readonly useCase: AddAvailableTimeUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.Psychologist)
  @UseGuards(RolesGuard)
  async handle(
    @CurrentUser() user: PayloadUser,
    @Body(zodValidationPipe) { availableTimes }: AddAvailableTimesBody,
  ) {
    const result = await this.useCase.execute({
      availableTimes,
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
