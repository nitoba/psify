import { BadRequestException, Controller, Param, Put } from '@nestjs/common'
import { z } from 'zod'

import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'
import { InvalidResource } from '@/domain/core/enterprise/errors/invalid-resource'
import { FinishScheduledAppointmentUseCase } from '@/domain/schedules/application/use-cases/finish-scheduled-appointment'
import { Roles } from '@/infra/auth/decorators/roles-decorator'
import { Role } from '@/infra/auth/roles'

import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const finishScheduledAppointmentParamsSchema = z
  .string({ required_error: 'scheduledAppointmentId is required!' })
  .uuid({ message: 'scheduled appointment id must be a uuid' })

const zodValidator = new ZodValidationPipe(
  finishScheduledAppointmentParamsSchema,
)

@Controller('/schedules/:scheduledAppointmentId/finish')
export class FinishScheduledAppointmentController {
  constructor(private readonly useCase: FinishScheduledAppointmentUseCase) {}

  @Put()
  @Roles(Role.Psychologist)
  async handle(
    @Param('scheduledAppointmentId', zodValidator)
    scheduledAppointmentId: string,
  ) {
    const result = await this.useCase.execute({
      scheduledAppointmentId,
    })

    if (
      result.isLeft() &&
      (result.value instanceof ResourceNotFound ||
        result.value instanceof InvalidResource)
    ) {
      throw new BadRequestException(result.value)
    }

    if (result.isRight()) {
      return {
        message: 'Appointment finished successfully!',
      }
    }
  }
}
