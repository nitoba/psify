import {
  BadRequestException,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Put,
} from '@nestjs/common'
import { z } from 'zod'

import { ResourceNotFound } from '@/core/errors/use-cases/resource-not-found'
import { InvalidResource } from '@/domain/core/enterprise/errors/invalid-resource'
import { CancelOrderUseCase } from '@/domain/payment/application/use-cases/cancel-order'
import { Roles } from '@/infra/auth/decorators/roles-decorator'
import { Role } from '@/infra/auth/roles'

import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const cancelScheduledAppointmentParamsSchema = z
  .string({ required_error: 'orderID is required!' })
  .uuid({ message: 'order id must be a uuid' })

const orderIdValidator = new ZodValidationPipe(
  cancelScheduledAppointmentParamsSchema,
)

@Controller('/orders/:orderId/cancel')
export class CancelOrderController {
  constructor(private readonly useCase: CancelOrderUseCase) {}

  @Put()
  @HttpCode(HttpStatus.OK)
  @Roles(Role.Psychologist)
  async handle(@Param('orderId', orderIdValidator) orderId: string) {
    const result = await this.useCase.execute({
      orderId,
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
        message: 'Order cancelled successfully!',
      }
    }
  }
}
