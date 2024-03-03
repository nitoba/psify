import { Controller, Get, NotFoundException } from '@nestjs/common'

import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'
import { FetchTimesAvailableToSchedulesUseCase } from '@/domain/psychologist/application/use-cases/fetch-times-available-to-schedules'
import { CurrentUser } from '@/infra/auth/decorators/current-user-decorator'
import { PayloadUser } from '@/infra/auth/strategies/jwt.strategy'

import { AvailableTimesPresenter } from '../../presenters/available-times-presenter'

@Controller('/psychologists/available-times')
export class FetchAvailableTimesController {
  constructor(
    private readonly useCase: FetchTimesAvailableToSchedulesUseCase,
  ) {}

  @Get()
  async handle(@CurrentUser() user: PayloadUser) {
    const result = await this.useCase.execute({
      psychologistId: user.sub,
    })

    if (result.isLeft() && result.value instanceof ResourceNotFound) {
      throw new NotFoundException(result.value)
    }

    if (result.isRight()) {
      return {
        availableTimes: result.value.availableTimes.map(
          AvailableTimesPresenter.toHttp,
        ),
      }
    }
  }
}
