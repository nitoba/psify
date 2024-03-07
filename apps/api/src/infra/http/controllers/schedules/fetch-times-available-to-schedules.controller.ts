import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common'

import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'
import { FetchTimesAvailableToSchedulesUseCase } from '@/domain/schedules/application/use-cases/fetch-times-available-to-schedules'

import { AvailableTimesPresenter } from '../../presenters/available-times-presenter'
import { RolesGuard } from '@/infra/auth/guards/roles-guard'
import { Roles } from '@/infra/auth/decorators/roles-decorator'
import { Role } from '@/infra/auth/roles'

@Controller('/schedules/psychologists/:psychologistId/available-times')
export class FetchAvailableTimesToSchedulesController {
  constructor(
    private readonly useCase: FetchTimesAvailableToSchedulesUseCase,
  ) {}

  @Get()
  @Roles(Role.Patient)
  @UseGuards(RolesGuard)
  async handle(@Param('psychologistId') psychologistId: string) {
    const result = await this.useCase.execute({
      psychologistId,
    })

    if (result.isLeft() && result.value instanceof ResourceNotFound) {
      throw new NotFoundException(result.value)
    }

    if (result.isRight()) {
      return {
        availableTimesToSchedules: result.value.availableTimesToSchedules.map(
          AvailableTimesPresenter.toHttp,
        ),
      }
    }
  }
}
