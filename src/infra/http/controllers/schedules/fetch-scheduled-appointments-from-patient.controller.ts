import {
  BadRequestException,
  Controller,
  Get,
  ParseIntPipe,
  Query,
} from '@nestjs/common'
import { z } from 'zod'

import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'
import { InvalidResource } from '@/domain/core/enterprise/errors/invalid-resource'
import { FetchScheduledAppointmentsFromPatientUseCase } from '@/domain/schedules/application/use-cases/fetch-scheduled-appointments-from-patient'
import { CurrentUser } from '@/infra/auth/decorators/current-user-decorator'
import { PayloadUser } from '@/infra/auth/strategies/jwt.strategy'

import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { AppointmentPresenter } from '../../presenters/appointment-presenter'

const appointmentStatusesSchema = z
  .enum(['pending', 'canceled', 'finished', 'scheduled'])
  .default('pending')
  .optional()

const appointmentPeriodSchema = z.coerce.date().optional()

const zodValidatorStatuses = new ZodValidationPipe(appointmentStatusesSchema)
const zodValidatorPeriod = new ZodValidationPipe(appointmentPeriodSchema)

type AppointmentStatuses = z.infer<typeof appointmentStatusesSchema>

@Controller('/schedules/patients/appointments')
export class FetchScheduledAppointmentsFromPatientController {
  constructor(
    private readonly useCase: FetchScheduledAppointmentsFromPatientUseCase,
  ) {}

  @Get()
  async handle(
    @CurrentUser() { sub: patientId }: PayloadUser,
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('status', zodValidatorStatuses)
    status?: AppointmentStatuses,
    @Query('from', zodValidatorPeriod) from?: Date,
    @Query('to', zodValidatorPeriod) to?: Date,
  ) {
    const result = await this.useCase.execute({
      patientId,
      page,
      status,
      period: from && to ? { from, to } : undefined,
    })

    if (
      (result.isLeft() && result.value instanceof ResourceNotFound) ||
      result.value instanceof InvalidResource
    ) {
      throw new BadRequestException(result.value)
    }

    if (result.isRight()) {
      return {
        total: result.value.total,
        scheduledAppointments: result.value.scheduledAppointments.map(
          AppointmentPresenter.toHttp,
        ),
      }
    }
  }
}
