import { Controller, Get, NotFoundException, UseGuards } from '@nestjs/common'

import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'
import { FetchAvailableTimesUseCase } from '@/domain/psychologist/application/use-cases/fetch-available-times'
import { CurrentUser } from '@/infra/auth/decorators/current-user-decorator'
import { PayloadUser } from '@/infra/auth/strategies/jwt.strategy'

import { AvailableTimesPresenter } from '../../presenters/available-times-presenter'
import { RolesGuard } from '@/infra/auth/guards/roles-guard'
import { Role } from '@/infra/auth/roles'
import { Roles } from '@/infra/auth/decorators/roles-decorator'

@Controller('/psychologists/available-times')
export class FetchAvailableTimesController {
  constructor(private readonly useCase: FetchAvailableTimesUseCase) {}

  @Get()
  @Roles(Role.Psychologist)
  @UseGuards(RolesGuard)
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
