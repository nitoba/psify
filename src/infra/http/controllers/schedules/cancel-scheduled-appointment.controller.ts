import { BadRequestException, Controller, Param, Put } from '@nestjs/common'
import { z } from 'zod'

import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'
import { InvalidResource } from '@/domain/core/enterprise/errors/invalid-resource'
import { CancelScheduledAppointmentUseCase } from '@/domain/schedules/application/use-cases/cancel-scheduled-appointment'

import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const cancelScheduledAppointmentParamsSchema = z
  .string({ required_error: 'scheduledAppointmentId is required!' })
  .uuid({ message: 'scheduled appointment id must be a uuid' })

const zodValidator = new ZodValidationPipe(
  cancelScheduledAppointmentParamsSchema,
)

@Controller('/schedules/:scheduledAppointmentId/cancel')
export class CancelScheduledAppointmentController {
  constructor(private readonly useCase: CancelScheduledAppointmentUseCase) {}

  @Put()
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
        message: 'Appointment cancelled successfully!',
      }
    }
  }
}
