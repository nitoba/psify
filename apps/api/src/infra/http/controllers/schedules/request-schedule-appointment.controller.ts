import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common'
import { z } from 'zod'

import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'
import { InvalidResource } from '@/domain/core/enterprise/errors/invalid-resource'
import { RequestScheduleAppointmentUseCase } from '@/domain/schedules/application/use-cases/request-schedule-appointment'
import { CurrentUser } from '@/infra/auth/decorators/current-user-decorator'
import { PayloadUser } from '@/infra/auth/strategies/jwt.strategy'

import { AppointmentPresenter } from '../../presenters/appointment-presenter'

const requestScheduleAppointmentBodySchema = z.object({
  psychologistId: z.string().uuid(),
  scheduledTo: z.coerce.date(),
})

type RequestScheduleAppointmentBody = z.infer<
  typeof requestScheduleAppointmentBodySchema
>

@Controller('/schedules')
export class RequestScheduleAppointmentController {
  constructor(private useCase: RequestScheduleAppointmentUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async handle(
    @CurrentUser() patient: PayloadUser,
    @Body() { psychologistId, scheduledTo }: RequestScheduleAppointmentBody,
  ) {
    const patientId = patient.sub

    const result = await this.useCase.execute({
      patientId,
      psychologistId,
      scheduledTo: new Date(scheduledTo),
    })

    if (
      result.isLeft() &&
      (result.value instanceof InvalidResource ||
        result.value instanceof ResourceNotFound)
    ) {
      throw new BadRequestException(result.value)
    }

    if (result.isRight()) {
      console.log('Deu')
      return AppointmentPresenter.toHttp(result.value.appointment)
    }
  }
}
